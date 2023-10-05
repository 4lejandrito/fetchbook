import { FetchStory } from "../..";
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
  },
  before: [addPostFetch, addPostFetch, addPostFetch],
} satisfies FetchStory;
