import { FetchStory } from "fetchbook";

const story: FetchStory = {
  name: "Blastoise",
  url: "https://pokeapi.co/api/v2/pokemon/blastoise",
  init: {
    method: "GET",
  },
  expect: {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: {
      order: 12,
      name: "blastoise",
      height: 16,
      weight: 855,
    },
  },
};

export default story;
