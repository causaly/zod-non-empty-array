import { identity, pipe } from 'fp-ts/lib/function';
import * as NonEmptyArray from 'fp-ts/NonEmptyArray';
import * as Option from 'fp-ts/Option';
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
        code: zod.ZodIssueCode.custom,
        message: 'Array must not be empty',
        fatal: true,
      });

      return zod.NEVER;
    }, identity)
  );
}
