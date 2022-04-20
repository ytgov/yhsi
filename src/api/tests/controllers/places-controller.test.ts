import reqresnext from 'reqresnext';

import { PlaceService } from '../../services/place-service';

describe('placesController', () => {
	def('user', () => ({ firstName: 'marlen' }));
	def('place', () => ({ id: 1, yHSIId: '116B/03/600' }));
	def('PlaceServiceMock', () => td.constructor(PlaceService));

	beforeEach(() => {
		const ServicesMock = td.replace('../../services', {
			PlaceService: $PlaceServiceMock,
		});
		td.when($PlaceServiceMock.prototype.getById($place.id, $user)).thenResolve({
			place: $place,
		});
	});

	afterEach(() => {
		td.reset();
	});

	describe('#getPlace', () => {
		context('when getting a Place by id', () => {
			context('when user is authorized', () => {
				it('returns a place object', async () => {
					const placesController = require('../../controllers/places-controller');

					const { req, res } = reqresnext({
						params: { id: $place.id },
						user: $user,
					});

					await placesController.getPlace(req, res);
					return expect(res.statusCode).to.eq(200);
				});
			});

			context('when user is not authorized', () => {
				it('returns a 403', () => {
					//
				});
			});
		});
	});
});
