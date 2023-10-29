// -- BEGIN TABLE dbo.PlaceEdit
// IF OBJECT_ID('dbo.PlaceEdit', 'U') IS NOT NULL
// DROP TABLE dbo.PlaceEdit;
// GO

// CREATE TABLE dbo.PlaceEdit (
// 	Id int NOT NULL IDENTITY(1,1),
// 	PrimaryName nvarchar(700) NOT NULL,
// 	YHSIId nvarchar(20) NOT NULL,
// 	Jurisdiction int NOT NULL,
// 	StatuteId int NOT NULL,
// 	Statute2Id int NOT NULL,
// 	RecognitionDate date NULL,
// 	OwnerConsent int NOT NULL,
// 	Category int NOT NULL,
// 	IsPubliclyAccessible bit NOT NULL,
// 	NTSMapSheet nvarchar(256) NULL,
// 	BordenNumber nvarchar(256) NULL,
// 	Geocode nvarchar(256) NULL,
// 	HectareArea nvarchar(256) NULL,
// 	Latitude nvarchar(256) NULL,
// 	Longitude nvarchar(256) NULL,
// 	LocationComment nvarchar(256) NULL,
// 	ResourceType nvarchar(256) NULL,
// 	BuildingSize nvarchar(256) NULL,
// 	ConditionComment nvarchar(max) NULL,
// 	CurrentUseComment nvarchar(256) NULL,
// 	YHSPastUse nvarchar(256) NULL,
// 	CIHBNumber nvarchar(256) NULL,
// 	GroupYHSI nvarchar(256) NULL,
// 	YGBuildingNumber nvarchar(256) NULL,
// 	YGReserveNumber nvarchar(256) NULL,
// 	FHBRONumber nvarchar(256) NULL,
// 	Zoning nvarchar(256) NULL,
// 	TownSiteMapNumber nvarchar(256) NULL,
// 	SiteDistrictNumber nvarchar(256) NULL,
// 	PlanNumber nvarchar(256) NULL,
// 	Block nvarchar(256) NULL,
// 	Lot nvarchar(256) NULL,
// 	SlideNegativeIndex nvarchar(max) NULL,
// 	OtherCommunity nvarchar(256) NULL,
// 	OtherLocality nvarchar(256) NULL,
// 	PreviousAddress nvarchar(500) NULL,
// 	YHSThemes nvarchar(max) NULL,
// 	RollNumber nvarchar(256) NULL,
// 	LocationContext nvarchar(max) NULL,
// 	CommunityId int NOT NULL,
// 	LAGroup nvarchar(256) NULL,
// 	SiteStatus int NOT NULL,
// 	FloorCondition int NOT NULL,
// 	WallCondition int NOT NULL,
// 	DoorCondition int NOT NULL,
// 	RoofCondition int NOT NULL,
// 	CoordinateDetermination int NOT NULL,
// 	PhysicalAddress nvarchar(500) NULL,
// 	PhysicalProvince nvarchar(256) NULL,
// 	PhysicalCountry nvarchar(256) NULL,
// 	PhysicalPostalCode nvarchar(256) NULL,
// 	MailingAddress nvarchar(500) NULL,
// 	MailingProvince nvarchar(256) NULL,
// 	MailingCountry nvarchar(256) NULL,
// 	MailingPostalCode nvarchar(256) NULL,
// 	EditorUserId int NOT NULL,
// 	EditDate date NULL,
// 	AssociationJSON nvarchar(max) NULL,
// 	ConstructionPeriodJSON nvarchar(max) NULL,
// 	ContactJSON nvarchar(max) NULL,
// 	ContributingResourceJSON nvarchar(max) NULL,
// 	DatesJSON nvarchar(max) NULL,
// 	DescriptionJSON nvarchar(max) NULL,
// 	FirstNationAssociationJSON nvarchar(max) NULL,
// 	FunctionalUseJSON nvarchar(max) NULL,
// 	HistoricalPatternJSON nvarchar(max) NULL,
// 	NameJSON nvarchar(max) NULL,
// 	PreviousOwnershipJSON nvarchar(max) NULL,
// 	RecordJSON nvarchar(max) NULL,
// 	RevisionLogJSON nvarchar(max) NULL,
// 	SiteCategoryJSON nvarchar(max) NULL,
// 	ThemeJSON nvarchar(max) NULL,
// 	WebLinkJSON nvarchar(max) NULL,
// 	PlaceId int NULL,
// 	ShowInRegister bit NOT NULL,
// 	OwnershipJSON nvarchar(max) NULL,
// 	SiteCategories nvarchar(500) NULL,
// 	Designations nvarchar(500) NULL,
// 	ContributingResources nvarchar(500) NULL,
// 	Records nvarchar(500) NULL
// );
// GO

