import { FetchStory } from "fetchbook";

export default {
  name: "Add a post",
  url: "http://localhost:3000/posts",
  init: {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      it: "works!",
    }),
  },
  expect: {
    status: 201,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
  },
} satisfies FetchStory;
