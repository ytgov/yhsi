import { DB_CONFIG } from '../../config';
import { PlaceService } from '../../services/place-service';

// This test should be run with care as it mutates the database.
// It can be enabled when someone has time to spin up a test database.
describe.skip('PlaceService', () => {
	const placeService = new PlaceService(DB_CONFIG);

	describe('#update', () => {
		context('when updating a place', () => {
			it('encodes the arrays before saving', (done) => {
				placeService
					.update(1, { communityId: 1 })
					.then((place) => {
						expect(place).to.include({ communityId: 1 });
					})
					.then(done)
					.catch(done);
			});
		});
	});
});
