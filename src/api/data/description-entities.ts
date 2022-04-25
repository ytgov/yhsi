export enum DescriptionTypeEnums {
	AdditionalInformation = 1,
	CharacterDefiningElements = 2,
	CulturalPeriod = 3,
	HeritageValue = 4,
	PlaceDescription = 5,
	DescriptionOfBoundaries = 6,
	HistoricalSourcesLocation = 8,
	RenovationInformation = 9,
	ConstructionStyle = 10,
	DemolitionInformation = 11,
	CulturalHistory = 12,
	DocumentationLocation = 13,
	ArchaeologicalCollections = 27,
	BuildingStyle = 29,
	YrhpAdditionalInformation = 30,
}

export const DESCRIPTION_TYPES = [
	{
		value: DescriptionTypeEnums.AdditionalInformation,
		text: 'Additional Information',
	},
	{
		value: DescriptionTypeEnums.CharacterDefiningElements,
		text: 'Character Defining Elements',
	},
	{ value: DescriptionTypeEnums.CulturalPeriod, text: 'Cultural Period' },
	{ value: DescriptionTypeEnums.HeritageValue, text: 'Heritage Value' },
	{
		value: DescriptionTypeEnums.PlaceDescription,
		text: 'Place Description',
	},
	{
		value: DescriptionTypeEnums.DescriptionOfBoundaries,
		text: 'Description of Boundaries',
	},
	{
		value: DescriptionTypeEnums.HistoricalSourcesLocation,
		text: 'Historical Sources Location',
	},
	{
		value: DescriptionTypeEnums.RenovationInformation,
		text: 'Renovation Information',
	},
	{
		value: DescriptionTypeEnums.ConstructionStyle,
		text: 'Construction Style',
	},
	{
		value: DescriptionTypeEnums.DemolitionInformation,
		text: 'Demolition Information',
	},
	{ value: DescriptionTypeEnums.CulturalHistory, text: 'Cultural History' },
	{
		value: DescriptionTypeEnums.DocumentationLocation,
		text: 'Documentation Location',
	},
	{
		value: DescriptionTypeEnums.ArchaeologicalCollections,
		text: 'Archaeological Collections',
	},
	{ value: DescriptionTypeEnums.BuildingStyle, text: 'Building Style' },
	{
		value: DescriptionTypeEnums.YrhpAdditionalInformation,
		text: 'YRHP Additional Information',
	},
];
