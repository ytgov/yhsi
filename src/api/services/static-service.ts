import knex, { Knex } from 'knex';
import {
	Community,
	FirstNation,
	FunctionalType,
	OriginalMedia,
	PhotoOwner,
	PhotoSubject,
	PhotoProject,
	PlaceTheme,
	Statute,
	MapSheetLookup,
} from '../data';
import {
	CATEGORY_TYPES,
	CONTRIBUTING_RESOURCE_TYPES,
	DESIGNATION_TYPES,
	GenericStringEnum,
	RECORD_TYPES,
	SITE_CATEGORY_TYPES,
} from '../models';

export class StaticService {
	private knex: Knex;

	constructor(config: Knex.Config<any>) {
		this.knex = knex(config);
	}

	async getCommunities(): Promise<Array<Community>> {
		return this.knex<Community>('Community').select('id', 'name');
	}

	async getFirstNations(): Promise<Array<FirstNation>> {
		return this.knex<FirstNation>('FirstNation').select('id', 'description');
	}

	async getFunctionalTypes(): Promise<Array<FunctionalType>> {
		return this.knex<FunctionalType>('FunctionalType')
			.select('id', 'description')
			.orderBy('description');
	}

	async getOriginalMedias(): Promise<Array<OriginalMedia>> {
		return this.knex<OriginalMedia>('OriginalMedia').select('id', 'type');
	}

	async getPhotoOwners(): Promise<Array<PhotoOwner>> {
		return this.knex<PhotoOwner>('PhotoOwner').select(
			'id',
			'name',
			'email',
			'address',
			'telephone',
			'contactPerson'
		);
	}

	async getPhotoOwner(id: number): Promise<PhotoOwner | undefined> {
		return this.knex<PhotoOwner>('PhotoOwner')
			.where({ id })
			.select('id', 'name', 'email', 'address', 'telephone', 'contactPerson')
			.first();
	}

	async addPhotoOwner(owner: PhotoOwner): Promise<PhotoOwner | undefined> {
		return this.knex('PhotoOwner')
			.insert(owner)
			.returning<PhotoOwner>([
				'id',
				'name',
				'email',
				'address',
				'telephone',
				'contactPerson',
			]);
	}

	async updatePhotoOwner(
		id: number,
		item: PhotoOwner
	): Promise<PhotoOwner | undefined> {
		return this.knex('PhotoOwner')
			.where({ id: id })
			.update(item)
			.returning<PhotoOwner>([
				'id',
				'name',
				'email',
				'address',
				'telephone',
				'contactPerson',
			]);
	}

	async deletePhotoOwner(id: number): Promise<any> {
		return this.knex('PhotoOwner').where({ id }).delete();
	}

	async getPhotoProjects(): Promise<Array<PhotoProject>> {
		return this.knex<PhotoProject>('PhotoProject').select(
			'id',
			'name',
			'permit',
			'year',
			'section'
		);
	}

	async getPhotoProject(id: number): Promise<PhotoProject | undefined> {
		return this.knex<PhotoProject>('PhotoProject')
			.where({ id })
			.select('id', 'name', 'permit', 'year', 'section')
			.first();
	}

	async addPhotoProject(item: PhotoProject): Promise<PhotoProject | undefined> {
		return this.knex('PhotoProject')
			.insert(item)
			.returning<PhotoProject>(['id', 'name', 'permit', 'year', 'section']);
	}

	async updatePhotoProject(
		id: number,
		item: PhotoProject
	): Promise<PhotoProject | undefined> {
		return this.knex('PhotoProject')
			.where({ id: id })
			.update(item)
			.returning<PhotoProject>(['id', 'name', 'permit', 'year', 'section']);
	}

	async deletePhotoProject(id: number): Promise<any> {
		return this.knex('PhotoProject').where({ id }).delete();
	}

	async getPlaceThemes(): Promise<Array<PlaceTheme>> {
		return this.knex<PlaceTheme>('PlaceTheme').select('id', 'category', 'type');
	}

	async getStatutes(): Promise<Array<Statute>> {
		return this.knex<Statute>('Statute').select(
			'id',
			'recognitionAuthority',
			'recognitionType',
			'description',
			'allStatute'
		);
	}

	async getMapSheets(): Promise<Array<MapSheetLookup>> {
		return this.knex<MapSheetLookup>('YHIS.MapSheetLookup')
			.select('id', 'map50k', 'map250k')
			.orderBy('map50k');
	}

	async getPhotoSubjects(): Promise<Array<PhotoSubject>> {
		return this.knex<PhotoSubject>('PhotoSubject').select('id', 'name');
	}

	async getPhotoSubject(id: number): Promise<PhotoSubject | undefined> {
		return this.knex<PhotoSubject>('PhotoSubject')
			.where({ id })
			.select('id', 'name')
			.first();
	}

