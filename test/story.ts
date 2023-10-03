import { RequestStory } from "..";

export default {
  name: "Test",
  before: [
    {
      name: "Test before",
      url: "http://localhost:3000/posts/1",
      request: {
        method: "GET",
      },
    },
  ],
  url: "http://localhost:3000/posts",
  request: {
    method: "GET",
  },
  after: [
    {
      name: "Test after",
      url: "http://localhost:3000/posts/2",
      request: {
        method: "GET",
      },
    },
  ],
} satisfies RequestStory;
