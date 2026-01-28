export function extractQueryParams(source: string): any {
  try {
    let queryParams = {};

    // Extract from URL string
    const url = new URL(source);
    url.searchParams.forEach((value, key) => {
      // Handle multiple values for the same key
      if (queryParams[key]) {
        if (Array.isArray(queryParams[key])) {
          queryParams[key].push(value);
        } else {
          queryParams[key] = [queryParams[key], value];
        }
      } else {
        queryParams[key] = value;
      }
    });
    if (Object.keys(queryParams).length === 0) {
      return null;
    }
    return queryParams;
  } catch (error) {
    console.log('Failed to parse query params from ULR. But dont worry everything is fine 🔥👩‍💻🔥');
    return null;
  }
}
