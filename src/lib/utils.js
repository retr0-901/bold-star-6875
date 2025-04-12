export function groupByCategory(diecasts) {
  const categoriesMap = {};

  // Group diecasts by category
  diecasts.forEach((diecast) => {
    if (diecast.category) {
      if (!categoriesMap[diecast.category]) {
        categoriesMap[diecast.category] = [];
      }
      categoriesMap[diecast.category].push(diecast);
    }
  });

  // Convert to sorted array
  return Object.entries(categoriesMap)
    .map(([name, diecasts]) => ({
      name,
      count: diecasts.length,
      diecasts,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Keep the old function for backwards compatibility
export function groupByGenre(books) {
  return groupByCategory(books);
}
