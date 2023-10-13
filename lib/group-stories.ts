import groupBy from "lodash.groupby";
import spaceCase from "to-space-case";
import titleize from "titleize";
import path from "path";
import { FileFetchStory, isFetchbookFile, packageRoot } from "./find-stories";
import picocolors from "picocolors";

export default function groupStories(stories: FileFetchStory[]) {
  return Object.entries(
    groupBy(stories, (story) =>
      path
        .dirname(
          path.relative(
            isFetchbookFile(story.file) ? packageRoot : process.cwd(),
            story.file,
          ),
        )
        .split(path.sep)
        .map(spaceCase)
        .map(titleize)
        .join(" / "),
    ),
  )
    .map(([group, stories]) => ({
      name: picocolors.gray(group),
      stories,
    }))
    .flat()
    .sort((a, b) => a.name.localeCompare(b.name));
}
