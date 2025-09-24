import { isNil } from 'lodash';
import fs from 'fs';
import { create } from 'handlebars';
import knex from 'knex';

import { DB_CONFIG } from '../../config';

import handlebarsHelpers from '../../utils/handlebars-helpers';
import {
	CONSTRUCTION_PERIOD_TYPES,
	DESCRIPTION_TYPES,
	FUNCTIONAL_USE_TYPES,
	Place,
} from '../../models';
import BaseService from '../base-service';

const db = knex(DB_CONFIG);

export class PrintSiteService extends BaseService {
	constructor(
		private place: Place,
		private selectedSections: string[]
	) {
		super();
	}

	async perform(): Promise<string> {
		const includeSummarySection = this.selectedSections.includes('Summary');
		const includeLocationSection = this.selectedSections.includes('Location');
		const includeDatesAndConditionSection = this.selectedSections.includes('Dates & Condition');
		const includeThemesAndFunctionSection = this.selectedSections.includes('Themes & Function');
		const includeAssociationsSection = this.selectedSections.includes('Associations');
		const includeLegalAndZoningSection = this.selectedSections.includes('Legal & Zoning');
		const includePhotosSection = this.selectedSections.includes('Photos');
		const includeManagementSection = this.selectedSections.includes('Management');
		const includeDescriptionSection = this.selectedSections.includes('Description');

		const PDF_TEMPLATE = fs.readFileSync(
			__dirname + '/../../templates/places/placePrint.handlebars'
		);
		const h = create();
		h.registerHelper('joinArray', handlebarsHelpers.joinArray);
		h.registerHelper('joinArrayPick', handlebarsHelpers.joinArrayPick);
		const template = h.compile(PDF_TEMPLATE.toString(), {});

		const {
			primaryName,
			names,
			historicalPatterns,
			yHSIId,
			jurisdiction,
			statuteId,
			statute2Id,
			recognitionDate,
			ownerConsent,
			category,
			isPubliclyAccessible,
			nTSMapSheet,
			bordenNumber,
			geocode,
			hectareArea,
			latitude,
			longitude,
			locationComment,
			resourceType,
			buildingSize,
			conditionComment,
			currentUseComment,
			yHSPastUse,
			cIHBNumber,
			groupYHSI,
			yGBuildingNumber,
			yGReserveNumber,
			fHBRONumber,
			zoning,
			townSiteMapNumber,
			siteDistrictNumber,
			planNumber,
			block,
			lot,
			slideNegativeIndex,
			otherCommunity,
			otherLocality,
			previousAddress,
			yHSThemes,
			rollNumber,
			locationContext,
			communityId,
			lAGroup,
			siteStatus,
			floorCondition,
			wallCondition,
			doorCondition,
			roofCondition,
			coordinateDetermination,
			physicalAddress,
			physicalProvince,
			physicalCountry,
			physicalPostalCode,
			mailingAddress,
			mailingProvince,
			mailingCountry,
			mailingPostalCode,
			showInRegister,
			siteCategories,
			designations,
			contributingResources,
			records,
			communityName,
			coordinateDeterminationName,
			hasPendingChanges,
			associations,
			contacts,
			dates,
		} = this.place;

		const constructionPeriodsHandlebarData = this.makeConstructionPeriodsHandlebarData();
		const themesHandlebarData = await this.makeThemesHandlebarData();
		const functionalUsesHandlebarData = await this.makeFunctionalUsesHandlebarData();
		const descriptionsHandlebarData = this.makeDescriptionsHandlebarData();

		const handlebarsData = {
			includeSummarySection,
			includeLocationSection,
			includeDatesAndConditionSection,
			includeThemesAndFunctionSection,
			includeAssociationsSection,
			includeLegalAndZoningSection,
			includePhotosSection,
			includeManagementSection,
			includeDescriptionSection,
			primaryName,
			names,
			historicalPatterns,
			yHSIId,
			jurisdiction,
			statuteId,
			statute2Id,
			recognitionDate,
			ownerConsent,
			category,
			isPubliclyAccessible,
			nTSMapSheet,
			bordenNumber,
			geocode,
			hectareArea,
			latitude,
			longitude,
			locationComment,
			resourceType,
			buildingSize,
			conditionComment,
			currentUseComment,
			yHSPastUse,
			cIHBNumber,
			groupYHSI,
			yGBuildingNumber,
			yGReserveNumber,
			fHBRONumber,
			zoning,
			townSiteMapNumber,
			siteDistrictNumber,
			planNumber,
			block,
			lot,
			slideNegativeIndex,
			otherCommunity,
			otherLocality,
			previousAddress,
			yHSThemes,
			rollNumber,
			locationContext,
			communityId,
			lAGroup,
			siteStatus,
			floorCondition,
			wallCondition,
			doorCondition,
			roofCondition,
			coordinateDetermination,
			physicalAddress,
			physicalProvince,
			physicalCountry,
			physicalPostalCode,
			mailingAddress,
			mailingProvince,
			mailingCountry,
			mailingPostalCode,
			showInRegister,
			siteCategories,
			designations,
			contributingResources,
			records,
			communityName,
			coordinateDeterminationName,
			hasPendingChanges,
			associations,
			constructionPeriods: constructionPeriodsHandlebarData,
			contacts,
			dates,
			themes: themesHandlebarData,
			functionalUses: functionalUsesHandlebarData,
			descriptions: descriptionsHandlebarData,
		};

		console.log(handlebarsData);

		return template(handlebarsData);
	}

