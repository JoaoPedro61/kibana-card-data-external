export function isValid(target: string): boolean {
  if (`string` !== typeof target) {
    return false;
  } else {
    const value = target.trim();
    if (!value.length) {
      return false;
    } else {
      if (!/^http\:\/\/|^https\:\/\//gm.test(value)) {
        return false;
      } else {
        if (value === `http://` || value === `https://`) {
          return false;
        }
      }
    }
  }
  return true;
}
