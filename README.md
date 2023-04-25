# zod-non-empty-array

Make zod compatible with fp-ts non-empty constructs.

[![Build Status](https://github.com/causaly/zod-non-empty-array/actions/workflows/ci.yml/badge.svg)](https://github.com/causaly/zod-non-empty-array/actions/workflows/ci.yml) [![npm version](https://img.shields.io/npm/v/zod-non-empty-array.svg?color=0c0)](https://www.npmjs.com/package/zod-non-empty-array)

## Installation

```bash
npm install zod-non-empty-array
```

#### Requirements

- Node.js v.16+

## Quick start

```typescript
import { z as zod } from 'zod';
import { identity } from 'fp-ts/lib/function';
import * as NonEmptyArray from 'fp-ts/NonEmptyArray';
import { transformNonEmptyArray } from 'zod-non-empty-array';

// create zod schema
const schema = zod.object({
  id: zod.number().int().positive(),
  title: zod.string(),
  authors: zod
    .array(zod.string())
    // must have at least one author
    .transform(transformNonEmptyArray),
});

type Article = zod.infer<typeof schema>;

// parse some invalid value
const article = schema.parse({
  id: 1,
  title: 'A case-study of the use of fp-ts in a real-world project',
  authors: ['John Doe', 'Jane Doe'],
});

// article.authors is now compatible with fp-ts
const principalAuthor = pipe(article.authors, NonEmptyArray.head);
```

## Motivation

Zod already supports [non-empty array validation](https://zod.dev/?id=nonempty). However, the generated type is incompatible with [fp-ts](https://gcanti.github.io/fp-ts/).

Specifically, fp-ts defines `NonEmptyArray` as follows...

```typescript
interface NonEmptyArray<T> extends Array<T> {
  0: T;
}
```

While, zod defines `NonEmptyArray` as follows...

```typescript
type ZodNonEmptyArray<T> = [T, ...T[]];
```

This incompatibility makes it difficult to integrate zod with fp-ts.

The `zod-non-empty-array` library addresses the incompatibility issue by exposing zod transformers that return fp-ts constructs. Instead of `zod.array(...).nonempty()` use `zod.array(...).transform(transformNonEmptyArray)`.

## API

- transformNonEmptyArray
- transformReadonlyNonEmptyArray

## Contribute

Source code contributions are most welcome. Please open a PR, ensure the linter is satisfied and all tests pass.

#### We are hiring

Causaly is building the world's largest biomedical knowledge platform, using technologies such as TypeScript, React and Node.js. Find out more about our openings at https://apply.workable.com/causaly/.

## License

MIT
