export type FetchStory = {
  name: string;
  before?: FetchStory[];
  after?: FetchStory[];
  url: string;
  request: RequestInit;
};
