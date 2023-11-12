export function arrayOfKeysToObject<MapperType>(array: string[], mapper: (key: string) => MapperType): Record<string, MapperType> {
  return array.reduce((result: Record<string, MapperType>, key) => {
    result[key] = mapper(key)

    return result
  }, {})
}
