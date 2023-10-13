import { FetchStory } from "fetchbook";

export default {
  name: "Get all posts",
  url: "http://localhost:3000/posts",
  init: {
    method: "GET",
    headers: {
      "Some-Header": "value",
    },
  },
  expect: {
    status: 201,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  },
} satisfies FetchStory;
