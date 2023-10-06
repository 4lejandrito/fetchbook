# Fetchbook

Fetchbook is a versatile command-line tool designed to help you manage your HTTP requests effectively. This README provides an overview of the Fetchbook CLI and the structure of the TypeScript story files it uses.

## Installation

To use Fetchbook, you need to install it globally on your system. Run the following command to install it:

```bash
npm install -g fetchbook
```

## Usage

The Fetchbook CLI allows you to make HTTP requests, process multiple TypeScript story files, and generate cURL commands for your requests. Here's the basic usage:

```bash
fetchbook [story] [options]
```

### Arguments

- `[story]` (optional): Path to a TypeScript story file (ending with `.fetch.ts`) that describes an HTTP request. If omitted, Fetchbook will attempt to process all story files in the current folder recursively when using the `-a` option.

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

Story files are TypeScript modules that must comply with the following TypeScript definition:

```typescript
export type FetchStory = {
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

Here's an example of a Fetchbook TypeScript story file adhering to the TypeScript definition and the naming convention (ending with `.fetch.ts`):

```typescript
// ExampleStory.fetch.ts (TypeScript module)
import { FetchStory } from "fetchbook";

const story: FetchStory = {
  name: "Fetch Data",
  url: "https://api.example.com/data",
  init: {
    method: "GET",
    headers: {
      Authorization: "Bearer YOUR_ACCESS_TOKEN",
      "Content-Type": "application/json",
    },
  },
  expect: {
    status: 200,
    headers: {
      "Content-Type": "application/json",
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
