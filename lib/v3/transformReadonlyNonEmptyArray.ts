import { identity, pipe } from 'fp-ts/lib/function.js';
import * as Option from 'fp-ts/lib/Option.js';
import * as ReadonlyNonEmptyArray from 'fp-ts/lib/ReadonlyNonEmptyArray.js';
import * as zod from 'zod/v3';

export function transformReadonlyNonEmptyArray<T>(
  arr: ReadonlyArray<T>,
  ctx: zod.RefinementCtx
): ReadonlyNonEmptyArray.ReadonlyNonEmptyArray<T> {
  return pipe(
    arr,
    ReadonlyNonEmptyArray.fromReadonlyArray,
    Option.match(() => {
      ctx.addIssue({
        code: zod.ZodIssueCode.custom,
        message: 'Array must not be empty',
        fatal: true,
      });

      return zod.NEVER;
    }, identity)
  );
}
