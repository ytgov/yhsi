import { camelCase } from 'lodash';

import { mapKeysDeep, pascalCase } from '../../utils/lodash-extensions';

describe('mapKeysDeep', () => {
  it('does not transform simple values', () => {
    expect(mapKeysDeep('PlaceId'), camelCase).to.eq('PlaceId');
  });

  it('does not transform simple arrays', () => {
    expect(mapKeysDeep(['PlaceId', 'Description'], camelCase)).to.deep.eq([
      'PlaceId',
      'Description',
    ]);
  });

  it('transforms the keys of simple objects', () => {
    expect(
      mapKeysDeep(
        {
          Id: -1,
          PlaceId: 4546,
          Description: 'AISHIHIK RIVER ',
        },
        camelCase
      )
    ).to.deep.eq({
      id: -1,
      placeId: 4546,
      description: 'AISHIHIK RIVER ',
    });
  });

  it('transforms the keys complex objects', () => {
    expect(
      mapKeysDeep(
        [
          {
            Id: -1,
            PlaceId: 4546,
            Description: 'AISHIHIK RIVER ',
          },
        ],
        camelCase
      )
    ).to.deep.eq([
      {
        id: -1,
        placeId: 4546,
        description: 'AISHIHIK RIVER ',
      },
    ]);
  });
});

describe('pascalCase', () => {
  context('converts a string to pascal case', () => {
    [
      ['Foo Bar', 'FooBar'],
      ['--foo-bar--', 'FooBar'],
      ['__FOO_BAR__', 'FooBar'],
    ].forEach(([input, output]) => {
      it(`transforms ${input} to ${output}`, () => {
        expect(pascalCase(input)).to.eq(output);
      });
    });
  });
});
