import type { Knex } from "knex"

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
CREATE VIEW [dbo].[Place_ConstructionPeriods] AS
SELECT PlaceId,
	CASE WHEN [Type] = 1 THEN 'Pre 1895'
	WHEN [Type] = 2 THEN 'From 1896 to 1905'
	WHEN [Type] = 3 THEN 'From 1906 to 1939'
	WHEN [Type] = 4 THEN 'From 1940 to 1965'
	WHEN [Type] = 5 THEN 'Post 1965'
END AS Period
FROM ConstructionPeriod
`)

  await knex.raw(`
CREATE VIEW [dbo].[CSW_Place_Constructions_VW] AS
SELECT YHSIId, COALESCE(STUFF((select DISTINCT ',' + Period FROM [Place_ConstructionPeriods] WHERE [Place_ConstructionPeriods].PlaceId = Place.Id FOR XML PATH('')),1,1,''),'') AS Periods
FROM Place
GROUP BY YHSIId, Id
`)

  await knex.raw(`
CREATE VIEW [dbo].[Place_FNNames] AS
select PlaceId, Description AS FNName
FROM FirstNationAssociation
INNER JOIN FirstNation ON FirstNationAssociation.FirstNationId = FirstNation.Id
`)

  await knex.raw(`
CREATE VIEW [dbo].[CSW_Place_FirstNations_VW] AS
SELECT YHSIId, COALESCE(STUFF((select DISTINCT ',' + FNName FROM Place_FNNames WHERE Place_FNNames.PlaceId = Place.Id FOR XML PATH('')),1,1,''),'') AS FNNames
FROM Place
GROUP BY YHSIId, Id
`)

  await knex.raw(`
CREATE VIEW [dbo].[CSW_Import_VW]
AS
SELECT        t1.YHSIId, t1.PrimaryName, t1.SiteCategories, t2.Name AS CommunityName, t1.NTSMapSheet, ROUND(t1.Latitude, 5) AS Latitude, ROUND(t1.Longitude, 5)
                         AS Longitude, t1.CurrentUseComment AS CurrentUse, t1.YHSPastUse AS PastUse, t1.YHSThemes AS Themes, t3.FNNames, t4.Periods,
                         ss.Description AS SiteStatus
FROM            dbo.Place AS t1 INNER JOIN
                         dbo.Community AS t2 ON t1.CommunityId = t2.Id INNER JOIN
                         dbo.CSW_Place_FirstNations_VW AS t3 ON t1.YHSIId = t3.YHSIId LEFT OUTER JOIN
                         dbo.CSW_Place_Constructions_VW AS t4 ON t1.YHSIId = t4.YHSIId LEFT OUTER JOIN
                         dbo.Site_Status_CD AS ss ON ss.Code = t1.SiteStatus
WHERE        (t1.Latitude IS NOT NULL) AND (t1.Latitude NOT LIKE '%\\?%') AND (t1.Latitude NOT LIKE '%°%') AND (t1.Latitude NOT LIKE '% %') AND (t1.Latitude NOT LIKE '%N%')
	AND t1.deleted_at IS NULL
`)

  await knex.raw(`
CREATE VIEW [dbo].[Prod_Photos]
AS
SELECT        Id, OriginalFileName, FeatureName, YHSIRecord, IsComplete, PhotoProjectId, OriginalMediaId, CommunityId, PlaceId, OwnerId, Subjects
FROM            dbo.Photo
`)

  await knex.raw(`
CREATE VIEW [dbo].[Register_Description] AS

  SELECT
  Description.Id,
  Description.PlaceId,
  Description.Type,
  Description.DescriptionText AS Description
  FROM Description INNER JOIN Place ON Description.PlaceId = Place.Id
WHERE Place.ShowInRegister = 1
`)

  await knex.raw(`
