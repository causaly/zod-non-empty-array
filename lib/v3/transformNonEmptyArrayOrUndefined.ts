import * as NonEmptyArray from 'fp-ts/lib/NonEmptyArray.js';
import * as Option from 'fp-ts/lib/Option.js';
import { pipe, identity, constUndefined } from 'fp-ts/lib/function.js';

export function transformNonEmptyArrayOrUndefined<T>(
  arr: Array<T>
): NonEmptyArray.NonEmptyArray<T> | undefined {
  return pipe(
    arr,
    NonEmptyArray.fromArray,
    Option.match(constUndefined, identity)
  );
}
