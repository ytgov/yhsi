import { Knex } from 'knex';
import { isNil } from 'lodash';

export async function seed(knex: Knex): Promise<void> {
	const communityAttributes = { Name: 'Whitehorse' };
	let community = await knex('Community').where({ Name: communityAttributes.Name }).first();
	if (isNil(community)) {
		[community] = await knex('Community').insert(communityAttributes).returning('*');
	} else {
		await knex('Community').where('Id', community.Id).update(communityAttributes);
	}

	const statuteAttributes = {
		RecognitionAuthority: 'Yukon Authority',
		RecognitionType: 'Recognition Type',
		Description: 'Default Statute',
	};
	let statute = await knex('Statute')
		.where({ RecognitionAuthority: statuteAttributes.RecognitionAuthority })
		.first();
	if (isNil(statute)) {
		[statute] = await knex('Statute').insert(statuteAttributes).returning('*');
	} else {
		await knex('Statute').where('Id', statute.Id).update(statuteAttributes);
	}

	const placesAttributes = [
		{
			PrimaryName: 'Sample Place 1',
			YHSIId: 'YH0001',
			NTSMapSheet: '105A',
			Jurisdiction: 1,
			StatuteId: statute.Id,
			Statute2Id: statute.Id,
			OwnerConsent: 1,
			Category: 1,
			IsPubliclyAccessible: 1,
			CommunityId: community.Id,
			SiteStatus: 1,
			FloorCondition: 1,
			WallCondition: 1,
			DoorCondition: 1,
			RoofCondition: 1,
			CoordinateDetermination: 1,
			ShowInRegister: 1,
		},
		{
			PrimaryName: 'Sample Place 2',
			YHSIId: 'YH0002',
			NTSMapSheet: '105B',
			Jurisdiction: 1,
			StatuteId: statute.Id,
			Statute2Id: statute.Id,
			OwnerConsent: 1,
			Category: 1,
			IsPubliclyAccessible: 1,
			CommunityId: community.Id,
			SiteStatus: 1,
			FloorCondition: 1,
			WallCondition: 1,
			DoorCondition: 1,
			RoofCondition: 1,
			CoordinateDetermination: 1,
			ShowInRegister: 1,
		},
		{
			PrimaryName: 'Sample Place 3',
			YHSIId: 'YH0003',
			NTSMapSheet: '115A',
			Jurisdiction: 1,
			StatuteId: statute.Id,
			Statute2Id: statute.Id,
			OwnerConsent: 1,
			Category: 1,
			IsPubliclyAccessible: 1,
			CommunityId: community.Id,
			SiteStatus: 1,
			FloorCondition: 1,
			WallCondition: 1,
			DoorCondition: 1,
			RoofCondition: 1,
			CoordinateDetermination: 1,
			ShowInRegister: 1,
		},
		{
			PrimaryName: 'Sample Place 4',
			YHSIId: 'YH0004',
			NTSMapSheet: '115B',
			Jurisdiction: 1,
			StatuteId: statute.Id,
			Statute2Id: statute.Id,
			OwnerConsent: 1,
			Category: 1,
			IsPubliclyAccessible: 1,
			CommunityId: community.Id,
			SiteStatus: 1,
			FloorCondition: 1,
			WallCondition: 1,
			DoorCondition: 1,
			RoofCondition: 1,
			CoordinateDetermination: 1,
			ShowInRegister: 1,
		},
	];

	for (const placeAttributes of placesAttributes) {
		let place = await knex('Place').where({ YHSIId: placeAttributes.YHSIId }).first();
		if (isNil(place)) {
			[place] = await knex('Place').insert(placeAttributes).returning('*');
		} else {
			await knex('Place').where('Id', place.Id).update(placeAttributes);
		}
	}
}