CREATE VIEW [dbo].[Register_Place]
AS
SELECT        dbo.Place.Id, dbo.Place.PrimaryName AS Name, '' AS Address, CASE WHEN Community.Name = 'None' THEN 'Other Locations' ELSE Community.Name END AS City, dbo.Place.Latitude AS LatitudeWrong,
                         dbo.Place.Longitude AS LongitudeWrong, dbo.Place.BuildingSize, dbo.Place.ConditionComment, dbo.Place.CurrentUseComment, dbo.Place.YHSPastUse, dbo.Place.LocationContext,
                         CP.Type AS ConstructionPeriodCode, dbo.Place.RecognitionDate, dbo.Place.Designations
FROM            dbo.Place LEFT OUTER JOIN
                             (SELECT        PlaceId, MIN(Type) AS Type
                               FROM            dbo.ConstructionPeriod
                               GROUP BY PlaceId) AS CP ON dbo.Place.Id = CP.PlaceId LEFT OUTER JOIN
                         dbo.Community ON dbo.Place.CommunityId = dbo.Community.Id
WHERE        (dbo.Place.ShowInRegister = 1)
`)

  await knex.raw(`
CREATE  VIEW [dbo].[User_CSW_Import_VW] AS
SELECT YHSIId, PrimaryName, NTSMapSheet, SUBSTRING(NTSMapSheet,0,5) NTS250,Latitude, Longitude,

MAX(CASE WHEN t=1 AND d=1 THEN 1 ELSE 0 END) CTFN_1,
MAX(CASE WHEN t=2 AND d=1 THEN 1 ELSE 0 END) CTFN_2,

MAX(CASE WHEN t=1 AND d=2 THEN 1 ELSE 0 END) CAFN_1,
MAX(CASE WHEN t=2 AND d=2 THEN 1 ELSE 0 END) CAFN_2,

MAX(CASE WHEN t=1 AND d=3 THEN 1 ELSE 0 END) KDN_1,
MAX(CASE WHEN t=2 AND d=3 THEN 1 ELSE 0 END) KDN_2,

MAX(CASE WHEN t=1 AND d=4 THEN 1 ELSE 0 END) KLU_1,
MAX(CASE WHEN t=2 AND d=4 THEN 1 ELSE 0 END) KLU_2,

MAX(CASE WHEN t=1 AND d=5 THEN 1 ELSE 0 END) KDFN_1,
MAX(CASE WHEN t=2 AND d=5 THEN 1 ELSE 0 END) KDFN_2,

MAX(CASE WHEN t=1 AND d=6 THEN 1 ELSE 0 END) LFN_1,
MAX(CASE WHEN t=2 AND d=6 THEN 1 ELSE 0 END) LFN_2,

MAX(CASE WHEN t=1 AND d=7 THEN 1 ELSE 0 END) LSCFN_1,
MAX(CASE WHEN t=2 AND d=7 THEN 1 ELSE 0 END) LSCFN_2,

MAX(CASE WHEN t=1 AND d=8 THEN 1 ELSE 0 END) NCND_1,
MAX(CASE WHEN t=2 AND d=8 THEN 1 ELSE 0 END) NCND_2,

MAX(CASE WHEN t=1 AND d=9 THEN 1 ELSE 0 END) RRD_1,
MAX(CASE WHEN t=2 AND d=9 THEN 1 ELSE 0 END) RRD_2,

MAX(CASE WHEN t=1 AND d=10 THEN 1 ELSE 0 END) SFN_1,
MAX(CASE WHEN t=2 AND d=10 THEN 1 ELSE 0 END) SFN_2,

MAX(CASE WHEN t=1 AND d=11 THEN 1 ELSE 0 END) TK_1,
MAX(CASE WHEN t=2 AND d=11 THEN 1 ELSE 0 END) TK_2,

MAX(CASE WHEN t=1 AND d=12 THEN 1 ELSE 0 END) TTFN_1,
MAX(CASE WHEN t=2 AND d=12 THEN 1 ELSE 0 END) TTFN_2,

MAX(CASE WHEN t=1 AND d=13 THEN 1 ELSE 0 END) TH_1,
MAX(CASE WHEN t=2 AND d=13 THEN 1 ELSE 0 END) TH_2,

