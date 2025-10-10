import knex, { Knex } from 'knex';

import { Contact } from '../models';

export class ContactService {
	private db: Knex;

	constructor(config: Knex.Config<any>) {
		this.db = knex(config);
	}

	async getFor(placeId: number) {
		return this.db('Contact')
			.where({ placeId })
			.select<Contact[]>([
				'id',
				'placeId',
				'contactType',
				'description',
				'email',
				'firstName',
				'lastName',
				'mailingAddress',
				'phoneNumber',
			]);
	}

	async upsertFor(placeId: number, contacts: Contact[]) {
		return new Promise((resolve) => {
			resolve(
				contacts.map((contact) => ({
					placeId,
					contactType: contact.contactType,
					description: contact.description?.trim(),
					email: contact.email?.trim(),
					firstName: contact.firstName?.trim(),
					lastName: contact.lastName?.trim(),
					mailingAddress: contact.mailingAddress?.trim(),
					phoneNumber: contact.phoneNumber?.trim(),
				}))
			);
		}).then((cleanContacts) => {
			return this.db.transaction(async (trx) => {
				await trx('Contact').where({ placeId }).delete();

				if (Array.isArray(cleanContacts) && cleanContacts.length === 0) {
					return [];
				}

				return trx.insert(cleanContacts).into('Contact');
			});
		});
	}
}
