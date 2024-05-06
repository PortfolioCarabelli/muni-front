// util to check for empty properties used in axios params
export const paramChecker = (params) => {
  let cleanedParams = {};
  Object.keys(params).forEach((val) => {
    const newVal = params[val];
    cleanedParams =
      newVal !== null && newVal !== '' ? { ...cleanedParams, [val]: newVal } : cleanedParams; //otro valor "nullish" es 0, habria que agregar "newVal === 0"
  });
  return cleanedParams;
};

// Limpia los parametros vacios o null de un objeto con arrays u objetos dentro
export const cleanAndFlatten = (data) => {
  const isNullOrWhiteSpace = (value) => {
    return value === null || (typeof value === 'string' && value.trim() === '');
  };

  const cleanValue = (value) => {
    if (Array.isArray(value)) {
      const cleanedArray = value.map((item) => cleanValue(item)).filter((item) => item !== null);
      return cleanedArray.length > 0 ? cleanedArray : null;
    } else if (typeof value === 'object' && value !== null) {
      const cleanedObj = {};
      for (const key in value) {
        const cleanedKey = cleanValue(key);
        const cleanedItem = cleanValue(value[key]);
        if (cleanedKey !== null && cleanedItem !== null) {
          cleanedObj[cleanedKey] = cleanedItem;
        }
      }
      return Object.keys(cleanedObj).length > 0 ? cleanedObj : null;
    } else {
      return isNullOrWhiteSpace(value) ? null : value;
    }
  };

  return cleanValue(data);
};

export const transformJsonToFormData = (json) => {
  var form_data = new FormData();
  Object.keys(json).forEach((key) => {
    if (typeof json[key] !== 'object') form_data.append(key, json[key]);
    else form_data.append(key, JSON.stringify(json[key]));
  });
  return form_data;
};