MAX(CASE WHEN t=1 AND d=14 THEN 1 ELSE 0 END) VG_1,
MAX(CASE WHEN t=2 AND d=14 THEN 1 ELSE 0 END) VG_2,

MAX(CASE WHEN t=1 AND d=15 THEN 1 ELSE 0 END) WR_1,
MAX(CASE WHEN t=2 AND d=15 THEN 1 ELSE 0 END) WR_2,

MAX(CASE WHEN t=1 AND d=16 THEN 1 ELSE 0 END) INU_1,
MAX(CASE WHEN t=2 AND d=16 THEN 1 ELSE 0 END) INU_2

FROM (
SELECT DISTINCT p.YHSIId, p.PrimaryName, p.NTSMapSheet, a.FirstNationAssociationType t, a.FirstNationId d, p.Latitude, p.Longitude
FROM dbo.Place p
INNER JOIN dbo.FirstNationAssociation a ON (p.Id = a.PlaceId)
INNER JOIN dbo.FirstNation f ON (a.FirstNationId = f.Id)
) a -- WHERE YHSIId = '105D/08/011'
GROUP BY YHSIId, PrimaryName, NTSMapSheet, Latitude, Longitude
`)

  await knex.raw(`
CREATE VIEW [dbo].[vAircrash]
    AS

SELECT yacsinumber, crashdate, aircrafttype, aircraftregistration, nation, militarycivilian, crashlocation, remainsonsite
     , extentofremainsonsite, otherlocationsofremains, pilot, fatalities, descriptionofcrashevent, comments, significanceofaircraft
     , sources, photographs, inyukon, soulsonboard, injuries, datedescriptor, datenote, pilotlastname, pilotfirstname, pilotrank
     , accuracy, aircraftcaption, aircraftaftercrashcaption, [location].ToString() as Location,[location].Lat as lat,[location].Long as long FROM AirCrash.AirCrash
`)

  await knex.raw(`
CREATE VIEW [dbo].[YHSI_CSW_Import_VW]
AS
select
	distinct YHSIId, PrimaryName, SiteCategories, CommunityName, NTSMapSheet, Latitude,
				Longitude, Condition, CurrentUse, PastUse,
				Themes, FNNames, Periods, SiteStatus, PlaceDescription, CulturalHistory, LastVisitedDate, LastVisitedBy,
				RecordUpdateDate, RecordUpdateBy, ConstructionStyle, HistoricalSourcesLocation, CONCAT('https://yhis.gov.yk.ca/sites/', Id) as [URL]
