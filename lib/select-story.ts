import { FetchStory } from "fetchbook";
import picocolors from "picocolors";
import autocomplete, { Separator } from "inquirer-autocomplete-standalone";
import Fuse from "fuse.js";
import groupBy from "lodash.groupby";

export default function selectStory(
  stories: FetchStory[],
  groupByKey: (story: FetchStory) => string,
) {
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
    source: async (input) => {
      return Object.entries(
        groupBy(
          input ? fuse.search(input).map((result) => result.item) : stories,
          groupByKey,
        ),
      )
        .map(([group, stories]) => [
          new Separator(picocolors.gray(group)),
          ...stories.map((story) => ({
            name: story.name,
            value: story,
            description: `${picocolors.green(story.init.method)} ${story.url}`,
          })),
        ])
        .flat();
    },
  });
}
