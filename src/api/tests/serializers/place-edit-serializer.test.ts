import { PlaceEdit } from '../../models/place-edit';
import PlaceEditSerializer from '../../serializers/place-edit-serializer';

describe('PlaceEditSerializer', () => {
	describe('#extractAssociations', () => {
		context('when creating a new PlaceEditSerializer object', () => {
			it('transforms and sets the association columns correctly', () => {
				const placeEdit = new PlaceEdit({
					associations: [
						{ id: 1, placeId: 1543, type: 3, description: 'Field Force' },
					],
				});
				const placeEditSerializer = new PlaceEditSerializer(placeEdit);
				expect(
					placeEditSerializer.extractAssociations({
						associations: 'associationJSON',
					})
				).to.deep.include({
					associations: [
						{ id: 1, placeId: 1543, type: 3, description: 'Field Force' },
					],
				});
			});
		});
	});

	describe('#tableView', () => {
		context('when generating a view of data for display in a table', () => {
			it('builds the view correctly', () => {
				const placeEdit = new PlaceEdit({
					id: 1,
					placeId: 2,
					yHSIId: '115J/14/007',
					editorEmail: 'mbrunner@proofgov.com',
				});
				const placeEditSerializer = new PlaceEditSerializer(placeEdit);
				expect(placeEditSerializer.tableView()).to.deep.equal({
					id: 1,
					placeId: 2,
					yHSIId: '115J/14/007',
					editorEmail: 'mbrunner@proofgov.com',
				});
			});
		});
	});
});
