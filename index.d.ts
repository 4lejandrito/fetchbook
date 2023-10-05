import { Expect } from "expect";

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

export const expect: Expect;
