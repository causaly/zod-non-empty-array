import * as NonEmptyArray from 'fp-ts/lib/NonEmptyArray.js';
import * as Option from 'fp-ts/lib/Option.js';
import { pipe, identity } from 'fp-ts/lib/function.js';
import * as zod from 'zod';

export function transformNonEmptyArray<T>(
  arr: Array<T>,
  ctx: zod.RefinementCtx
): NonEmptyArray.NonEmptyArray<T> {
  return pipe(
    arr,
    NonEmptyArray.fromArray,
    Option.match(() => {
      ctx.addIssue({
        code: 'custom',
        message: 'Array must not be empty',
        fatal: true,
      });

      return zod.NEVER;
    }, identity)
  );
}