from (
SELECT     t1.Id, t1.YHSIId, t1.PrimaryName, t1.SiteCategories, t2.Name AS CommunityName, t1.NTSMapSheet, ROUND(t1.Latitude, 5) AS Latitude,
				ROUND(t1.Longitude, 5) AS Longitude, t1.ConditionComment as Condition, t1.CurrentUseComment AS CurrentUse, t1.YHSPastUse AS PastUse,
				t1.YHSThemes AS Themes, t3.FNNames, t4.Periods, ss.Description AS SiteStatus
FROM         dbo.Place AS t1
	LEFT JOIN dbo.Community AS t2 ON t1.CommunityId = t2.Id
	INNER JOIN dbo.CSW_Place_FirstNations_VW AS t3 ON t1.YHSIId = t3.YHSIId
	LEFT OUTER JOIN dbo.CSW_Place_Constructions_VW AS t4 ON t1.YHSIId = t4.YHSIId
	LEFT OUTER JOIN dbo.Site_Status_CD AS ss ON ss.Code = t1.SiteStatus
WHERE
  t1.deleted_at IS NULL AND
(t1.Latitude IS NOT NULL) AND (t1.Latitude NOT LIKE '%\\?%') AND (t1.Latitude NOT LIKE '%°%')
	AND (t1.Latitude NOT LIKE '% %') AND (t1.Latitude NOT LIKE '%N%') AND (TRY_PARSE(t1.Longitude AS FLOAT) IS NOT NULL)
	AND (TRY_PARSE(t1.Latitude AS FLOAT) IS NOT NULL)
) s1 LEFT JOIN (
	SELECT PlaceId, DescriptionText as 'PlaceDescription'  from dbo.description where [Type] = '5'
) s2 ON s1.Id = s2.PlaceId LEFT JOIN (
	SELECT PlaceId, DescriptionText as 'CulturalHistory'  from dbo.description where [Type] = '12'
) s6 ON s1.Id = s6.PlaceId LEFT JOIN (
	SELECT PlaceId, DescriptionText as 'ConstructionStyle'  from dbo.description where [Type] = '10'
) s7 ON s1.Id = s7.PlaceId LEFT JOIN (
	SELECT PlaceId, DescriptionText as 'HistoricalSourcesLocation'  from dbo.description where [Type] = '8'
) s3 ON s1.Id = s3.PlaceId LEFT JOIN (
	SELECT t.PlaceId, max_date as LastVisitedDate, t.RevisedBy as LastVisitedBy from
		dbo.RevisionLog t
		INNER JOIN
		(SELECT PlaceId,MAX(RevisionDate) as max_date
		from dbo.RevisionLog
		where RevisionLogType=5
		group by PlaceId) a
		on a.PlaceId = t.PlaceId and a.max_date = RevisionDate
) s4 on s1.ID = s4.PlaceId LEFT JOIN (
	SELECT t.PlaceId, max_date as RecordUpdateDate, t.RevisedBy as RecordUpdateBy from
		dbo.RevisionLog t
		INNER JOIN
		(SELECT PlaceId,MAX(RevisionDate) as max_date
		from dbo.RevisionLog
		where RevisionLogType=2
		group by PlaceId) a
		on a.PlaceId = t.PlaceId and a.max_date = RevisionDate
) s5 on s1.ID = s5.PlaceId
`)

  await knex.raw(`
CREATE VIEW [YHIS].[Aircrash_CSW_Import_View]
    AS

SELECT yacsinumber, crashdate, aircrafttype, aircraftregistration, nation, militarycivilian, crashlocation, pilot, descriptionofcrashevent, accuracy,  [location].ToString() as Location,[location].Lat as lat,[location].Long as long FROM AirCrash.AirCrash
`)

  await knex.raw(`
-- Select rows from a Table or View '[Photo]' in schema '[dbo]'
CREATE VIEW [YRHP].[PrimaryPhoto] as
SELECT PlaceId, RowID
FROM [dbo].[Photo]
WHERE YRHPOrder = 1;
`)

  await knex.raw(`
-- CREATE SCHEMA YRHP
CREATE VIEW [YRHP].[YRHPSites] AS
SELECT DBO.Place.PrimaryName, DBO.Community.Name as Community
      ,dbo.place.YHSIId
      ,dbo.place.Latitude
      ,dbo.place.Longitude
      ,dbo.place.Designations
      ,dbo.place.RecognitionDate
      ,dbo.place.EnglishTeaser
      ,dbo.place.FrenchTeaser
      ,dbo.Place.Id as PlaceId
      --,YRHP.PrimaryPhoto.RowId as PhotoID
      ,('https://heritage.ynet.gov.yk.ca/api/register/' + convert (varchar(5), dbo.place.id) + '/photos/' + convert (varchar(40), YRHP.PrimaryPhoto.RowId)) as PhotoURL
FROM DBO.Place
Left Outer JOIN DBO.Community ON dbo.Place.CommunityId=dbo.community.Id
Left Outer join YRHP.PrimaryPhoto on dbo.Place.Id = YRHP.PrimaryPhoto.PlaceId
WHERE ShowInRegister = 1;
`)

  await knex.raw(`
CREATE VIEW [YRHP].[Photo]
AS
SELECT  Photo.*
FROM  dbo.Photo INNER JOIN dbo.Place ON dbo.Photo.PlaceId = dbo.Place.Id
WHERE (dbo.Place.ShowInRegister = 1) AND Photo.ShowInRegister = 1
`)

  await knex.raw(`
