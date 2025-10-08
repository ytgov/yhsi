import { isNil, isString } from 'lodash';
import fs from 'fs';
import { create } from 'handlebars';
import knex from 'knex';

import { DB_CONFIG } from '../../config';

import handlebarsHelpers from '../../utils/handlebars-helpers';
import {
	ASSOCIATION_TYPES,
	CONDITION_TYPES,
	CONSTRUCTION_PERIOD_TYPES,
	CONTACT_TYPES,
	DESCRIPTION_TYPES,
	FIRST_NATION_ASSOCIATION_TYPES,
	FUNCTIONAL_USE_TYPES,
	JURISDICTION_TYPES,
	OWNER_CONSENT_TYPES,
	OWNERSHIP_TYPES,
	Place,
	REVISION_LOG_TYPES,
	SITE_STATUS_TYPES,
	WEB_LINK_TYPES,
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
			recognitionDate,
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
			dates,
			previousOwnerships,
		} = this.place;

		const constructionPeriodsHandlebarData = this.makeConstructionPeriodsHandlebarData();

		const foundFloorCondition = CONDITION_TYPES.find(
			(conditionType) => conditionType.value == floorCondition
		);
		const floorConditionName = foundFloorCondition ? foundFloorCondition.text : 'Not Applicable';

		const foundRoofCondition = CONDITION_TYPES.find(
			(conditionType) => conditionType.value == roofCondition
		);
		const roofConditionName = foundRoofCondition ? foundRoofCondition.text : 'Not Applicable';

		const foundWallCondition = CONDITION_TYPES.find(
			(conditionType) => conditionType.value == wallCondition
		);
		const wallConditionName = foundWallCondition ? foundWallCondition.text : 'Not Applicable';

		const foundDoorCondition = CONDITION_TYPES.find(
			(conditionType) => conditionType.value == doorCondition
		);
		const doorConditionName = foundDoorCondition ? foundDoorCondition.text : 'Not Applicable';

		const foundSiteStatus = SITE_STATUS_TYPES.find(
			(siteStatusType) => siteStatusType.value == siteStatus
		);
		const siteStatusName = foundSiteStatus ? foundSiteStatus.text : 'Not Applicable';

		const themesHandlebarData = await this.makeThemesHandlebarData();
		const functionalUsesHandlebarData = await this.makeFunctionalUsesHandlebarData();
		const associationsHandlebarData = this.makeAssociationsHandlebarData();
		const firstNationAssociationsHandlebarData =
			await this.makeFirstNationAssociationsHandlebarData();
		const ownershipsHandlebarData = this.makeOwnershipsHandlebarData();
		const contactsHandlebarData = this.makeContactsHandlebarData();
		const revisionLogsHandlebarData = this.makeRevisionLogsHandlebarData();
		const webLinksHandlebarData = this.makeWebLinksHandlebarData();
		const descriptionsHandlebarData = this.makeDescriptionsHandlebarData();

		const foundJurisdiction = JURISDICTION_TYPES.find(
			(jurisdictionType) => jurisdictionType.value == this.place.jurisdiction
		);

		const jurisdictionHandlebarData = foundJurisdiction ? foundJurisdiction.text : 'None Selected';

		const foundOwnerConsent = OWNER_CONSENT_TYPES.find(
			(ownerConsentType) => ownerConsentType.value == this.place.ownerConsent
		);

		const ownerConsentHandlebarData = foundOwnerConsent ? foundOwnerConsent.text : 'None Selected';

		let statuteHandlebarData = '';
		if (!isNil(this.place.statuteId)) {
			statuteHandlebarData = await this.makeStatuteHandlebarData(this.place.statuteId);
		}

		let secondaryStatuteHandlebarData = '';
		if (!isNil(this.place.statute2Id)) {
			secondaryStatuteHandlebarData = await this.makeStatuteHandlebarData(this.place.statute2Id);
		}

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
			recognitionDate,
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
			siteStatus: siteStatusName,
			floorCondition: floorConditionName,
			wallCondition: wallConditionName,
			doorCondition: doorConditionName,
			roofCondition: roofConditionName,
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
			constructionPeriods: constructionPeriodsHandlebarData,
			dates,
			themes: themesHandlebarData,
			functionalUses: functionalUsesHandlebarData,
			associations: associationsHandlebarData,
			firstNationAssociations: firstNationAssociationsHandlebarData,
			ownerships: ownershipsHandlebarData,
			previousOwnerships,
			revisionLogs: revisionLogsHandlebarData,
			contacts: contactsHandlebarData,
			webLinks: webLinksHandlebarData,
			jurisdiction: jurisdictionHandlebarData,
			ownerConsent: ownerConsentHandlebarData,
			statute: statuteHandlebarData,
			secondaryStatute: secondaryStatuteHandlebarData,
			descriptions: descriptionsHandlebarData,
		};

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

	private makeAssociationsHandlebarData() {
		const associationsHandlebarData: { type: string; description: string }[] = [];
		if (isNil(this.place.associations)) return [];

		for (const association of this.place.associations) {
			const a = ASSOCIATION_TYPES.find(
				(associationType) => associationType.value == association.type
			);

			if (isNil(a)) continue;

			associationsHandlebarData.push({
				type: a.text,
				description: association.description,
			});
		}

		return associationsHandlebarData;
	}

	private async makeFirstNationAssociationsHandlebarData() {
		const firstNationAssociationsHandlebarData: {
			firstNation: string;
			firstNationAssociationType: string;
			comments: string;
		}[] = [];
		if (isNil(this.place.firstNationAssociations)) return [];

		for (const firstNationAssociation of this.place.firstNationAssociations) {
			const firstNationAssociationType = FIRST_NATION_ASSOCIATION_TYPES.find(
				(firstNationAssociationType) =>
					firstNationAssociationType.value == firstNationAssociation.firstNationAssociationType
			);

			if (isNil(firstNationAssociationType)) continue;

			const firstNation = await db('FirstNation')
				.select('description')
				.where({ id: firstNationAssociation.firstNationId })
				.then((results) => {
					return results[0].description;
				});

			if (isNil(firstNation)) continue;

			firstNationAssociationsHandlebarData.push({
				firstNation: firstNation,
				firstNationAssociationType: firstNationAssociationType.text,
				comments: firstNationAssociation.comments,
			});
		}

		return firstNationAssociationsHandlebarData;
	}

	private makeOwnershipsHandlebarData() {
		const ownershipsHandlebarData: { ownershipType: string; comments: string }[] = [];
		if (isNil(this.place.ownerships)) return [];

		for (const ownership of this.place.ownerships) {
			const ownershipType = OWNERSHIP_TYPES.find(
				(ownershipType) => ownershipType.value == ownership.ownershipType
			);

			if (isNil(ownershipType)) continue;

			ownershipsHandlebarData.push({
				ownershipType: ownershipType.text,
				comments: ownership.comments,
			});
		}

		return ownershipsHandlebarData;
	}

	private makeRevisionLogsHandlebarData() {
		const revisionLogsHandlebarData: {
			revisionLogType: string;
			revisionDate: string;
			revisedBy: string;
			details: string;
		}[] = [];

		if (isNil(this.place.revisionLogs)) return [];

		this.place.revisionLogs.forEach((revisionLog) => {
			const d = REVISION_LOG_TYPES.find(
				(revisionLogType) => revisionLogType.value == revisionLog.revisionLogType
			);

			if (isNil(d)) return;

			revisionLogsHandlebarData.push({
				revisionLogType: d.text,
				revisionDate: revisionLog.revisionDate,
				revisedBy: revisionLog.revisedBy,
				details: revisionLog.details,
			});
		});

		return revisionLogsHandlebarData;
	}

	private makeContactsHandlebarData() {
		const contactsHandlebarData: {
			contactType: string;
			description: string;
			email: string;
			firstName: string;
			lastName: string;
			mailingAddress: string;
			phoneNumber: string;
		}[] = [];

		if (isNil(this.place.contacts)) return [];

		this.place.contacts.forEach((contact) => {
			const d = CONTACT_TYPES.find((contactType) => contactType.value == contact.contactType);

			if (isNil(d)) return;

			contactsHandlebarData.push({
				contactType: d.text,
				description: contact.description,
				email: contact.email,
				firstName: contact.firstName,
				lastName: contact.lastName,
				mailingAddress: contact.mailingAddress,
				phoneNumber: contact.phoneNumber,
			});
		});

		return contactsHandlebarData;
	}

	private makeWebLinksHandlebarData() {
		const webLinksHandlebarData: { type: string; address: string }[] = [];

		if (isNil(this.place.webLinks)) return [];

		this.place.webLinks.forEach((webLink) => {
			const d = WEB_LINK_TYPES.find((webLinkType) => webLinkType.value == webLink.type);

			if (isNil(d)) return;

			webLinksHandlebarData.push({
				type: d.text,
				address: webLink.address,
			});
		});

		return webLinksHandlebarData;
	}

	private async makeStatuteHandlebarData(statuteId: number) {
		const statute = await db('Statute')
			.select('RecognitionAuthority', 'RecognitionType', 'Description', 'AllStatute')
			.where({ Id: statuteId })
			.then((results) => {
				return results[0];
			});

		if (isNil(statute)) return '';

		const { RecognitionAuthority, RecognitionType, Description, AllStatute } = statute;

		if (!isString(RecognitionAuthority)) return '';
		if (!isString(RecognitionType)) return '';
		if (!isString(Description)) return '';
		if (!isString(AllStatute)) return '';

		return `${RecognitionAuthority} / ${RecognitionType} / ${Description} / ${AllStatute}`;
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
