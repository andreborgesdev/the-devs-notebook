export interface HeadingItem {
  id: string;
  level: number;
  text: string;
}

export function generateUniqueHeadingIds(content: string): {
  headingItems: HeadingItem[];
  getHeadingId: (text: string) => string;
  getHeadingIdByIndex: (index: number) => string;
} {
  const headingLines = content
    .split("\n")
    .filter((line) => line.startsWith("#"));

  const headingItems: HeadingItem[] = [];
  const headingIdMap = new Map<string, string>();
  const usedIds = new Set<string>();

  headingLines.forEach((line) => {
    const level = line.match(/^#+/)?.[0].length || 0;
    const text = line.replace(/^#+\s+/, "");
    let baseId = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    let id = baseId;
    let counter = 1;

    while (usedIds.has(id)) {
      id = `${baseId}-${counter}`;
      counter++;
    }

    usedIds.add(id);
    // Only set the first occurrence in the map for backward compatibility
    if (!headingIdMap.has(text)) {
      headingIdMap.set(text, id);
    }
    headingItems.push({ id, level, text });
  });

  const getHeadingId = (text: string) => {
    return (
      headingIdMap.get(text) || text.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    );
  };

  const getHeadingIdByIndex = (index: number) => {
    return headingItems[index]?.id || "";
  };

  return { headingItems, getHeadingId, getHeadingIdByIndex };
}
