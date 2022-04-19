import { PlaceEdit } from '../../models/place-edit';
import PlaceEditSerializer from '../../serializers/place-edit-serializer';

describe('PlaceEditSerializer', () => {
	describe('#detailedView', () => {
		context('when extracting associations', () => {
			it('transforms and sets the association column correctly', () => {
				const placeEdit = new PlaceEdit({
					associations: [
						{ id: 1, placeId: 1543, type: 3, description: 'Field Force' },
					],
				});
				const placeEditSerializer = new PlaceEditSerializer(placeEdit);
				expect(placeEditSerializer.detailedView()).to.deep.eq({
					associations: [
						{ id: 1, placeId: 1543, type: 3, description: 'Field Force' },
					],
				});
			});
		});

		context('when extracting comma delimited array fields', () => {
			it('transforms and sets the contributingResources column correctly', () => {
				const placeEdit = new PlaceEdit({
					contributingResources: ['Archaeological', 'Building', 'Collection'],
				});
				const placeEditSerializer = new PlaceEditSerializer(placeEdit);
				expect(placeEditSerializer.detailedView()).to.deep.eq({
					contributingResources: ['Archaeological', 'Building', 'Collection'],
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
