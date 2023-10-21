import { FetchStory } from "fetchbook";

export default {
  name: "Venusaur",
  url: "https://pokeapi.co/api/v2/pokemon/venusaur",
  init: {
    method: "GET",
  },
  expect: {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
    },
    body: {
      order: 3,
      name: "venusaur",
      height: 20,
      weight: 1000,
    },
  },
} satisfies FetchStory;
