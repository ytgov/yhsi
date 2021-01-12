

CREATE DATABASE [YHSI_Prod]
GO

USE [YHSI_Prod]
GO
/****** Object:  Table [dbo].[Association]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Association](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PlaceId] [int] NOT NULL,
	[Type] [int] NOT NULL,
	[Description] [nvarchar](256) NULL,
 CONSTRAINT [PK_Association] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[batch_temp]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[batch_temp](
	[image_id] [int] NOT NULL,
	[batch_info] [nvarchar](100) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Community]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Community](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](256) NOT NULL,
 CONSTRAINT [PK_Comunity] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ConstructionPeriod]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ConstructionPeriod](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PlaceId] [int] NOT NULL,
	[Type] [int] NOT NULL,
 CONSTRAINT [PK_ConstructionPeriod] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Contact]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Contact](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PlaceId] [int] NOT NULL,
	[FirstName] [nvarchar](256) NULL,
	[LastName] [nvarchar](256) NULL,
	[PhoneNumber] [nvarchar](256) NULL,
	[Email] [nvarchar](256) NULL,
	[MailingAddress] [nvarchar](256) NULL,
	[Description] [nvarchar](256) NULL,
	[ContactType] [int] NOT NULL,
 CONSTRAINT [PK_Contact] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Dates]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Dates](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PlaceId] [int] NOT NULL,
	[Type] [int] NOT NULL,
	[FromDate] [nvarchar](256) NULL,
	[ToDate] [nvarchar](256) NULL,
	[Details] [nvarchar](256) NULL,
 CONSTRAINT [PK_Dates] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Description]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Description](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PlaceId] [int] NOT NULL,
	[DescriptionText] [nvarchar](max) NULL,
	[Type] [int] NOT NULL,
 CONSTRAINT [PK_Description] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Existing_Photos]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Existing_Photos](
	[RowId] [uniqueidentifier] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FirstNation]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FirstNation](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Description] [nvarchar](256) NULL,
 CONSTRAINT [PK_FirstNation] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FirstNationAssociation]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FirstNationAssociation](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PlaceId] [int] NOT NULL,
	[FirstNationId] [int] NOT NULL,
	[FirstNationAssociationType] [int] NOT NULL,
	[Comments] [nvarchar](max) NULL,
 CONSTRAINT [PK_FirstNationAssociation] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FunctionalType]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FunctionalType](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Description] [nvarchar](256) NULL,
 CONSTRAINT [PK_FunctionalType] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FunctionalUse]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FunctionalUse](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PlaceId] [int] NOT NULL,
	[FunctionalTypeId] [int] NOT NULL,
	[FunctionalUseType] [int] NOT NULL,
	[Description] [nvarchar](256) NULL,
 CONSTRAINT [PK_FunctionalUse] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[HistoricalPattern]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[HistoricalPattern](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PlaceId] [int] NOT NULL,
	[Comments] [nvarchar](max) NULL,
	[HistoricalPatternType] [int] NOT NULL,
 CONSTRAINT [PK_HistoricalPattern] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[HSUser]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[HSUser](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[ExpirationDate] [datetime] NULL,
 CONSTRAINT [PK_HSUser] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[HSUserAccess]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[HSUserAccess](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[AccessType] [int] NOT NULL,
	[AccessText] [nvarchar](150) NOT NULL,
 CONSTRAINT [PK_UserAccess] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Ibbit_Content]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Ibbit_Content](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Format] [int] NOT NULL,
	[Version] [int] NOT NULL,
	[Body] [nvarchar](max) NOT NULL,
	[IsPublished] [bit] NULL,
 CONSTRAINT [PK_Ibbit_TextContent] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Ibbit_Control]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Ibbit_Control](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](200) NOT NULL,
	[Description] [nvarchar](2000) NULL,
	[Path] [nvarchar](500) NOT NULL,
 CONSTRAINT [PK_Ibbit_Control] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Ibbit_Endpoint]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Ibbit_Endpoint](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Url] [nvarchar](500) NULL,
	[IsHome] [bit] NOT NULL,
	[ExtensionType] [nvarchar](500) NULL,
	[ParentId] [int] NULL,
 CONSTRAINT [PK_Page] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Ibbit_PageLayout]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Ibbit_PageLayout](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](150) NOT NULL,
	[FilePath] [nvarchar](300) NOT NULL,
 CONSTRAINT [PK_Ibbit_PageLayout] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Ibbit_PageRevision]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Ibbit_PageRevision](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[EndpointId] [int] NOT NULL,
	[CreateUserId] [int] NOT NULL,
	[Version] [int] NOT NULL,
	[CreateDate] [datetime] NOT NULL,
	[Title] [nvarchar](500) NOT NULL,
	[LayoutId] [int] NOT NULL,
	[Keywords] [nvarchar](1000) NULL,
	[Status] [int] NOT NULL,
	[ContentItemDetail] [nvarchar](max) NULL,
	[PublishDate] [datetime] NULL,
 CONSTRAINT [PK_Ibbit_PageRevision] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Ibbit_User]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Ibbit_User](
	[UserId] [int] IDENTITY(1,1) NOT NULL,
	[Email] [nvarchar](max) NOT NULL,
	[FirstName] [nvarchar](max) NULL,
	[LastName] [nvarchar](max) NULL,
	[CreateDate] [datetime] NOT NULL,
	[LastLogin] [datetime] NOT NULL,
	[Status] [int] NOT NULL,
 CONSTRAINT [PK_dbo.Ibbit_User] PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Ibbit_UserSession]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Ibbit_UserSession](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[SessionId] [nvarchar](50) NOT NULL,
	[LoginDate] [datetime] NOT NULL,
	[ExpirationDate] [datetime] NOT NULL,
	[IsKilled] [bit] NOT NULL,
 CONSTRAINT [PK_Ibbit_UserSession] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Name]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Name](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PlaceId] [int] NOT NULL,
	[Description] [nvarchar](256) NULL,
 CONSTRAINT [PK_Name] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[OriginalMedia]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OriginalMedia](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Type] [nvarchar](256) NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Ownership]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Ownership](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PlaceId] [int] NOT NULL,
	[OwnershipType] [int] NOT NULL,
	[Comments] [nvarchar](256) NULL,
 CONSTRAINT [PK_Ownership] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PhotoOwner]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PhotoOwner](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](256) NULL,
	[Email] [nvarchar](256) NULL,
	[Address] [nvarchar](256) NULL,
	[Telephone] [nvarchar](256) NULL,
	[ContactPerson] [nvarchar](256) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PhotoProject]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PhotoProject](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](256) NULL,
	[Permit] [nvarchar](256) NULL,
	[Year] [nvarchar](256) NULL,
	[Section] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Place]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Place](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PrimaryName] [nvarchar](700) NOT NULL,
	[YHSIId] [nvarchar](20) NOT NULL,
	[Jurisdiction] [int] NOT NULL,
	[StatuteId] [int] NOT NULL,
	[Statute2Id] [int] NOT NULL,
	[RecognitionDate] [date] NULL,
	[OwnerConsent] [int] NOT NULL,
	[Category] [int] NOT NULL,
	[IsPubliclyAccessible] [bit] NOT NULL,
	[NTSMapSheet] [nvarchar](256) NULL,
	[BordenNumber] [nvarchar](256) NULL,
	[Geocode] [nvarchar](256) NULL,
	[HectareArea] [nvarchar](256) NULL,
	[Latitude] [nvarchar](256) NULL,
	[Longitude] [nvarchar](256) NULL,
	[LocationComment] [nvarchar](256) NULL,
	[ResourceType] [nvarchar](256) NULL,
	[BuildingSize] [nvarchar](256) NULL,
	[ConditionComment] [nvarchar](max) NULL,
	[CurrentUseComment] [nvarchar](256) NULL,
	[YHSPastUse] [nvarchar](256) NULL,
	[CIHBNumber] [nvarchar](256) NULL,
	[GroupYHSI] [nvarchar](256) NULL,
	[YGBuildingNumber] [nvarchar](256) NULL,
	[YGReserveNumber] [nvarchar](256) NULL,
	[FHBRONumber] [nvarchar](256) NULL,
	[Zoning] [nvarchar](256) NULL,
	[TownSiteMapNumber] [nvarchar](256) NULL,
	[SiteDistrictNumber] [nvarchar](256) NULL,
	[PlanNumber] [nvarchar](256) NULL,
	[Block] [nvarchar](256) NULL,
	[Lot] [nvarchar](256) NULL,
	[SlideNegativeIndex] [nvarchar](max) NULL,
	[OtherCommunity] [nvarchar](256) NULL,
	[OtherLocality] [nvarchar](256) NULL,
	[PreviousAddress] [nvarchar](500) NULL,
	[YHSThemes] [nvarchar](max) NULL,
	[RollNumber] [nvarchar](256) NULL,
	[LocationContext] [nvarchar](max) NULL,
	[CommunityId] [int] NOT NULL,
	[LAGroup] [nvarchar](256) NULL,
	[SiteStatus] [int] NOT NULL,
	[FloorCondition] [int] NOT NULL,
	[WallCondition] [int] NOT NULL,
	[DoorCondition] [int] NOT NULL,
	[RoofCondition] [int] NOT NULL,
	[CoordinateDetermination] [int] NOT NULL,
	[PhysicalAddress] [nvarchar](500) NULL,
	[PhysicalProvince] [nvarchar](256) NULL,
	[PhysicalCountry] [nvarchar](256) NULL,
	[PhysicalPostalCode] [nvarchar](256) NULL,
	[MailingAddress] [nvarchar](500) NULL,
	[MailingProvince] [nvarchar](256) NULL,
	[MailingCountry] [nvarchar](256) NULL,
	[MailingPostalCode] [nvarchar](256) NULL,
	[ShowInRegister] [bit] NOT NULL,
	[SiteCategories] [nvarchar](500) NULL,
	[Designations] [nvarchar](500) NULL,
	[ContributingResources] [nvarchar](500) NULL,
	[Records] [nvarchar](500) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PlaceEdit]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PlaceEdit](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PrimaryName] [nvarchar](700) NOT NULL,
	[YHSIId] [nvarchar](20) NOT NULL,
	[Jurisdiction] [int] NOT NULL,
	[StatuteId] [int] NOT NULL,
	[Statute2Id] [int] NOT NULL,
	[RecognitionDate] [date] NULL,
	[OwnerConsent] [int] NOT NULL,
	[Category] [int] NOT NULL,
	[IsPubliclyAccessible] [bit] NOT NULL,
	[NTSMapSheet] [nvarchar](256) NULL,
	[BordenNumber] [nvarchar](256) NULL,
	[Geocode] [nvarchar](256) NULL,
	[HectareArea] [nvarchar](256) NULL,
	[Latitude] [nvarchar](256) NULL,
	[Longitude] [nvarchar](256) NULL,
	[LocationComment] [nvarchar](256) NULL,
	[ResourceType] [nvarchar](256) NULL,
	[BuildingSize] [nvarchar](256) NULL,
	[ConditionComment] [nvarchar](max) NULL,
	[CurrentUseComment] [nvarchar](256) NULL,
	[YHSPastUse] [nvarchar](256) NULL,
	[CIHBNumber] [nvarchar](256) NULL,
	[GroupYHSI] [nvarchar](256) NULL,
	[YGBuildingNumber] [nvarchar](256) NULL,
	[YGReserveNumber] [nvarchar](256) NULL,
	[FHBRONumber] [nvarchar](256) NULL,
	[Zoning] [nvarchar](256) NULL,
	[TownSiteMapNumber] [nvarchar](256) NULL,
	[SiteDistrictNumber] [nvarchar](256) NULL,
	[PlanNumber] [nvarchar](256) NULL,
	[Block] [nvarchar](256) NULL,
	[Lot] [nvarchar](256) NULL,
	[SlideNegativeIndex] [nvarchar](max) NULL,
	[OtherCommunity] [nvarchar](256) NULL,
	[OtherLocality] [nvarchar](256) NULL,
	[PreviousAddress] [nvarchar](500) NULL,
	[YHSThemes] [nvarchar](max) NULL,
	[RollNumber] [nvarchar](256) NULL,
	[LocationContext] [nvarchar](max) NULL,
	[CommunityId] [int] NOT NULL,
	[LAGroup] [nvarchar](256) NULL,
	[SiteStatus] [int] NOT NULL,
	[FloorCondition] [int] NOT NULL,
	[WallCondition] [int] NOT NULL,
	[DoorCondition] [int] NOT NULL,
	[RoofCondition] [int] NOT NULL,
	[CoordinateDetermination] [int] NOT NULL,
	[PhysicalAddress] [nvarchar](500) NULL,
	[PhysicalProvince] [nvarchar](256) NULL,
	[PhysicalCountry] [nvarchar](256) NULL,
	[PhysicalPostalCode] [nvarchar](256) NULL,
	[MailingAddress] [nvarchar](500) NULL,
	[MailingProvince] [nvarchar](256) NULL,
	[MailingCountry] [nvarchar](256) NULL,
	[MailingPostalCode] [nvarchar](256) NULL,
	[EditorUserId] [int] NOT NULL,
	[EditDate] [date] NULL,
	[AssociationJSON] [nvarchar](max) NULL,
	[ConstructionPeriodJSON] [nvarchar](max) NULL,
	[ContactJSON] [nvarchar](max) NULL,
	[ContributingResourceJSON] [nvarchar](max) NULL,
	[DatesJSON] [nvarchar](max) NULL,
	[DescriptionJSON] [nvarchar](max) NULL,
	[FirstNationAssociationJSON] [nvarchar](max) NULL,
	[FunctionalUseJSON] [nvarchar](max) NULL,
	[HistoricalPatternJSON] [nvarchar](max) NULL,
	[NameJSON] [nvarchar](max) NULL,
	[PreviousOwnershipJSON] [nvarchar](max) NULL,
	[RecordJSON] [nvarchar](max) NULL,
	[RevisionLogJSON] [nvarchar](max) NULL,
	[SiteCategoryJSON] [nvarchar](max) NULL,
	[ThemeJSON] [nvarchar](max) NULL,
	[WebLinkJSON] [nvarchar](max) NULL,
	[PlaceId] [int] NULL,
	[ShowInRegister] [bit] NOT NULL,
	[OwnershipJSON] [nvarchar](max) NULL,
	[SiteCategories] [nvarchar](500) NULL,
	[Designations] [nvarchar](500) NULL,
	[ContributingResources] [nvarchar](500) NULL,
	[Records] [nvarchar](500) NULL,
 CONSTRAINT [PK_PlaceEdit] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UX_PlaceEdit_PlaceId] UNIQUE NONCLUSTERED 
(
	[PlaceId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PlaceTheme]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PlaceTheme](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Category] [nvarchar](100) NOT NULL,
	[Type] [nvarchar](100) NOT NULL,
 CONSTRAINT [PK_PlaceTheme] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PreviousOwnership]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PreviousOwnership](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PlaceId] [int] NOT NULL,
	[OwnershipNumber] [nvarchar](256) NULL,
	[OwnershipName] [nvarchar](256) NULL,
	[OwnershipDate] [nvarchar](200) NULL,
 CONSTRAINT [PK_PreviousOwnership] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Prod_Photo_List]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Prod_Photo_List](
	[Id] [int] NULL,
	[OriginalFileName] [nvarchar](256) NULL,
	[FeatureName] [nvarchar](600) NULL,
	[YHSIRecord] [nvarchar](20) NULL,
	[IsComplete] [bit] NOT NULL,
	[PhotoProjectId] [int] NOT NULL,
	[OriginalMediaId] [int] NOT NULL,
	[CommunityId] [int] NOT NULL,
	[PlaceId] [int] NULL,
	[OwnerId] [int] NOT NULL,
	[Subjects] [varchar](500) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RevisionLog]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RevisionLog](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PlaceId] [int] NOT NULL,
	[RevisionLogType] [int] NOT NULL,
	[RevisionDate] [nvarchar](50) NULL,
	[RevisedBy] [nvarchar](256) NULL,
	[Details] [nvarchar](256) NULL,
 CONSTRAINT [PK_RevisionLog] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SavedFilter]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SavedFilter](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[UserId] [int] NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[ResultType] [nvarchar](50) NOT NULL,
	[Value] [nvarchar](2000) NULL,
 CONSTRAINT [PK_SavedFilter] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Site_Status_CD]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Site_Status_CD](
	[Site_Status_ID] [int] NULL,
	[Code] [int] NULL,
	[Description] [varchar](100) NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SiteImage]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SiteImage](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PlaceId] [int] NULL,
	[ImageTypeId] [int] NULL,
	[Caption] [nvarchar](256) NULL,
	[ImageDescription] [nvarchar](256) NULL,
	[FileName] [nvarchar](256) NULL,
	[Copyright] [nvarchar](256) NULL,
	[FileLocation] [nvarchar](256) NULL,
	[ImagePath] [nvarchar](256) NULL,
	[ThumbnailPath] [nvarchar](256) NULL,
	[IsPrimary] [bit] NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Statute]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Statute](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[RecognitionAuthority] [nvarchar](256) NULL,
	[RecognitionType] [nvarchar](256) NULL,
	[Description] [nvarchar](256) NULL,
	[AllStatute] [nvarchar](256) NULL,
 CONSTRAINT [PK_Statute] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Theme]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Theme](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PlaceId] [int] NOT NULL,
	[PlaceThemeId] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[WebLink]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[WebLink](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PlaceId] [int] NOT NULL,
	[Type] [int] NOT NULL,
	[Address] [nvarchar](256) NULL,
 CONSTRAINT [PK_WebLink] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[webpages_OAuthMembership]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[webpages_OAuthMembership](
	[Provider] [nvarchar](30) NOT NULL,
	[ProviderUserId] [nvarchar](100) NOT NULL,
	[UserId] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Provider] ASC,
	[ProviderUserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[webpages_Roles]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[webpages_Roles](
	[RoleId] [int] IDENTITY(1,1) NOT NULL,
	[RoleName] [nvarchar](256) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[RoleName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[webpages_UsersInRoles]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[webpages_UsersInRoles](
	[UserId] [int] NOT NULL,
	[RoleId] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC,
	[RoleId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[YHS_PhotoBatch]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[YHS_PhotoBatch](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [nvarchar](100) NOT NULL,
	[UserId] [int] NOT NULL,
	[CreateDate] [datetime] NULL,
	[PlaceId] [int] NULL,
	[CommunityId] [int] NOT NULL,
	[NTSMapNumber] [nvarchar](20) NULL,
	[Address] [nvarchar](600) NULL,
	[YHSIRecord] [nvarchar](20) NULL,
	[BordenRecord] [nvarchar](20) NULL,
	[PaleoRecord] [nvarchar](20) NULL,
	[ArchivalRecord] [nvarchar](20) NULL,
	[IsOtherRecord] [bit] NOT NULL,
	[OriginalMediaId] [int] NOT NULL,
	[OriginalRecord] [nvarchar](256) NULL,
	[MediaStorage] [int] NOT NULL,
	[Comments] [nvarchar](max) NULL,
	[Caption] [nvarchar](256) NULL,
	[Copyright] [int] NOT NULL,
	[CreditLine] [nvarchar](256) NULL,
	[OwnerId] [int] NOT NULL,
	[PhotoProjectId] [int] NOT NULL,
	[Program] [int] NOT NULL,
	[Creator] [nvarchar](256) NULL,
	[CommunityName] [nvarchar](256) NULL,
	[Location] [nvarchar](256) NULL,
	[UsageRights] [int] NULL,
	[IsComplete] [bit] NOT NULL,
	[Subjects] [varchar](500) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[YHS_PhotoBatchPhoto]    Script Date: 2021-01-05 11:23:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[YHS_PhotoBatchPhoto](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[PhotoBatchId] [int] NOT NULL,
	[PhotoFile] [varbinary](max) NULL,
	[PhotoFileName] [nvarchar](200) NOT NULL,
	[PhotoContentType] [nvarchar](100) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
ALTER TABLE [dbo].[webpages_UsersInRoles]  WITH CHECK ADD  CONSTRAINT [fk_RoleId] FOREIGN KEY([RoleId])
REFERENCES [dbo].[webpages_Roles] ([RoleId])
GO
ALTER TABLE [dbo].[webpages_UsersInRoles] CHECK CONSTRAINT [fk_RoleId]
GO
ALTER TABLE [dbo].[webpages_UsersInRoles]  WITH CHECK ADD  CONSTRAINT [fk_UserId] FOREIGN KEY([UserId])
REFERENCES [dbo].[Ibbit_User] ([UserId])
GO
ALTER TABLE [dbo].[webpages_UsersInRoles] CHECK CONSTRAINT [fk_UserId]
GO

-- delivered by Swarna
CREATE TABLE [dbo].[Photo](
	[RowId] [uniqueidentifier] ROWGUIDCOL  NOT NULL,
	[Id] [int] NULL,
	[PlaceId] [int] NULL,
	[File] [varbinary](max)  NULL,
	[OriginalFileName] [nvarchar](256) NULL,
	[FeatureName] [nvarchar](600) NULL,
	[CommunityId] [int] NOT NULL,
	[NTSMapNumber] [nvarchar](20) NULL,
	[Address] [nvarchar](600) NULL,
	[DateCreated] [date] NULL,
	[YHSIRecord] [nvarchar](20) NULL,
	[BordenRecord] [nvarchar](20) NULL,
	[PaleoRecord] [nvarchar](20) NULL,
	[ArchivalRecord] [nvarchar](20) NULL,
	[IsOtherRecord] [bit] NOT NULL,
	[OriginalMediaId] [int] NOT NULL,
	[OriginalRecord] [nvarchar](256) NULL,
	[MediaStorage] [int] NOT NULL,
	[Comments] [nvarchar](max) NULL,
	[Caption] [nvarchar](256) NULL,
	[Copyright] [int] NOT NULL,
	[CreditLine] [nvarchar](256) NULL,
	[OwnerId] [int] NOT NULL,
	[PhotoProjectId] [int] NOT NULL,
	[Program] [int] NOT NULL,
	[Creator] [nvarchar](256) NULL,
	[CommunityName] [nvarchar](256) NULL,
	[Location] [nvarchar](256) NULL,
	[UsageRights] [int] NULL,
	[IsComplete] [bit] NOT NULL,
	[ImageHeight] [int] NULL,
	[ImageWidth] [int] NULL,
	[Rating] [int] NOT NULL,
	[Subjects] [varchar](500) NULL,
	[LegacyBatchInfo] [nvarchar](150) NULL,
	[IsSiteDefault] [bit] NOT NULL,
 CONSTRAINT [PK_Image] PRIMARY KEY CLUSTERED 
(
	[RowId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON)
) 
GO

ALTER TABLE [dbo].[Photo] ADD  DEFAULT (newid()) FOR [RowId]
GO

ALTER TABLE [dbo].[Photo] ADD  DEFAULT ((0)) FOR [UsageRights]
GO

ALTER TABLE [dbo].[Photo] ADD  CONSTRAINT [DF_Photo_Rating]  DEFAULT ((1)) FOR [Rating]
GO

ALTER TABLE [dbo].[Photo] ADD  DEFAULT ((0)) FOR [IsSiteDefault]
GO

CREATE TABLE [dbo].[Photo_Missing](
	[RowId] [uniqueidentifier] ROWGUIDCOL  NOT NULL,
	[Id] [int] NULL,
	[PlaceId] [int] NULL,
	[OriginalFileName] [nvarchar](256) NULL,
	[FeatureName] [nvarchar](600) NULL,
	[CommunityId] [int] NOT NULL,
	[NTSMapNumber] [nvarchar](20) NULL,
	[Address] [nvarchar](600) NULL,
	[DateCreated] [date] NULL,
	[YHSIRecord] [nvarchar](20) NULL,
	[BordenRecord] [nvarchar](20) NULL,
	[PaleoRecord] [nvarchar](20) NULL,
	[ArchivalRecord] [nvarchar](20) NULL,
	[IsOtherRecord] [bit] NOT NULL,
	[OriginalMediaId] [int] NOT NULL,
	[OriginalRecord] [nvarchar](256) NULL,
	[MediaStorage] [int] NOT NULL,
	[Comments] [nvarchar](max) NULL,
	[Caption] [nvarchar](256) NULL,
	[Copyright] [int] NOT NULL,
	[CreditLine] [nvarchar](256) NULL,
	[OwnerId] [int] NOT NULL,
	[PhotoProjectId] [int] NOT NULL,
	[Program] [int] NOT NULL,
	[Creator] [nvarchar](256) NULL,
	[CommunityName] [nvarchar](256) NULL,
	[Location] [nvarchar](256) NULL,
	[UsageRights] [int] NULL,
	[IsComplete] [bit] NOT NULL,
	[ImageHeight] [int] NULL,
	[ImageWidth] [int] NULL,
	[Subjects] [varchar](500) NULL,
	[Rating] [int] NULL,
 CONSTRAINT [PK_Image-old] PRIMARY KEY CLUSTERED 
(
	[RowId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[Photo_Missing] ADD  DEFAULT (newid()) FOR [RowId]
GO

CREATE TABLE [dbo].[webpages_Membership](
	[UserId] [int] NOT NULL,
	[CreateDate] [datetime] NULL,
	[ConfirmationToken] [nvarchar](128) NULL,
	[IsConfirmed] [bit] NULL,
	[LastPasswordFailureDate] [datetime] NULL,
	[PasswordFailuresSinceLastSuccess] [int] NOT NULL,
	[Password] [nvarchar](128) NOT NULL,
	[PasswordChangedDate] [datetime] NULL,
	[PasswordSalt] [nvarchar](128) NOT NULL,
	[PasswordVerificationToken] [nvarchar](128) NULL,
	[PasswordVerificationTokenExpirationDate] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[UserId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[webpages_Membership] ADD  DEFAULT ((0)) FOR [IsConfirmed]
GO

ALTER TABLE [dbo].[webpages_Membership] ADD  DEFAULT ((0)) FOR [PasswordFailuresSinceLastSuccess]
GO
