import { RequestStory } from "..";

export default {
  name: "Test",
  url: "http://localhost:3000/posts",
  request: {
    method: "GET",
  },
} satisfies RequestStory;
