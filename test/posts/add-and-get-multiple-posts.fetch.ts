import { FetchStory, expect } from "../..";
import addPostFetch from "./add-post.fetch";

export default {
  name: "Add and get several posts",
  url: "http://localhost:3000/posts",
  init: {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  },
  expect: {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: expect.arrayContaining([
      {
        id: 1,
        it: "works!",
      },
      {
        id: 2,
        it: "works!",
      },
      {
        id: 3,
        it: "works!",
      },
      {
        id: 4,
        it: "works!",
      },
    ]),
  },
  before: [addPostFetch, addPostFetch, addPostFetch],
} satisfies FetchStory;
