import { identity, pipe } from 'fp-ts/lib/function';
import * as Option from 'fp-ts/Option';
import * as ReadonlyNonEmptyArray from 'fp-ts/ReadonlyNonEmptyArray';
import * as zod from 'zod';

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
