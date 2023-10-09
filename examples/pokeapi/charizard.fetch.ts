import { FetchStory } from "fetchbook";

const story: FetchStory = {
  name: "Charizard",
  url: "https://pokeapi.co/api/v2/pokemon/charizard",
  init: {
    method: "GET",
  },
  expect: {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: {
      order: 7,
      name: "charizard",
      height: 17,
      weight: 905,
    },
  },
};

export default story;
