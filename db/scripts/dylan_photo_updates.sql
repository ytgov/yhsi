-- Fix isPrivate spelling
Exec sp_rename 'dbo.Photo.isPirvate', 'isPrivate', 'Column';
Go

update photo set isPrivate = 0;
ALTER TABLE dbo.Photo ALTER COLUMN isPrivate bit NOT NULL;
Go

-- Add place PK and FK
ALTER TABLE dbo.Place
ADD PRIMARY KEY (Id)
Go

ALTER TABLE dbo.Photo ADD FOREIGN KEY (PlaceId) REFERENCES dbo.Place(id);
Go

ALTER TABLE place.photo ALTER COLUMN Photo_RowID nvarchar(255) NOT NULL;
Go

-- Create PhotoSubject lookup table
CREATE TABLE [dbo].[PhotoSubject](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](256) NOT NULL,
 CONSTRAINT [PK_PhotoSubject] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

INSERT INTO PhotoSubject (name)
VALUES
    ('Building'),
    ('Structural Detail'),
    ('Site General'),
    ('Scenic'),
    ('Interpretation'),
    ('Work Activities'),
    ('Cemetary'),
    ('Facilities'),
    ('People'),
    ('Aerial'),
    ('Fossil Fauna'),
    ('Artifact'),
    ('Interior'),
    ('Archaelogy'),
    ('Foundation'),
    ('Machinery'),
    ('Industrial Structure'),
    ('Civil Structure');
GO

 ALTER TABLE dbo.photo ADD photoSize AS (case when ((ImageHeight * ImageWidth) < 1920000) then 'small'
	when ((ImageHeight * ImageWidth) < 5947392) then 'medium'
	else 'large' end) PERSISTED;
GO

/* Decided the photoprogram tables are unnecessary since we already have linking tables, just use those. Keeping these scripts in case I want them
-- Create PhotoProgram lookup table
-- drop table [PhotoProgram]
CREATE TABLE [dbo].[PhotoProgram](
	Photo_RowId nvarchar(255) NOT NULL,
	[PhotoProgramLookupId] [int] NOT NULL
);
GO

--drop table PhotoProgramLookup
CREATE TABLE [dbo].[PhotoProgramLookup](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Program] nvarchar(256) NOT NULL
);
GO

INSERT INTO PhotoProgramLookup (program)
VALUES
    ('Place'),
    ('Boat'),
    ('Airplane Crash');
GO

-- Testing script to populate
insert into photoprogram (photo_rowid, PhotoProgramLookupId) 
select photo_rowid, 1 from place.photo where placeid = 1;
*/