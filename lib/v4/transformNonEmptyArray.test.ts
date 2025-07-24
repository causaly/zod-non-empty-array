import * as zod from 'zod';

import { transformNonEmptyArray } from './transformNonEmptyArray.ts';
import type * as NonEmptyArray from 'fp-ts/lib/NonEmptyArray.js';

describe('transformNonEmptyArray()', () => {
  test('adds issue to refinement context when array is empty', async () => {
    const addIssue = vi.fn();
    const value: Array<string> = [];
    const ctx: zod.RefinementCtx = {
      value,
      issues: [],
      addIssue,
    };

    transformNonEmptyArray(value, ctx);

    expect(addIssue).toHaveBeenCalledTimes(1);
    expect(addIssue.mock.calls[0][0]).toEqual({
      code: 'custom',
      message: 'Array must not be empty',
      fatal: true,
    });
  });

  test('transforms non-empty array to fp-ts NonEmptyArray type', async () => {
    const addIssue = vi.fn();
    const value = [1, 2, 3];
    const ctx: zod.RefinementCtx = {
      value,
      issues: [],
      addIssue,
    };

    const expected = transformNonEmptyArray(value, ctx);
    expectTypeOf<NonEmptyArray.NonEmptyArray<number>>(expected);

    expect(addIssue).toHaveBeenCalledTimes(0);
  });

  test('works with zod schema', async () => {
    const schema = zod.object({
      id: zod.number().int().positive(),
      title: zod.string(),
      authors: zod.array(zod.string()).transform(transformNonEmptyArray),
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
