import picocolors from "picocolors";
import autocomplete, { Separator } from "inquirer-autocomplete-standalone";
import Fuse from "fuse.js";
import groupStories from "./group-stories";
import { FileFetchStory } from "./find-stories";

export default function selectStory(stories: FileFetchStory[]) {
  const fuse = new Fuse(stories, {
    keys: [
      {
        name: "title",
        getFn: (story) => story.name,
      },
    ],
  });
  return autocomplete({
    message: "Select a fetch story",
    source: async (input) =>
      groupStories(
        input ? fuse.search(input).map((result) => result.item) : stories,
      )
        .map(({ name, stories }) => [
          new Separator(name),
          ...stories.map((story) => ({
            name: story.name,
            value: story,
            description: `${picocolors.green(story.init.method)} ${story.url}`,
          })),
        ])
        .flat(),
  });
}
