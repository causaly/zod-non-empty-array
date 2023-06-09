import * as NonEmptyArray from 'fp-ts/NonEmptyArray';
import { expectType } from 'ts-expect';
import * as zod from 'zod';

import { transformNonEmptyArray } from './transformNonEmptyArray';

describe('transformNonEmptyArray()', () => {
  test('adds issue to refinement context when array is empty', async () => {
    const addIssue = jest.fn();
    const ctx: zod.RefinementCtx = {
      addIssue,
      path: [''],
    };

    transformNonEmptyArray([], ctx);

    expect(addIssue).toHaveBeenCalledTimes(1);
    expect(addIssue.mock.calls[0][0]).toEqual({
      code: zod.ZodIssueCode.custom,
      message: 'Array must not be empty',
      fatal: true,
    });
  });

  test('transforms non-empty array to fp-ts NonEmptyArray type', async () => {
    const addIssue = jest.fn();
    const ctx: zod.RefinementCtx = {
      addIssue,
      path: [''],
    };

    const expected = transformNonEmptyArray([1, 2, 3], ctx);
    expectType<NonEmptyArray.NonEmptyArray<number>>(expected);

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

    expectType<Article>(expected);
    expect(expected).toEqual(input);
  });
});
