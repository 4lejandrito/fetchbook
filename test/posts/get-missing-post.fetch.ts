import { FetchStory } from "../..";

export default {
  name: "Get a missing post",
  url: "http://localhost:3000/posts/0",
  init: {
    method: "GET",
  },
  expect: {
    status: 404,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  },
} satisfies FetchStory;
