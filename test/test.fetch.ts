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
    headers: {
      "Some-Header": "value",
    },
  },
  after: [
    {
      name: "Test after",
      url: "http://localhost:3000/posts/2",
      request: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: "value",
        }),
      },
    },
  ],
} satisfies RequestStory;
