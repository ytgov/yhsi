import Knex from 'knex';
import {
	Community,
	FirstNation,
	FunctionalType,
	OriginalMedia,
	PhotoOwner,
	PhotoProject,
	PlaceTheme,
	Statute,
} from '../data';

export class StaticService {
	private knex: Knex;

	constructor(config: Knex.Config<any>) {
		this.knex = Knex(config);
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

	getCategories(): GenericEnum[] {
		return [
			{ value: 0, text: 'None Selected' },
			{ value: 1, text: 'Building' },
			{ value: 2, text: 'District' },
			{ value: 3, text: 'Place' },
			{ value: 4, text: 'Structure' },
		];
	}

	getDesignationTypes(): GenericEnum[] {
		return [
			{ value: 4, text: 'Federal' },
			{ value: 2, text: 'Municipal' },
			{ value: 3, text: 'Territorial' },
			{ value: 5, text: 'World' },
			{ value: 0, text: 'Not Designated' },
		];
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

	getRecordTypes(): GenericEnum[] {
		return [
			{ value: 1, text: 'CRHP' },
			{ value: 2, text: 'WHBR' },
		];
	}

	getSiteCategories(): GenericEnum[] {
		return [
			{ value: 1, text: 'Architecture' },
			{ value: 4, text: 'First Nation' },
			{ value: 5, text: 'Gravesite' },
			{ value: 2, text: 'Industrial' },
			{ value: 3, text: 'Landscape' },
		];
	}

	getContributingResourceTypes(): GenericEnum[] {
		return [
			{ value: 4, text: 'Archaeological' },
			{ value: 2, text: 'Building' },
			{ value: 9, text: 'Collection' },
			{ value: 3, text: 'Landscapes' },
			{ value: 1, text: 'Structure' },
		];
	}
}

export interface GenericEnum {
	value: number;
	text: string;
}
