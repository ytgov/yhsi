import reqresnext from 'reqresnext';

import { User, UserRoles } from '../../models';
import { PlaceService } from '../../services';

describe('placesController', () => {
	def('user', () => new User({ firstName: 'marlen' }));
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
				def(
					'user',
					() =>
						new User({ firstName: 'marlen', roles: UserRoles.ADMINISTRATOR })
				);

				it('returns a place object', () => {
					const placesController = require('../../controllers/places-controller');

					const { req, res } = reqresnext({
						params: { id: $place.id },
						user: $user,
					});

					return placesController.getPlace(req, res).then(() => {
						return expect(res.statusCode).to.eq(200);
					});
				});
			});

			context('when user is not authorized', () => {
				def(
					'user',
					() => new User({ firstName: 'marlen', roles: 'NonSiteAccessRole' })
				);

				it('returns a 403', () => {
					const placesController = require('../../controllers/places-controller');

					const { req, res } = reqresnext({
						params: { id: $place.id },
						user: $user,
					});

					return placesController.getPlace(req, res).then(() => {
						return expect(res.statusCode).to.eq(403);
					});
				});
			});
		});
	});
});
