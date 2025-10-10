import { PlaceEdit } from '../../models/place-edit';

describe('PlaceEdit', () => {
	describe('#constructor', () => {
		context('when creating a new PlaceEdit object', () => {
			it('transforms and sets the association columns correctly', () => {
				const placeEdit = new PlaceEdit({
					associations: [
						{ id: 1, placeId: 1543, type: 3, description: 'Field Force' },
					],
				});
				expect(placeEdit).to.deep.include({
					associationJSON:
						'[{"Id":1,"PlaceId":1543,"Type":3,"Description":"Field Force"}]',
				});
			});

			it('builds the db object correctly', () => {
				const placeEdit = new PlaceEdit({
					id: 1,
					placeId: 2,
					yHSIId: '115J/14/007',
					notRealColumn: 'anything',
				});

				expect(placeEdit.toDbObject()).to.deep.equal({
					placeId: 2,
					yHSIId: '115J/14/007',
				});
			});
		});
	});
});