	private makeConstructionPeriodsHandlebarData() {
		const constructionPeriodsHandlebarData: { type: string }[] = [];
		if (!isNil(this.place.constructionPeriods)) {
			for (const constructionPeriod of this.place.constructionPeriods) {
				const c = CONSTRUCTION_PERIOD_TYPES.find(
					(constructionPeriodType) => constructionPeriodType.value == constructionPeriod.type
				);

				if (isNil(c)) return;

				constructionPeriodsHandlebarData.push({
					type: c.text,
				});
			}
		}

		return constructionPeriodsHandlebarData;
	}

	private async makeThemesHandlebarData() {
		const themesHandlebarData: { category: string; type: string }[] = [];
		if (isNil(this.place.themes)) return [];

		for (const theme of this.place.themes) {
			const placeTheme = await db('PlaceTheme')
				.select('category', 'type')
				.where({ id: theme.placeThemeId })
				.then((results) => {
					return results[0];
				});

			if (isNil(placeTheme)) continue;

			themesHandlebarData.push({
				category: placeTheme.category,
				type: placeTheme.type,
			});
		}

		return themesHandlebarData;
	}

	private async makeFunctionalUsesHandlebarData() {
		const functionalUsesHandlebarData: { functionalType: string; functionalUseType: string }[] = [];
		if (isNil(this.place.functionalUses)) return [];

		for (const functionalUse of this.place.functionalUses) {
			const d = FUNCTIONAL_USE_TYPES.find(
				(functionalUseType) => functionalUseType.value == functionalUse.functionalUseType
			);

			if (isNil(d)) continue;

			const functionalType = await db('FunctionalType')
				.select('description')
				.where({ id: functionalUse.functionalTypeId })
				.then((results) => {
					return results[0].description;
				});

			if (isNil(functionalType)) continue;

			functionalUsesHandlebarData.push({
				functionalType: functionalType,
				functionalUseType: d.text,
			});
		}

		return functionalUsesHandlebarData;
	}

	private makeDescriptionsHandlebarData() {
		const descriptions: {
			value: string;
			text: string;
		}[] = [];
		if (!isNil(this.place.descriptions)) {
			this.place.descriptions.forEach((description) => {
				const d = DESCRIPTION_TYPES.find(
					(descriptionType) => descriptionType.value == description.type
				);

				if (isNil(d)) return;

				descriptions.push({
					value: d.text,
					text: description.descriptionText,
				});
			});
		}

		return descriptions;
	}
}

export default PrintSiteService;
