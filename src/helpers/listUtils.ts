const listUtils = {
    listToMap<T>(list: T[], key: keyof T): Record<string, T> {
        return list.reduce((map, obj) => {
            const keyValue = obj[key] as string;
            map[keyValue] = obj;
            return map;
        }, {} as Record<string, T>);
    },
};
export default listUtils;
