export type FetchStory = {
  name: string;
  before?: FetchStory[];
  after?: FetchStory[];
  expect?: Partial<{
    status: number;
    statusText: string;
    headers: Record<string, string>;
  }>;
  url: string;
  init: RequestInit;
};
