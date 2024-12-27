export const definePropertiesOnObject = (o: unknown, properties: { [key: string]: unknown } | ThisType<unknown>) => {
    const entries = Object.entries(properties).map(([key, value]) => [key, { value }])
    Object.defineProperties(o, Object.fromEntries(entries));
}