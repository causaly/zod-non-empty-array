import * as zod from 'zod';

import { transformReadonlyNonEmptyArray } from './transformReadonlyNonEmptyArray.ts';
import type * as ReadonlyNonEmptyArray from 'fp-ts/lib/ReadonlyNonEmptyArray.js';

describe('transformReadonlyNonEmptyArray()', () => {
  test('adds issue to refinement context when array is empty', async () => {
    const addIssue = vi.fn();
    const value: Array<string> = [];
    const ctx: zod.RefinementCtx = {
      value,
      issues: [],
      addIssue,
    };

    transformReadonlyNonEmptyArray(value, ctx);

    expect(addIssue).toHaveBeenCalledTimes(1);
    expect(addIssue.mock.calls[0][0]).toEqual({
      code: 'custom',
      message: 'Array must not be empty',
      fatal: true,
    });
  });

  test('transforms non-empty array to fp-ts ReadonlyNonEmptyArray type', async () => {
    const addIssue = vi.fn();
    const value = [1, 2, 3];
    const ctx: zod.RefinementCtx = {
      value,
      issues: [],
      addIssue,
    };

    const expected = transformReadonlyNonEmptyArray([1, 2, 3], ctx);
    expectTypeOf<ReadonlyNonEmptyArray.ReadonlyNonEmptyArray<number>>(expected);

    expect(addIssue).toHaveBeenCalledTimes(0);
  });

  test('works with zod schema', async () => {
    const schema = zod.object({
      id: zod.number().int().positive(),
      title: zod.string(),
      authors: zod
        .array(zod.string())
        .transform(transformReadonlyNonEmptyArray),
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
