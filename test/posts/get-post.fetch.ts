import { FetchStory } from "../..";

export default {
  name: "Get a post",
  url: "http://localhost:3000/posts/1",
  init: {
    method: "GET",
    headers: {
      "Some-Header": "value",
    },
  },
  expect: {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  },
} satisfies FetchStory;
