import { Place } from '../../models/place';

describe('Place', () => {
	describe('.encodeCommaDelimitedArray', () => {
		context('when encoding a comma delimited array', () => {
			[
				[['a', 'b', 'c'], 'a,b,c'],
				[[], null],
				['', null],
				['abc', 'abc'],
				[undefined, null],
			].forEach(([input, output]) => {
				it(`encodes ${JSON.stringify(input)} as "${output}"`, () => {
					expect(Place.encodeCommaDelimitedArray(input)).to.eq(output);
				});
			});
		});
	});

	describe('.encodeCommaDelimitedArrayColumns', () => {
		context('when encoding all comma delimited array columns', () => {
			[
				[{}, {}],
				[
					{ contributingResources: ['a', 'b'] },
					{ contributingResources: 'a,b' },
				],
				[{ designations: [] }, { designations: null }],
				[{ records: null }, { records: null }],
			].forEach(([input, output]) => {
				it(`encodes ${JSON.stringify(input)} as "${JSON.stringify(
					output
				)}"`, () => {
					expect(Place.encodeCommaDelimitedArrayColumns(input)).to.deep.eq(
						output
					);
				});
			});
		});
	});
});
