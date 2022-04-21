import { User, UserRoles } from '../../models';
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

			context('when user has no valid roles', () => {
				def('user', () => new User({ firstName: 'marlen' }));

				it('does not permits access', () => {
					expect($policy.show()).to.be.false;
				});
			});
		});
	});
});
