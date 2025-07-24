import * as zod from 'zod';

import { transformNonEmptyArrayOrUndefined } from './transformNonEmptyArrayOrUndefined.ts';
import type * as NonEmptyArray from 'fp-ts/lib/NonEmptyArray.js';

describe('transformNonEmptyArrayOrUndefined()', () => {
  test('transforms empty array to undefined', async () => {
    const value: Array<string> = [];

    const expected = transformNonEmptyArrayOrUndefined(value);
    expect(expected).toBeUndefined();
  });

  test('transforms non-empty array to fp-ts NonEmptyArray type', async () => {
    const value = [1, 2, 3];

    const expected = transformNonEmptyArrayOrUndefined(value);
    expectTypeOf<NonEmptyArray.NonEmptyArray<number> | undefined>(expected);
  });

  test('works with zod schema', async () => {
    const schema = zod.object({
      id: zod.number().int().positive(),
      title: zod.string(),
      authors: zod
        .array(zod.string())
        .transform(transformNonEmptyArrayOrUndefined),
    });

    type Article = zod.infer<typeof schema>;

    const input = {
      id: 1,
      title: 'A case-study of the use of fp-ts in a real-world project',
      authors: ['John Doe', 'Jane Doe'],
    };
    const expected = schema.parse(input);

    expectTypeOf<Article>(expected);
    expect(expected).toEqual(input);
  });
});
