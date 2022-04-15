import { camelCase, pick } from 'lodash';

import { mapKeysDeep } from '../utils/lodash-extensions';
import { ColumnRemaping, PlainObject, Place, PlaceEdit } from '../models';

export default class PlaceEditSerializer {
	placeEdit: PlaceEdit;

	constructor(placeEdit: PlaceEdit) {
		this.placeEdit = placeEdit;
	}

	extractAssociations(associationsColumns: PlainObject): PlainObject {
		const associations: PlainObject = {};
		Object.entries(associationsColumns).forEach(([name, fieldName]) => {
			const associationAsString = this.placeEdit[fieldName];
			if (associationAsString === undefined) return;

			associations[name] = this.jsonParseAndCamelCase(associationAsString);
		});

		return associations;
	}

	extractCommaDelimitedArray(columns: string[]): PlainObject {
		const columnData: PlainObject = {};
		columns.forEach((column) => {
			const columnAsString = this.placeEdit[column];
			if (columnAsString === undefined) return;

			columnData[column] = Place.decodeCommaDelimitedArray(column);
		});
		return columnData;
	}

	jsonParseAndCamelCase(value: string): PlainObject {
		const objectAsJson = JSON.parse(value);
		return mapKeysDeep(objectAsJson, camelCase);
	}

	defaultView(): PlainObject {
		return pick(this.placeEdit, [
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
			...pick(this.placeEdit, [
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
			...this.extractCommaDelimitedArray([
				'contributingResources',
				'designations',
				'records',
				'siteCategories',
			]),
			...this.extractAssociations({
				associations: 'associationJSON',
				constructionPeriods: 'constructionPeriodJSON',
				contacts: 'contactJSON',
				dates: 'datesJSON',
				descriptions: 'descriptionJSON',
				firstNationAssociations: 'firstNationAssociationJSON',
				functionalUses: 'functionalUseJSON',
				historicalPatterns: 'historicalPatternJSON',
				names: 'nameJSON',
				ownerships: 'ownershipJSON',
				previousOwnerships: 'previousOwnershipJSON',
				revisionLogs: 'revisionLogJSON',
				themes: 'themeJSON',
				webLinks: 'webLinkJSON',
			}),
		};
	}

	tableView(): PlainObject {
		return this.defaultView();
	}
}
