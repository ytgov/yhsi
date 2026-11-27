/*
  Normalize stored latitude/longitude to the canonical form the app now writes.

  Canonical form (matches api/utils/coordinates.ts and web/src/utils/coordinates.js):
    - decimal degrees, no leading or trailing whitespace
    - at most 6 decimal places, no trailing zeros, no leading '+'
    - longitude always negative (every site is west of Greenwich)

  Only dbo.Place and dbo.PlaceEdit store coordinates as nvarchar(256), so they
  are the only ones that can carry stray whitespace or a non-numeric value. The
  other tables are float and can only be wrong in sign — step 3.

  RUN PART 1 FIRST. Rows it reports as unparseable are left untouched by the
  updates and need a decision — they are the most likely source of the CSW
  errors. Part 2 runs inside a transaction that ROLLBACKs by default; switch it
  to COMMIT once the affected row counts look right.
*/

------------------------------------------------------------------------------
-- Part 1: audit (read-only)
------------------------------------------------------------------------------

-- Values that will not parse as a number and so cannot be normalized here.
SELECT 'Place' AS [Table], Id, YHSIId, Latitude, Longitude
FROM dbo.Place
WHERE (Latitude IS NOT NULL AND LTRIM(RTRIM(Latitude)) <> ''
       AND TRY_CAST(LTRIM(RTRIM(Latitude)) AS decimal(12, 6)) IS NULL)
   OR (Longitude IS NOT NULL AND LTRIM(RTRIM(Longitude)) <> ''
       AND TRY_CAST(LTRIM(RTRIM(Longitude)) AS decimal(12, 6)) IS NULL)
UNION ALL
SELECT 'PlaceEdit', Id, YHSIId, Latitude, Longitude
FROM dbo.PlaceEdit
WHERE (Latitude IS NOT NULL AND LTRIM(RTRIM(Latitude)) <> ''
       AND TRY_CAST(LTRIM(RTRIM(Latitude)) AS decimal(12, 6)) IS NULL)
   OR (Longitude IS NOT NULL AND LTRIM(RTRIM(Longitude)) <> ''
       AND TRY_CAST(LTRIM(RTRIM(Longitude)) AS decimal(12, 6)) IS NULL);

-- Counts by problem, to sanity-check the update row counts below.
SELECT
	SUM(CASE WHEN Latitude <> LTRIM(RTRIM(Latitude))
	          OR Longitude <> LTRIM(RTRIM(Longitude)) THEN 1 ELSE 0 END) AS HasWhitespace,
	SUM(CASE WHEN TRY_CAST(Longitude AS decimal(12, 6)) > 0 THEN 1 ELSE 0 END) AS PositiveLongitude,
	SUM(CASE WHEN TRY_CAST(Latitude AS decimal(12, 6)) IS NULL
	          AND LTRIM(RTRIM(ISNULL(Latitude, ''))) <> '' THEN 1 ELSE 0 END) AS UnparseableLatitude,
	SUM(CASE WHEN TRY_CAST(Longitude AS decimal(12, 6)) IS NULL
	          AND LTRIM(RTRIM(ISNULL(Longitude, ''))) <> '' THEN 1 ELSE 0 END) AS UnparseableLongitude
FROM dbo.Place;
GO

------------------------------------------------------------------------------
-- Part 2: normalize
------------------------------------------------------------------------------

-- Canonicalize a decimal(12,6) into the app's string form: trailing zeros
-- stripped, then a bare trailing '.' stripped (so 60.000000 -> 60).
IF OBJECT_ID('dbo.fn_CanonicalCoordinate') IS NOT NULL
	DROP FUNCTION dbo.fn_CanonicalCoordinate;
GO
CREATE FUNCTION dbo.fn_CanonicalCoordinate (@value decimal(12, 6))
RETURNS nvarchar(50)
AS
BEGIN
	IF @value IS NULL RETURN NULL;

	DECLARE @text nvarchar(50) = CONVERT(nvarchar(50), @value);

	-- Only trim zeros when there is a decimal point to trim toward, or "1200"
	-- would lose its magnitude.
	IF CHARINDEX('.', @text) > 0
	BEGIN
		SET @text = REVERSE(SUBSTRING(REVERSE(@text), PATINDEX('%[^0]%', REVERSE(@text)), LEN(@text)));
		IF RIGHT(@text, 1) = '.' SET @text = LEFT(@text, LEN(@text) - 1);
	END

	RETURN @text;
END
GO

BEGIN TRANSACTION;

-- Step 1: dbo.Place / dbo.PlaceEdit (nvarchar) — trim, reformat, force west.
-- Unparseable values cast to NULL, so each column is only rewritten when it
-- parses; the audit above lists the ones this skips.
UPDATE dbo.Place
SET
	Latitude = COALESCE(
		dbo.fn_CanonicalCoordinate(TRY_CAST(LTRIM(RTRIM(Latitude)) AS decimal(12, 6))),
		Latitude
	),
	Longitude = COALESCE(
		dbo.fn_CanonicalCoordinate(-ABS(TRY_CAST(LTRIM(RTRIM(Longitude)) AS decimal(12, 6)))),
		Longitude
	)
WHERE TRY_CAST(LTRIM(RTRIM(Latitude)) AS decimal(12, 6)) IS NOT NULL
   OR TRY_CAST(LTRIM(RTRIM(Longitude)) AS decimal(12, 6)) IS NOT NULL;

UPDATE dbo.PlaceEdit
SET
	Latitude = COALESCE(
		dbo.fn_CanonicalCoordinate(TRY_CAST(LTRIM(RTRIM(Latitude)) AS decimal(12, 6))),
		Latitude
	),
	Longitude = COALESCE(
		dbo.fn_CanonicalCoordinate(-ABS(TRY_CAST(LTRIM(RTRIM(Longitude)) AS decimal(12, 6)))),
		Longitude
	)
WHERE TRY_CAST(LTRIM(RTRIM(Latitude)) AS decimal(12, 6)) IS NOT NULL
   OR TRY_CAST(LTRIM(RTRIM(Longitude)) AS decimal(12, 6)) IS NOT NULL;

-- Step 2: float columns — sign only. Guarded, since not every deployment has
-- every one of these tables.
IF OBJECT_ID('Place.Place') IS NOT NULL
	UPDATE [Place].[Place] SET Longitude = -ABS(Longitude) WHERE Longitude > 0;

IF OBJECT_ID('InterpretiveSite.Sites') IS NOT NULL
	UPDATE [InterpretiveSite].[Sites] SET Longitude = -ABS(Longitude) WHERE Longitude > 0;

IF OBJECT_ID('Burial.CemetaryLookup') IS NOT NULL
	UPDATE [Burial].[CemetaryLookup] SET Longitude = -ABS(Longitude) WHERE Longitude > 0;

IF OBJECT_ID('dbo.clate') IS NOT NULL
	UPDATE [dbo].[clate] SET Longitude = -ABS(Longitude) WHERE Longitude > 0;

-- Change to COMMIT TRANSACTION once the affected row counts have been reviewed.
ROLLBACK TRANSACTION;
GO

DROP FUNCTION dbo.fn_CanonicalCoordinate;
GO
