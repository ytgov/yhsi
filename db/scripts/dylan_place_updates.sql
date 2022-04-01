-- Delete blank places
delete from place.place where name = '';
Go

-- Make placetypelookup id column into an identity (to auto-generate sequential ids)
Alter Table Place.PlaceTypeLookup
Add Id_new Int Identity(1, 1)
Go

Alter Table Place.PlaceTypeLookup Drop Column Id
Go

Exec sp_rename 'Place.PlaceTypeLookup.Id_new', 'Id', 'Column';
Go

ALTER TABLE Place.PlaceTypeLookup
ADD PRIMARY KEY (Id);
Go


-- Update placetype table to match ERD
select * from place.placetype;
Go

Exec sp_rename 'Place.placetype.Id', 'PlaceId', 'Column';
Go

Alter Table Place.placetype Add PlaceTypeLookupId Int; 
Go

UPDATE place.placetype
SET    PlaceTypeLookupId = place.placetypelookup.id
FROM   place.placetypelookup
WHERE  place.placetypelookup.placetype = place.placetype.Type;
Go

Alter Table Place.placetype Drop Column type;
Go

-- SQL says this FK already exists
--ALTER TABLE Place.placetype ADD FOREIGN KEY (PlaceId) REFERENCES place.place(id);
ALTER TABLE Place.placetype ADD FOREIGN KEY (PlaceTypeLookupId) REFERENCES place.placetypelookup(id);
Go


-- Note everything above this I sent to Diedre already 

-- Add Accuracy
Alter Table Place.Place Add Accuracy Varchar2(30);
Go

-- Add remaining IDs
-- Place.Photo
Alter Table Place.Photo
Add Id_new Int Identity(1, 1)
Go

ALTER TABLE Place.Photo 
DROP CONSTRAINT PK__Photo__3214EC07B13250E3;  
GO  

Alter Table Place.Photo Drop Column Id
Go

Exec sp_rename 'Place.Photo.Id_new', 'Id', 'Column'
Go

ALTER TABLE Place.Photo
ADD PRIMARY KEY (Id)
Go

-- Place.FirstNationName
Alter Table Place.[FirstNationName]
Add Id_new Int Identity(1, 1)
Go

ALTER TABLE Place.[FirstNationName] 
DROP CONSTRAINT PK__FirstNat__3214EC075D3B409A;  
GO  

Alter Table Place.[FirstNationName] Drop Column Id
Go

Exec sp_rename 'Place.[FirstNationName].Id_new', 'Id', 'Column'
Go

ALTER TABLE Place.[FirstNationName]
ADD PRIMARY KEY (Id)
Go

-- Place.[AlternateName]
Alter Table Place.[AlternateName]
Add Id_new Int Identity(1, 1)
Go

ALTER TABLE Place.[AlternateName] 
DROP CONSTRAINT PK__Alternat__3214EC072FC3F28C;  
GO  

Alter Table Place.[AlternateName] Drop Column Id
Go

Exec sp_rename 'Place.AlternateName.Id_new', 'Id', 'Column'
Go

ALTER TABLE Place.[AlternateName]
ADD PRIMARY KEY (Id)
Go

-- Place.[PlaceHistory]
Alter Table Place.PlaceHistory
Add Id_new Int Identity(1, 1)
Go

ALTER TABLE Place.PlaceHistory 
DROP CONSTRAINT PK__PlaceHis__3214EC07C53D98BE;  
GO  

Alter Table Place.PlaceHistory Drop Column Id
Go

Exec sp_rename 'Place.PlaceHistory.Id_new', 'Id', 'Column'
Go

ALTER TABLE Place.PlaceHistory
ADD PRIMARY KEY (Id)
Go


-- Add new ID column
-- Place.[Place]
Alter Table Place.Place
Add Id_new Int Identity(1, 1)
Go

-- Move all Place child tables placeid to new ID 
alter table place.photo drop constraint FK__Photo__PlaceID__703EA55A;
Go

UPDATE place.photo
SET    placeid = pl.id_new
FROM   place.place pl
WHERE  pl.id = place.photo.placeid;
Go

alter table place.alternatename drop constraint FK__Alternate__Place__67DE6983;
Go

UPDATE place.alternatename
SET    placeid = pl.id_new
FROM   place.place pl
WHERE  pl.id = place.alternatename.placeid;
Go

alter table place.firstnationname drop constraint FK__FirstNati__Place__7167D3BD;
Go

UPDATE place.firstnationname
SET    placeid = pl.id_new
FROM   place.place pl
WHERE  pl.id = place.firstnationname.placeid;
Go


UPDATE place.fnassociation
SET    placeid = pl.id_new
FROM   place.place pl
WHERE  pl.id = place.fnassociation.placeid;
Go

alter table place.placehistory drop constraint FK__PlaceHist__Place__7720AD13;
Go

UPDATE place.placehistory
SET    placeid = pl.id_new
FROM   place.place pl
WHERE  pl.id = place.placehistory.placeid;
Go

alter table place.placetype drop constraint FK__PlaceType__Place__1D114BD1;
Go

UPDATE place.placetype
SET    placeid = pl.id_new
FROM   place.place pl
WHERE  pl.id = place.placetype.placeid;
Go

-- Remove old id column, rename new ID and re-add FKs
ALTER TABLE Place.Place 
DROP CONSTRAINT PK__Place__3214EC072378CBBB;  
GO  

Alter Table Place.Place Drop Column Id
Go

Exec sp_rename 'Place.Place.Id_new', 'Id', 'Column'
Go

ALTER TABLE Place.Place
ADD PRIMARY KEY (Id)
Go

ALTER TABLE place.photo
ADD FOREIGN KEY (PlaceId) REFERENCES Place.Place(id);
Go

ALTER TABLE place.alternatename
ADD FOREIGN KEY (PlaceId) REFERENCES Place.Place(id);
Go

ALTER TABLE place.firstnationname
ADD FOREIGN KEY (PlaceId) REFERENCES Place.Place(id);
Go

ALTER TABLE place.fnassociation
ADD FOREIGN KEY (PlaceId) REFERENCES Place.Place(id);
Go

ALTER TABLE place.placehistory
ADD FOREIGN KEY (PlaceId) REFERENCES Place.Place(id);
Go

ALTER TABLE place.placetype
ADD FOREIGN KEY (PlaceId) REFERENCES Place.Place(id);
Go
