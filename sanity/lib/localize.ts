export function localizeSanityData(data: any, locale: string): any {
    if (data === null || data === undefined) return data
  
    if (Array.isArray(data)) {
      return data.map(item => localizeSanityData(item, locale))
    }
  
    if (typeof data === 'object') {
      const result: any = {}
      for (const key in data) {
        if (key.endsWith('_ar')) continue // Skip _ar keys directly
  
        if (
          locale === 'ar' &&
          data[`${key}_ar`] !== undefined &&
          data[`${key}_ar`] !== null &&
          data[`${key}_ar`] !== ''
        ) {
          result[key] = localizeSanityData(data[`${key}_ar`], locale)
        } else {
          result[key] = localizeSanityData(data[key], locale)
        }
      }
      return result
    }
  
    return data
  }
