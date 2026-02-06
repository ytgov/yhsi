import db from 'db/db-client';
import {
	Community,
	FirstNation,
	FunctionalType,
	OriginalMedia,
	PhotoOwner,
	PhotoSubject,
	PhotoProject,
	PlaceTheme,
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
	async getCommunities(): Promise<Array<Community>> {
		return db<Community>('Community').select('id', 'name');
	}

	async getFirstNations(): Promise<Array<FirstNation>> {
		return db<FirstNation>('FirstNation').select('id', 'description');
	}

	async getFunctionalTypes(): Promise<Array<FunctionalType>> {
		return db<FunctionalType>('FunctionalType').select('id', 'description').orderBy('description');
	}

	async getOriginalMedias(): Promise<Array<OriginalMedia>> {
		return db<OriginalMedia>('OriginalMedia').select('id', 'type');
	}

	async getPhotoOwners(): Promise<Array<PhotoOwner>> {
		return db<PhotoOwner>('PhotoOwner').select(
			'id',
			'name',
			'email',
			'address',
			'telephone',
			'contactPerson'
		);
	}

	async getPhotoOwner(id: number): Promise<PhotoOwner | undefined> {
		return db<PhotoOwner>('PhotoOwner')
			.where({ id })
			.select('id', 'name', 'email', 'address', 'telephone', 'contactPerson')
			.first();
	}

	async addPhotoOwner(owner: PhotoOwner): Promise<PhotoOwner | undefined> {
		return db('PhotoOwner')
			.insert(owner)
			.returning<PhotoOwner>(['id', 'name', 'email', 'address', 'telephone', 'contactPerson']);
	}

	async updatePhotoOwner(id: number, item: PhotoOwner): Promise<PhotoOwner | undefined> {
		return db('PhotoOwner')
			.where({ id: id })
			.update(item)
			.returning<PhotoOwner>(['id', 'name', 'email', 'address', 'telephone', 'contactPerson']);
	}

	async deletePhotoOwner(id: number): Promise<any> {
		return db('PhotoOwner').where({ id }).delete();
	}

	async getPhotoProjects(): Promise<Array<PhotoProject>> {
		return db<PhotoProject>('PhotoProject').select('id', 'name', 'permit', 'year', 'section');
	}

	async getPhotoProject(id: number): Promise<PhotoProject | undefined> {
		return db<PhotoProject>('PhotoProject')
			.where({ id })
			.select('id', 'name', 'permit', 'year', 'section')
			.first();
	}

	async addPhotoProject(item: PhotoProject): Promise<PhotoProject | undefined> {
		return db('PhotoProject')
			.insert(item)
			.returning<PhotoProject>(['id', 'name', 'permit', 'year', 'section']);
	}

	async updatePhotoProject(id: number, item: PhotoProject): Promise<PhotoProject | undefined> {
		return db('PhotoProject')
			.where({ id: id })
			.update(item)
			.returning<PhotoProject>(['id', 'name', 'permit', 'year', 'section']);
	}

	async deletePhotoProject(id: number): Promise<any> {
		return db('PhotoProject').where({ id }).delete();
	}

	async getPlaceThemes(): Promise<Array<PlaceTheme>> {
		return db<PlaceTheme>('PlaceTheme').select('id', 'category', 'type');
	}

	async getMapSheets(): Promise<Array<MapSheetLookup>> {
		return db<MapSheetLookup>('YHIS.MapSheetLookup')
			.select('id', 'map50k', 'map250k')
			.orderBy('map50k');
	}

	async getPhotoSubjects(): Promise<Array<PhotoSubject>> {
		return db<PhotoSubject>('PhotoSubject').select('id', 'name');
	}

	async getPhotoSubject(id: number): Promise<PhotoSubject | undefined> {
		return db<PhotoSubject>('PhotoSubject').where({ id }).select('id', 'name').first();
	}

	async addPhotoSubject(owner: PhotoSubject): Promise<PhotoSubject | undefined> {
		return db('PhotoSubject').insert(owner).returning<PhotoSubject>(['id', 'name']);
	}

	async updatePhotoSubject(id: number, item: PhotoSubject): Promise<PhotoSubject | undefined> {
		return db('PhotoSubject')
			.where({ id: id })
			.update(item)
			.returning<PhotoSubject>(['id', 'name']);
	}

	async deletePhotoSubject(id: number): Promise<any> {
		return db('PhotoSubject').where({ id }).delete();
	}

	getPhotoProjectSections(): GenericEnum[] {
		return [
			{ value: 1, text: 'Archival' },
			{ value: 2, text: 'Archaeology' },
			{ value: 3, text: 'Palaeontology' },
			{ value: 4, text: 'Historic Sites' },
		];
	}

	getCategories(): readonly GenericEnum[] {
		return CATEGORY_TYPES;
	}

	getDesignationTypes(): readonly GenericStringEnum[] {
		return DESIGNATION_TYPES;
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
