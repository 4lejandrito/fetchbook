export type FetchStory = {
  name: string;
  url: string;
  init: RequestInit;
  expect?: Partial<{
    status: number;
    statusText: string;
    headers: Record<string, string>;
  }>;
  before?: FetchStory[];
  after?: FetchStory[];
};