	async addPhotoSubject(
		owner: PhotoSubject
	): Promise<PhotoSubject | undefined> {
		return this.knex('PhotoSubject')
			.insert(owner)
			.returning<PhotoSubject>(['id', 'name']);
	}

	async updatePhotoSubject(
		id: number,
		item: PhotoSubject
	): Promise<PhotoSubject | undefined> {
		return this.knex('PhotoSubject')
			.where({ id: id })
			.update(item)
			.returning<PhotoSubject>(['id', 'name']);
	}

	async deletePhotoSubject(id: number): Promise<any> {
		return this.knex('PhotoSubject').where({ id }).delete();
	}

	getPhotoProjectSections(): GenericEnum[] {
		return [
			{ value: 1, text: 'Archival' },
			{ value: 2, text: 'Archaeology' },
			{ value: 3, text: 'Palaeontology' },
			{ value: 4, text: 'Historic Sites' },
		];
	}

	getJurisdictions(): GenericEnum[] {
		return [
			{ value: 0, text: 'None Selected' },
			{ value: 1, text: 'Yukon' },
			{ value: 2, text: 'Federal' },
		];
	}

	getOwnerConsents(): GenericEnum[] {
		return [
			{ value: 0, text: 'None Selected' },
			{ value: 1, text: 'Consent' },
			{ value: 2, text: 'No Response' },
			{ value: 3, text: 'Objection' },
		];
	}

	getCategories(): readonly GenericStringEnum[] {
		return CATEGORY_TYPES;
	}

	getDesignationTypes(): readonly GenericStringEnum[] {
		return DESIGNATION_TYPES;
	}

	getConditions(): GenericEnum[] {
		return [
			{ value: 0, text: 'Not Applicable' },
			{ value: 3, text: 'Poor' },
			{ value: 1, text: 'Fair' },
			{ value: 2, text: 'Good' },
		];
	}

	getCoordinateDeterminations(): GenericEnum[] {
		return [
			{ value: 4, text: 'Digital Maps' },
			{ value: 5, text: 'Geocoding' },
			{ value: 1, text: 'GPS' },
			{ value: 2, text: 'Paper Maps' },
			{ value: 3, text: 'Unknown' },
		];
	}

	getSiteStatuses(): GenericEnum[] {
		return [
			{ value: 1, text: 'Standing' },
			{ value: 2, text: 'Demolished' },
			{ value: 3, text: 'Burned' },
			{ value: 4, text: 'Moved' },
			{ value: 5, text: 'Dimantled' },
			{ value: 6, text: 'Reconstruction' },
		];
	}

	getRecordTypes(): readonly GenericStringEnum[] {
		return RECORD_TYPES;
	}

	getSiteCategories(): readonly GenericStringEnum[] {
		return SITE_CATEGORY_TYPES;
	}

	getContributingResourceTypes(): readonly GenericStringEnum[] {
		return CONTRIBUTING_RESOURCE_TYPES;
	}

	getPhotoPrograms(): GenericEnum[] {
		return [
			{ value: 1, text: 'General' },
			{ value: 2, text: 'Interpretation' },
			{ value: 3, text: 'HPAC' },
			{ value: 4, text: 'YHSI' },
		];
	}

	getMediaStorages(): GenericEnum[] {
		return [
			{ value: 1, text: 'Library' },
			{ value: 2, text: 'YHSI Files' },
			{ value: 3, text: 'Restoration Officer' },
			{ value: 4, text: 'Database' },
			{ value: 5, text: 'Archaeology Slide Collection' },
		];
	}

	getCopyrights(): GenericEnum[] {
		return [
			{ value: 1, text: 'Use Credit Line' },
			{ value: 2, text: 'No reproduction without permission from Archives' },
			{ value: 3, text: 'No reproduction without permission from donor' },
			{ value: 4, text: 'No reproduction for commercial purposes' },
			{ value: 5, text: 'Credit Archives' },
			{ value: 6, text: 'Incomplete Image Information - check ownership' },
			{ value: 7, text: 'Use Owner' },
		];
	}

	getUsageRights(): GenericEnum[] {
		return [
			{ value: 0, text: 'No reuse permitted' },
			{ value: 1, text: 'Non-commercial reuse permitted' },
		];
	}

	getPhotoRatings(): GenericEnum[] {
		return [
			{ value: 1, text: '1 Star' },
			{ value: 2, text: '2 Stars' },
			{ value: 3, text: '3 Stars' },
			{ value: 4, text: '4 Stars' },
			{ value: 5, text: '5 Stars' },
		];
	}
}

export interface GenericEnum {
	value: number;
	text: string;
}
