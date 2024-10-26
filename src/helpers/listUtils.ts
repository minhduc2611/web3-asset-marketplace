export function listToMap<T>(list: T[], key: keyof T): Record<string, T> {
  return list.reduce((map, obj) => {
    const keyValue = obj[key] as string;
    map[keyValue] = obj;
    return map;
  }, {} as Record<string, T>);
}
export function size(collection: any): number {
  if (Array.isArray(collection) || typeof collection === "string") {
    return collection.length;
  } else if (collection instanceof Map || collection instanceof Set) {
    return collection.size;
  } else if (typeof collection === "object" && collection !== null) {
    return Object.keys(collection).length;
  }
  return 0;
}
