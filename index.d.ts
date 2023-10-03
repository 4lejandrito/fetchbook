export type RequestStory = {
  name: string;
  before?: RequestStory[];
  after?: RequestStory[];
  url: string;
  request: Omit<RequestInit, 'headers'> & { headers?: Record<string, string> };
};
