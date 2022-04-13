import { camelCase, pick } from 'lodash';

import { mapKeysDeep } from '../utils/lodash-extensions';
import { ColumnRemaping, PlainObject, Place, PlaceEdit } from '../models';

export default class PlaceEditSerializer {
	[key: string]: any;

	private associationsColumns: ColumnRemaping = Object.freeze({
		associationJSON: 'associations',
		constructionPeriodJSON: 'constructionPeriods',
		contactJSON: 'contacts',
		datesJSON: 'dates',
		descriptionJSON: 'descriptions',
		firstNationAssociationJSON: 'firstNationAssociations',
		functionalUseJSON: 'functionalUses',
		historicalPatternJSON: 'historicalPatterns',
		nameJSON: 'names',
		ownershipJSON: 'ownerships',
		previousOwnershipJSON: 'previousOwnerships',
		revisionLogJSON: 'revisionLogs',
		themeJSON: 'themes',
		webLinkJSON: 'webLink',
	});

	private commaDelimitedArrayColumns = Object.freeze([
		'contributingResources',
		'designations',
		'records',
		'siteCategories',
	]);

	constructor(placeEdit: PlaceEdit) {
		Object.entries(placeEdit).forEach(([key, value]) => {
			if (value === undefined) {
				// nop don't serialize this value
			} else if (key in this.associationsColumns) {
				const associationName = this.associationsColumns[key];
				this[associationName] = this.jsonParseAndCamelCase(value);
			} else if (this.commaDelimitedArrayColumns.includes(key)) {
				this[key] = Place.decodeCommaDelimitedArray(value);
			} else {
				this[key] = value;
			}
		});
	}

	jsonParseAndCamelCase(value: string): PlainObject {
		const objectAsJson = JSON.parse(value);
		return mapKeysDeep(objectAsJson, camelCase);
	}

	defaultView(): PlainObject {
		return pick(this, [
			'id',
			'placeId',
			'yHSIId',
			'primaryName',
			'editorId',
			'editorEmail',
			'editDate',
		]);
	}

	detailedView(): PlainObject {
		return {
			...this.defaultView(),
			...pick(this, [
				'associations',
				'block',
				'bordenNumber',
				'buildingSize',
				'category',
				'cIHBNumber',
				'communityId',
				'conditionComment',
				'constructionPeriods',
				'contacts',
				'contributingResources',
				'coordinateDetermination',
				'currentUseComment',
				'dates',
				'descriptions',
				'designations',
				'doorCondition',
				'editorUserId',
				'fHBRONumber',
				'firstNationAssociations',
				'floorCondition',
				'functionalUses',
				'geocode',
				'groupYHSI',
				'hectareArea',
				'historicalPatterns',
				'isPubliclyAccessible',
				'jurisdiction',
				'lAGroup',
				'latitude',
				'locationComment',
				'locationContext',
				'longitude',
				'lot',
				'mailingAddress',
				'mailingCountry',
				'mailingPostalCode',
				'mailingProvince',
				'names',
				'nTSMapSheet',
				'otherCommunity',
				'otherLocality',
				'ownerConsent',
				'ownerships',
				'physicalAddress',
				'physicalCountry',
				'physicalPostalCode',
				'physicalProvince',
				'planNumber',
				'previousAddress',
				'previousOwnerships',
				'recognitionDate',
				'records',
				'resourceType',
				'revisionLogs',
				'rollNumber',
				'roofCondition',
				'showInRegister',
				'siteCategories',
				'siteCategorys',
				'siteDistrictNumber',
				'siteStatus',
				'slideNegativeIndex',
				'statute2Id',
				'statuteId',
				'themes',
				'townSiteMapNumber',
				'wallCondition',
				'webLinks',
				'yGBuildingNumber',
				'yGReserveNumber',
				'yHSPastUse',
				'yHSThemes',
				'zoning',
			]),
		};
	}

	tableView(): PlainObject {
		return this.defaultView();
	}
}
