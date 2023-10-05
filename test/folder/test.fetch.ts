import { FetchStory } from "../..";

export default {
  name: "Test 2",
  url: "http://localhost:3000/posts/0",
  init: {
    method: "POST",
    headers: {
      "Some-Header": "value",
    },
  },
} satisfies FetchStory;
