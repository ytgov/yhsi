import { User, UserRoles, UserSiteAccess, SiteAccesType } from '../../models';
import { PlacePolicy } from '../../policies';

describe('PlacePolicy', () => {
	subject('policy', () => new PlacePolicy($user, $place));

	def('place', () => ({ id: 1, yHSIId: '116B/03/600' }));
	def('user', () => new User({ firstName: 'marlen' }));

	describe('#show', () => {
		context('when checking whether a user is allowed to see a record', () => {
			context('when user is an Administrator', () => {
				def(
					'user',
					() =>
						new User({ firstName: 'marlen', roles: UserRoles.ADMINISTRATOR })
				);

				it('permits access', () => {
					expect($policy.show()).to.be.true;
				});
			});

			context('when user has a site access role', () => {
				def(
					'user',
					() =>
						new User({
							firstName: 'marlen',
							roles: $roles,
							siteAccess: $siteAccess,
						})
				);
				def('siteAccess', () => []);
				def('roles', () =>
					faker.random
						.arrayElements([
							UserRoles.SITE_ADMIN,
							UserRoles.SITE_EDITOR,
							UserRoles.SITE_VIEWER,
						])
						.join(',')
				);

				context('when user has no specific access', () => {
					def('user', () => new User({ firstName: 'marlen', roles: $roles }));
					def('place', () => ({ id: 1, yHSIId: '116B/03/600' }));

					it('does not permits access', () => {
						expect($policy.show()).to.be.false;
					});
				});

				context('when user has specific access via a NTS Map Sheet', () => {
					def('nTSMapSheet', () => '115O/03');
					def('siteAccess', () => [
						new UserSiteAccess({
							accessTypeId: SiteAccesType.MAP_SHEET,
							accessText: $nTSMapSheet,
						}),
					]);
					def('place', () => ({
						id: 1,
						yHSIId: '116B/03/600',
						nTSMapSheet: $nTSMapSheet,
					}));

					it('permits access', () => {
						expect($policy.show()).to.be.true;
					});
				});

				context('when user has specific access via a community Id', () => {
					def('communityId', () =>
						faker.datatype.number({ min: 1, max: 1000 })
					);
					def('siteAccess', () => [
						new UserSiteAccess({
							accessTypeId: SiteAccesType.COMMUNITY,
							accessText: $communityId,
						}),
					]);
					def(
						'user',
						() =>
							new User({
								firstName: 'marlen',
								roles: $roles,
								siteAccess: $siteAccess,
							})
					);
					def('place', () => ({
						id: 1,
						yHSIId: '116B/03/600',
						communityId: $communityId,
					}));

					it('permits access', () => {
						expect($policy.show()).to.be.true;
					});
				});

				context('when user has specific access via a first nations Id', () => {
					def('placeId', () => faker.datatype.number({ min: 1, max: 1000 }));
					def('firstNation', () => ({
						id: faker.datatype.number({ min: 1, max: 1000 }),
						name: 'Liard First Nation',
					}));
					def('firstNationAssociation', () => ({
						id: faker.datatype.number({ min: 1, max: 1000 }),
						placeId: $placeId,
						firstNationId: $firstNation.id,
					}));
					def('siteAccess', () => [
						new UserSiteAccess({
							accessTypeId: SiteAccesType.FIRST_NATION,
							accessText: $firstNation.id,
						}),
					]);
					def(
						'user',
						() =>
							new User({
								firstName: 'marlen',
								roles: $roles,
								siteAccess: $siteAccess,
							})
					);
					def('place', () => ({
						id: $placeId,
						yHSIId: '116B/03/600',
						firstNationAssociations: [$firstNationAssociation],
					}));

					it('permits access', () => {
						expect($policy.show()).to.be.true;
					});
				});
			});

			context('when user has no valid roles', () => {
				def('user', () => new User({ firstName: 'marlen' }));

				it('does not permits access', () => {
					expect($policy.show()).to.be.false;
				});
			});
		});
	});
});