create view [YRHP].[PlaceConstruction] AS
SELECT PlaceId,
	CASE WHEN [Type] = 1 THEN 'Pre 1895'
	WHEN [Type] = 2 THEN 'From 1896 to 1905'
	WHEN [Type] = 3 THEN 'From 1906 to 1939'
	WHEN [Type] = 4 THEN 'From 1940 to 1965'
	WHEN [Type] = 5 THEN 'Post 1965'
END AS Period,
	CASE WHEN [Type] = 1 THEN 'Avant 1895'
	WHEN [Type] = 2 THEN 'Entre 1896 et 1905'
	WHEN [Type] = 3 THEN 'Entre 1906 et 1939'
	WHEN [Type] = 4 THEN 'Entre 1940 et 1965'
	WHEN [Type] = 5 THEN 'Après 1965'
END AS FR_Period
FROM ConstructionPeriod
 INNER JOIN Place ON Place.id = ConstructionPeriod.PlaceId AND Place.ShowInRegister = 1
`)

  await knex.raw(`
CREATE VIEW [YRHP].[PlaceDescriptions]
AS
SELECT   dbo.Description.Id, dbo.Description.PlaceId, dbo.Description.Type, dbo.Description.DescriptionText AS Description, dbo.Description.FR_DescriptionText
FROM         dbo.Description INNER JOIN
                         dbo.Place ON dbo.Description.PlaceId = dbo.Place.Id
WHERE     (dbo.Place.ShowInRegister = 1)
`)

  await knex.raw(`
CREATE VIEW [YRHP].[PlaceEnglish] AS
  SELECT dbo.Place.Id, dbo.Place.PrimaryName, dbo.Place.YHSIId, dbo.Community.Name AS CommunityName, dbo.Place.Latitude, dbo.Place.Longitude, dbo.Place.Designations, dbo.Place.RecognitionDate
  FROM   dbo.Place INNER JOIN dbo.Community ON dbo.Place.CommunityId = dbo.Community.Id
  WHERE  dbo.Place.ShowInRegister = 1;
`)

  await knex.raw(`
CREATE VIEW [YRHP].[PlaceFrench] AS
  SELECT dbo.Place.Id, dbo.Place.FR_PrimaryName as PrimaryName, dbo.Place.YHSIId, dbo.Community.FR_Name AS CommunityName, dbo.Place.Latitude, dbo.Place.Longitude, dbo.Place.FR_Designations AS Designations, dbo.Place.RecognitionDate
  FROM   dbo.Place INNER JOIN dbo.Community ON dbo.Place.CommunityId = dbo.Community.Id
  WHERE  dbo.Place.ShowInRegister = 1;
`)
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.withSchema("YRHP").dropView("PlaceFrench")
  await knex.schema.withSchema("YRHP").dropView("PlaceEnglish")
  await knex.schema.withSchema("YRHP").dropView("PlaceDescriptions")
  await knex.schema.withSchema("YRHP").dropView("PlaceConstruction")
  await knex.schema.withSchema("YRHP").dropView("Photo")
  await knex.schema.withSchema("YRHP").dropView("YRHPSites")
  await knex.schema.withSchema("YRHP").dropView("PrimaryPhoto")
  await knex.schema.withSchema("YHIS").dropView("Aircrash_CSW_Import_View")
  await knex.schema.withSchema("dbo").dropView("YHSI_CSW_Import_VW")
  await knex.schema.withSchema("dbo").dropView("vAircrash")
  await knex.schema.withSchema("dbo").dropView("User_CSW_Import_VW")
  await knex.schema.withSchema("dbo").dropView("Register_Place")
  await knex.schema.withSchema("dbo").dropView("Register_Description")
  await knex.schema.withSchema("dbo").dropView("Prod_Photos")
  await knex.schema.withSchema("dbo").dropView("CSW_Import_VW")
  await knex.schema.withSchema("dbo").dropView("CSW_Place_FirstNations_VW")
  await knex.schema.withSchema("dbo").dropView("Place_FNNames")
  await knex.schema.withSchema("dbo").dropView("CSW_Place_Constructions_VW")
  await knex.schema.withSchema("dbo").dropView("Place_ConstructionPeriods")
}