// ALTER TABLE dbo.PlaceEdit ADD CONSTRAINT PK_PlaceEdit PRIMARY KEY (Id);
// GO

import { Knex } from 'knex';
exports.up = async function (knex: Knex, Promise: any) {
	await knex.schema.createTable('dbo.PlaceEdit', (table) => {
		table.increments('Id').primary();
		table.string('PrimaryName', 700).notNullable();
		table.string('YHSIId', 20).notNullable();
		table.integer('Jurisdiction').notNullable();
		table.integer('StatuteId').notNullable();
		table.integer('Statute2Id').notNullable();
		table.date('RecognitionDate').nullable();
		table.integer('OwnerConsent').notNullable();
		table.integer('Category').notNullable();
		table.boolean('IsPubliclyAccessible').notNullable();
		table.string('NTSMapSheet', 256).nullable();
		table.string('BordenNumber', 256).nullable();
		table.string('Geocode', 256).nullable();
		table.string('HectareArea', 256).nullable();
		table.string('Latitude', 256).nullable();
		table.string('Longitude', 256).nullable();
		table.string('LocationComment', 256).nullable();
		table.string('ResourceType', 256).nullable();
		table.string('BuildingSize', 256).nullable();
		table.string('ConditionComment', 4000).nullable();
		table.string('CurrentUseComment', 256).nullable();
		table.string('YHSPastUse', 256).nullable();
		table.string('CIHBNumber', 256).nullable();
		table.string('GroupYHSI', 256).nullable();
		table.string('YGBuildingNumber', 256).nullable();
		table.string('YGReserveNumber', 256).nullable();
		table.string('FHBRONumber', 256).nullable();
		table.string('Zoning', 256).nullable();
		table.string('TownSiteMapNumber', 256).nullable();
		table.string('SiteDistrictNumber', 256).nullable();
		table.string('PlanNumber', 256).nullable();
		table.string('Block', 256).nullable();
		table.string('Lot', 256).nullable();
		table.string('SlideNegativeIndex', 4000).nullable();
		table.string('OtherCommunity', 256).nullable();
		table.string('OtherLocality', 256).nullable();
		table.string('PreviousAddress', 500).nullable();
		table.string('YHSThemes', 4000).nullable();
		table.string('RollNumber', 256).nullable();
		table.string('LocationContext', 4000).nullable();
		table.integer('CommunityId').notNullable();
		table.string('LAGroup', 256).nullable();
		table.integer('SiteStatus').notNullable();
		table.integer('FloorCondition').notNullable();
		table.integer('WallCondition').notNullable();
		table.integer('DoorCondition').notNullable();
		table.integer('RoofCondition').notNullable();
		table.integer('CoordinateDetermination').notNullable();
		table.string('PhysicalAddress', 500).nullable();
		table.string('PhysicalProvince', 256).nullable();
		table.string('PhysicalCountry', 256).nullable();
		table.string('PhysicalPostalCode', 256).nullable();
		table.string('MailingAddress', 500).nullable();
		table.string('MailingProvince', 256).nullable();
		table.string('MailingCountry', 256).nullable();
		table.string('MailingPostalCode', 256).nullable();
		table.integer('EditorUserId').notNullable();
		table.date('EditDate').nullable();
		table.string('AssociationJSON', 4000).nullable();
		table.string('ConstructionPeriodJSON', 4000).nullable();
		table.string('ContactJSON', 4000).nullable();
		table.string('ContributingResourceJSON', 4000).nullable();
		table.string('DatesJSON', 4000).nullable();
		table.string('DescriptionJSON', 4000).nullable();
		table.string('FirstNationAssociationJSON', 4000).nullable();
		table.string('FunctionalUseJSON', 4000).nullable();
		table.string('HistoricalPatternJSON', 4000).nullable();
		table.string('NameJSON', 4000).nullable();
		table.string('PreviousOwnershipJSON', 4000).nullable();
		table.string('RecordJSON', 4000).nullable();
		table.string('RevisionLogJSON', 4000).nullable();
		table.string('SiteCategoryJSON', 4000).nullable();
		table.string('ThemeJSON', 4000).nullable();
		table.string('WebLinkJSON', 4000).nullable();
		table.integer('PlaceId').nullable();
		table.boolean('ShowInRegister').notNullable();
		table.string('OwnershipJSON', 4000).nullable();
		table.string('SiteCategories', 500).nullable();
		table.string('Designations', 500).nullable();
		table.string('ContributingResources', 500).nullable();
		table.string('Records', 500).nullable();
	});
};
exports.down = async function (knex: Knex, Promise: any) {
	await knex.schema.dropTable('dbo.PlaceEdit');
};
