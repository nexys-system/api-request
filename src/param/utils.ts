const isObject = (value: any): boolean =>
  typeof value === "object" && !Array.isArray(value) && value !== null;

export const linearize = (
  obj: any,
  keys: string[] = []
): { key: string; value: any }[] => {
  let list: { key: string; value: any }[] = [];

  Object.entries(obj).map(([key, value]) => {
    const next = [...keys, key];
    if (isObject(value)) {
      const subList = linearize(value, next);
      list = [...list, ...subList];
    } else {
      list.push({ key: next.join("."), value });
    }
  });

  return list;
};

export const deepMerge = (target: any, source: any): any => {
  if (isObject(target) && isObject(source)) {
    Object.entries(source).forEach(([key, sourceValue]) => {
      if (isObject(sourceValue)) {
        if (!target[key]) {
          Object.assign(target, { [key]: {} });
        }

        const next = target[key];
        deepMerge(next, sourceValue);
      } else {
        Object.assign(target, { [key]: sourceValue });
      }
    });
  }

  return target;
};

export const nest = (data: any = null, props: any = []): any => {
  if (data === undefined || data === null) return null;

  if (props.length === 0) {
    // NOTE: handle object => array
    if (!Array.isArray(data)) {
      data = Object.entries(data).map(([key, value]) => ({ key, value }));
    }

    // NOTE: if array empty - return empty object
    if (data.length === 0) return {};

    let nested = {};
    data.forEach(({ key, value }: { key: any; value: any }) => {
      const props = key.split(".");
      const obj = nest(value, props);
      nested = deepMerge(nested, obj);
    });

    return nested;
  } else {
    const value = data;
    const [prop, ...rest] = props;
    if (rest.length === 0) {
      return { [prop]: value };
    }

    const result = nest(value, [...rest]);
    return { [prop]: result };
  }
};

/**
 * checks if object is empty
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
export const isEmpty = (obj: any): boolean => {
  if (Array.isArray(obj)) return false;
  if (!obj) return true;
  for (let key in obj) if (obj.hasOwnProperty(key)) return false;
  return true;
};

export const removeProp = (obj: any, prop: any): any =>
  Object.keys(obj).reduce(
    (acc, key) => (key !== prop ? { ...acc, [key]: obj[key] } : acc),
    {}
  );

export const removeProps = (obj: any, props: any): any => {
  while (props.length > 0) {
    obj = removeProp(obj, props.pop());
  }
  return obj;
};
