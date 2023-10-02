export type RequestStory = {
  name: string;
  before?: RequestStory[];
  after?: RequestStory[];
  url: string;
  request: RequestInit;
};
