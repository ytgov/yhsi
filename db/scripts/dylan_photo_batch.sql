EXEC sp_rename 'YHS_PhotoBatch', 'PhotoBatch';
GO

EXEC sp_rename 'YHS_PhotoBatchPhoto', 'PhotoBatchPhoto';
GO

Exec sp_rename 'dbo.PhotoBatch.CreateDate', 'DateCreated', 'Column';
Go

ALTER TABLE dbo.PhotoBatch ADD isPrivate bit NOT NULL default 0;
Go

ALTER TABLE photobatch ALTER COLUMN communityId INT NULL
GO

ALTER TABLE photobatch ALTER COLUMN originalMediaId INT NULL
GO

ALTER TABLE photobatch ALTER COLUMN mediastorage INT NULL
GO

ALTER TABLE photobatch ALTER COLUMN copyright INT NULL
GO

ALTER TABLE photobatch ALTER COLUMN ownerid INT NULL
GO

ALTER TABLE photobatch ALTER COLUMN photoprojectid INT NULL
GO

ALTER TABLE photobatch ALTER COLUMN program INT NULL
GO

ALTER TABLE photobatch
ADD CONSTRAINT isotherrecordDefault
DEFAULT 0 FOR isotherrecord;
GO

-- Note these two contraints may already be in place, I wasn't sure if they were in test so I added them just in case
ALTER TABLE photobatch
ADD CONSTRAINT isCompleteDefault
DEFAULT 0 FOR isComplete;
GO

ALTER TABLE photobatch
ADD CONSTRAINT isPrivateDefault
DEFAULT 0 FOR isPrivate;
GO

alter table photobatchphoto add ThumbFile varbinary(max);
GO