export const hotKey2String = (keys: (string | string[])[] = []): string => {
  function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function processItem(item: string | string[]) {
    if (typeof item === 'string') {
      return capitalize(item);
    } else if (Array.isArray(item)) {
      return item.map((subItem) => capitalize(subItem)).join('/');
    }
  }

  if (Array.isArray(keys)) {
    return keys.map((item) => processItem(item)).join('+');
  }

  return capitalize(keys);
};

export const hotKey2Array = (keys: (string | string[])[] = []): (string | undefined)[] => {
  function capitalize(str: string): string {
    return str === ' ' ? 'Space' : str.charAt(0).toUpperCase() + str.slice(1);
  }

  function processItem(item: string | string[]) {
    if (typeof item === 'string') {
      return capitalize(item);
    } else if (Array.isArray(item)) {
      return item.map((subItem) => capitalize(subItem)).join(' / ');
    }
  }

  if (Array.isArray(keys)) {
    return keys.map((item) => processItem(item));
  }

  return [capitalize(keys)];
};
