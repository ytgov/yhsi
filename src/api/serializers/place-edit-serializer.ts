import { camelCase, pick } from 'lodash';

import { mapKeysDeep } from '../utils/lodash-extensions';
import { PlainObject, Place, PlaceEdit } from '../models';
import BaseSerializer from './base-serializer';

export default class PlaceEditSerializer extends BaseSerializer<PlaceEdit> {
	constructor(placeEdit: PlaceEdit) {
		super(placeEdit);
	}

	decodeCommaDelimitedArray(
		value: string | undefined
	): PlainObject | undefined {
		if (value === undefined) return undefined;

		return Place.decodeCommaDelimitedArray(value);
	}

	jsonParseAndCamelCase(value: string | undefined): PlainObject | undefined {
		if (value === undefined) return undefined;

		const objectAsJson = JSON.parse(value);
		return mapKeysDeep(objectAsJson, camelCase);
	}

	defaultView(): PlainObject {
		return this.fields([
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
			...this.fields([
				'block',
				'bordenNumber',
				'buildingSize',
				'category',
				'cIHBNumber',
				'communityId',
				'conditionComment',
				'coordinateDetermination',
				'currentUseComment',
				'doorCondition',
				'editorUserId',
				'fHBRONumber',
				'floorCondition',
				'geocode',
				'groupYHSI',
				'hectareArea',
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
				'nTSMapSheet',
				'otherCommunity',
				'otherLocality',
				'ownerConsent',
				'physicalAddress',
				'physicalCountry',
				'physicalPostalCode',
				'physicalProvince',
				'planNumber',
				'previousAddress',
				'recognitionDate',
				'resourceType',
				'rollNumber',
				'roofCondition',
				'showInRegister',
				'siteCategorys',
				'siteDistrictNumber',
				'siteStatus',
				'slideNegativeIndex',
				'statute2Id',
				'statuteId',
				'townSiteMapNumber',
				'wallCondition',
				'yGBuildingNumber',
				'yGReserveNumber',
				'yHSPastUse',
				'yHSThemes',
				'zoning',
			]),
			...this.field('contributingResources', (placeEdit) =>
				this.decodeCommaDelimitedArray(placeEdit.contributingResources)
			),
			...this.field('designations', (placeEdit) =>
				this.decodeCommaDelimitedArray(placeEdit.designations)
			),
			...this.field('records', (placeEdit) =>
				this.decodeCommaDelimitedArray(placeEdit.records)
			),
			...this.field('siteCategories', (placeEdit) =>
				this.decodeCommaDelimitedArray(placeEdit.siteCategories)
			),
			...this.field('associations', (placeEdit) =>
				this.jsonParseAndCamelCase(placeEdit.associationJSON)
			),
			...this.field('constructionPeriods', (placeEdit) =>
				this.jsonParseAndCamelCase(placeEdit.constructionPeriodJSON)
			),
			...this.field('contacts', (placeEdit) =>
				this.jsonParseAndCamelCase(placeEdit.contactJSON)
			),
			...this.field('dates', (placeEdit) =>
				this.jsonParseAndCamelCase(placeEdit.datesJSON)
			),
			...this.field('descriptions', (placeEdit) =>
				this.jsonParseAndCamelCase(placeEdit.descriptionJSON)
			),
			...this.field('firstNationAssociations', (placeEdit) =>
				this.jsonParseAndCamelCase(placeEdit.firstNationAssociationJSON)
			),
			...this.field('functionalUses', (placeEdit) =>
				this.jsonParseAndCamelCase(placeEdit.functionalUseJSON)
			),
			...this.field('historicalPatterns', (placeEdit) =>
				this.jsonParseAndCamelCase(placeEdit.historicalPatternJSON)
			),
			...this.field('names', (placeEdit) =>
				this.jsonParseAndCamelCase(placeEdit.nameJSON)
			),
			...this.field('ownerships', (placeEdit) =>
				this.jsonParseAndCamelCase(placeEdit.ownershipJSON)
			),
			...this.field('previousOwnerships', (placeEdit) =>
				this.jsonParseAndCamelCase(placeEdit.previousOwnershipJSON)
			),
			...this.field('revisionLogs', (placeEdit) =>
				this.jsonParseAndCamelCase(placeEdit.revisionLogJSON)
			),
			...this.field('themes', (placeEdit) =>
				this.jsonParseAndCamelCase(placeEdit.themeJSON)
			),
			...this.field('webLinks', (placeEdit) =>
				this.jsonParseAndCamelCase(placeEdit.webLinkJSON)
			),
		};
	}

	tableView(): PlainObject {
		return this.defaultView();
	}
}
