import { RequestStory } from "..";

export default {
  name: "Test",
  url: "test",
  request: {
    method: "POST",
    body: JSON.stringify({
      it: "works!",
    }),
  },
} satisfies RequestStory;
