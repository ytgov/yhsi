import knex from 'knex';

import { DB_CONFIG } from '../../config';
import { User, UserRoles, UserSiteAccess, SiteAccesType } from '../../models';
import { PlacePolicyScope } from '../../policies';

describe('PlacePolicyScope', () => {
	subject('policyScope', () => new PlacePolicyScope($allPlacesScope, $user));

	def('allPlacesScope', () => knex(DB_CONFIG)('Place'));
	def('place', () => ({ id: 1, yHSIId: '116B/03/600' }));
	def('user', () => new User({ firstName: 'marlen' }));

	describe('#resolve', () => {
		context('when building a scope of permited places', () => {
			context('when user is an Administrator', () => {
				def(
					'user',
					() =>
						new User({ firstName: 'marlen', roles: UserRoles.ADMINISTRATOR })
				);

				it('returns a scope permitting all records to be accessed', () => {
					expect($policyScope.resolve().toString()).to.not.include('where');
				});

				context('when user has no valid roles', () => {
					def('user', () => new User({ firstName: 'marlen' }));

					it('returns a scope permitting zero records to be accessed', () => {
						expect($policyScope.resolve().toString()).to.include('where (1=0)');
					});
				});
			});
		});
	});
});
