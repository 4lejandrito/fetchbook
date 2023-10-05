import { FetchStory } from "../..";

export default {
  name: "Add a post",
  url: "http://localhost:3000/posts/0",
  init: {
    method: "POST",
    headers: {
      "Some-Header": "value",
    },
  },
  expect: {
    status: 404,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  },
} satisfies FetchStory;
