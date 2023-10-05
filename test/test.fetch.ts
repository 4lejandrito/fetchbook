import { FetchStory } from "..";

export default {
  name: "Test",
  before: [
    {
      name: "Test before",
      url: "http://localhost:3000/posts/1",
      init: {
        method: "GET",
      },
    },
  ],
  url: "http://localhost:3000/posts",
  init: {
    method: "GET",
    headers: {
      "Some-Header": "value",
    },
  },
  after: [
    {
      name: "Test after",
      url: "http://localhost:3000/posts/2",
      init: {
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
} satisfies FetchStory;
