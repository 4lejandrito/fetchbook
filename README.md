# Fetchbook [![npm version](https://img.shields.io/npm/v/fetchbook.svg?style=flat)](https://www.npmjs.com/package/fetchbook)

Fetchbook is a command-line tool designed to help you manage your collections of HTTP requests. It is based on the standard [RequestInit](https://fetch.spec.whatwg.org/#requestinit) object, and runs in TypeScript with [bun.sh](https://bun.sh/).

You can try it out just by running this command:

```bash
npx fetchbook --demo -v
```

> [!WARNING]
> :construction_worker_woman: Fetchbook is currently under active development, expect breaking changes.

## Installation

To use Fetchbook in you own projects, you can install it like this:

```bash
npm install fetchbook
```

## Usage

Fetchbook allows you to run and test multiple [fetch story files](#fetch-story-files). Here's the basic usage:

```bash
fetchbook [story] [options]
```

### Arguments

- `[story]` (optional): Path to a [fetch story file](#fetch-story-files) (or folder) that describes an HTTP request. If omitted, Fetchbook will prompt you to search and choose a fetch story in the current folder.

### Options

- `-a, --all`: Process all TypeScript story files in the current folder recursively.
- `-v, --verbose`: Enable verbose output, providing additional information about the request and response.
- `-d, --dry-run`: Perform a dry run, simulating the request without making an actual HTTP call.
- `-c, --curl`: Convert the request to a cURL command and display it in the terminal instead of making the HTTP request.

### Examples

1. Run a single TypeScript story file:

   ```bash
   fetchbook path/to/your/story.fetch.ts
   ```

2. Run all TypeScript story files in the current folder and its subfolders:

   ```bash
   fetchbook -a
   ```

3. Convert a request to a cURL command:

   ```bash
   fetchbook path/to/your/story.fetch.ts -c
   ```

4. Perform a dry run of a request:

   ```bash
   fetchbook path/to/your/story.fetch.ts -d
   ```

5. Run a request with verbose output:

   ```bash
   fetchbook path/to/your/story.fetch.ts -v
   ```

## Fetch Story Files

Fetch story files are TypeScript modules ending with `.fetch.ts` that must comply with the following type definition:

```typescript
type FetchStory = {
  name: string;
  url: string;
  init: RequestInit;
  expect?: Partial<{
    status: number;
    statusText: string;
    headers: Record<string, string>;
    body: any;
  }>;
  before?: FetchStory[];
  after?: FetchStory[];
};
```

Here's an explanation of each property within the `FetchStory` type definition:

- `name` (string): A descriptive name for the story, helping you identify and organize your requests.
- `url` (string): The URL of the HTTP request.
- `init` ([RequestInit](https://fetch.spec.whatwg.org/#requestinit)): An object containing the request's initialization options, including method, headers, and body.
- `expect` (optional): Defines your expectations for the response, such as expected HTTP status code, status text, headers and body.
- `before` (optional): An array of `FetchStory` objects representing requests to execute before the main request.
- `after` (optional): An array of `FetchStory` objects representing requests to execute after the main request.

### Example Fetch Story File

Here's an example of a Fetchbook fetch story file adhering to the TypeScript definition and the naming convention (ending with `.fetch.ts`):

```typescript
// examples/venusaur.fetch.ts
import { FetchStory } from "fetchbook";

const story: FetchStory = {
  name: "Get info about Venusaur",
  url: "https://pokeapi.co/api/v2/pokemon/venusaur",
  init: {
    method: "GET",
  },
  expect: {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: {
      order: 3,
      name: "venusaur",
      height: 20,
      weight: 1000,
    },
  },
};

export default story;
```

Ensure that your story files adhere to this structure, type definition, and the naming convention (`.fetch.ts`) to work seamlessly with Fetchbook. You can create multiple TypeScript story files to describe different HTTP requests and use Fetchbook to manage and execute them as needed.

## License

Fetchbook is licensed under the MIT License. Feel free to use and modify it according to your needs.

---

Enjoy using Fetchbook for efficient HTTP request management! If you encounter any issues or have suggestions for improvement, please don't hesitate to [open an issue](https://github.com/4lejandrito/fetchbook/issues/new) or contribute to the project.