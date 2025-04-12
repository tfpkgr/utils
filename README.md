# @tfpkgr/utils

A collection of small, reusable utility functions to simplify common programming tasks.

## Installation

```bash
npm install @tfpkgr/utils
```

## Usage

### Importing Utilities

You can import individual utilities or the entire package:

```typescript
import {
	generateUniqueId,
	stringifyParams,
	obscure,
	uuidGenerator,
} from '@tfpkgr/utils';
```

### Utilities

#### 1. `generateUniqueId`

Generates a unique identifier string with an optional prefix and suffix.

```typescript
import {generateUniqueId} from '@tfpkgr/utils';

const id = generateUniqueId(16, 'prefix', 'suffix');
console.log(id); // Example: prefix_abc123xyz_suffix
```

#### 2. `stringifyParams`

Converts an object of parameters into a query string or `URLSearchParams` object.

```typescript
import {stringifyParams} from '@tfpkgr/utils';

const params = {name: 'John', age: 30, hobbies: ['reading', 'coding']};
const queryString = stringifyParams(params, {returnType: 'string'});
console.log(queryString); // Output: name=John&age=30&hobbies=reading&hobbies=coding
```

#### 3. `obscure`

A utility for obscuring strings, such as emails and phone numbers.

```typescript
import {obscure} from '@tfpkgr/utils';

const obscuredEmail = obscure.email('example@gmail.com');
console.log(obscuredEmail); // Output: ex******@gmail.com

const obscuredPhone = obscure.phone('+1234567890');
console.log(obscuredPhone); // Output: +12******90
```

#### 4. `uuidGenerator`

Generates a unique identifier string based on the provided prefix, name, and namespace.

```typescript
import {uuidGenerator} from '@tfpkgr/utils';

const uuid = uuidGenerator('name', 'namespace', {
	prefix: 'user',
	separator: '-',
});
console.log(uuid); // Example: user-123e4567-e89b-12d3-a456-426614174000
```

## License

This project is licensed under the MIT License.
