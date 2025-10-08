import BaseService from '../base-service';

import { DB_CONFIG } from '../../config';
import knex, { Knex } from 'knex';

const db = knex(DB_CONFIG);

export class DestroyService extends BaseService {
	constructor(private placeId: number) {
		super();
	}

	async perform(): Promise<void> {
		return db.transaction(async (trx) => {
			await this.deleteAssociations(trx);
			await this.deleteConstructionPeriods(trx);
			await this.deleteContacts(trx);
			await this.deleteDates(trx);
			await this.deleteDescriptions(trx);
			await this.deleteFirstNationAssociations(trx);
			await this.deleteFunctionalUses(trx);
			await this.deleteHistoricalPatterns(trx);
			await this.deleteNames(trx);
			await this.deleteOwnerships(trx);
			// await this.deletePhotos(trx);
			await this.deletePlaceEdits(trx);
			await this.deletePreviousOwnerships(trx);
			await this.deleteRevisionLogs(trx);
			await this.deleteThemes(trx);
			await this.deleteWebLinks(trx);

			await trx('place').where({ id: this.placeId }).delete();
		});
	}

	private async deleteAssociations(trx: Knex.Transaction) {
		await trx('Association').where({ placeId: this.placeId }).delete();
	}

	private async deleteConstructionPeriods(trx: Knex.Transaction) {
		await trx('ConstructionPeriod').where({ placeId: this.placeId }).delete();
	}

	private async deleteContacts(trx: Knex.Transaction) {
		await trx('Contact').where({ placeId: this.placeId }).delete();
	}

	private async deleteDates(trx: Knex.Transaction) {
		await trx('Dates').where({ placeId: this.placeId }).delete();
	}

	private async deleteDescriptions(trx: Knex.Transaction) {
		await trx('Description').where({ placeId: this.placeId }).delete();
	}

	private async deleteFirstNationAssociations(trx: Knex.Transaction) {
		await trx('FirstNationAssociation').where({ placeId: this.placeId }).delete();
	}

	private async deleteFunctionalUses(trx: Knex.Transaction) {
		await trx('FunctionalUse').where({ placeId: this.placeId }).delete();
	}

	private async deleteHistoricalPatterns(trx: Knex.Transaction) {
		await trx('historicalpattern').where({ placeId: this.placeId }).delete();
	}

	private async deleteNames(trx: Knex.Transaction) {
		await trx('name').where({ placeId: this.placeId }).delete();
	}

	private async deleteOwnerships(trx: Knex.Transaction) {
		await trx('Ownership').where({ placeId: this.placeId }).delete();
	}

	// private async deletePhotos(trx: Knex.Transaction) {
	// 	return;
	// }

	private async deletePlaceEdits(trx: Knex.Transaction) {
		// TODO Investigate if a seperate delete service is needed
		await trx('PlaceEdit').where({ placeId: this.placeId }).delete();
	}

	private async deletePreviousOwnerships(trx: Knex.Transaction) {
		await trx('PreviousOwnership').where({ placeId: this.placeId }).delete();
	}

	private async deleteRevisionLogs(trx: Knex.Transaction) {
		await trx('RevisionLog').where({ placeId: this.placeId }).delete();
	}

	private async deleteThemes(trx: Knex.Transaction) {
		await trx('Theme').where({ placeId: this.placeId }).delete();
	}

	private async deleteWebLinks(trx: Knex.Transaction) {
		await trx('WebLink').where({ placeId: this.placeId }).delete();
	}
}

export default DestroyService;
