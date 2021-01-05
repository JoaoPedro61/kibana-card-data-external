export function isAColor(target: any, defaultValue: string): string {
  if (target === 'inherit') {
    return target;
  }
  if (target) {
    if (/^#[a-zA-Z0-9]{6}|rgb\((?:\s*\d+\s*,){2}\s*[\d]+\)|rgba\((\s*\d+\s*,){3}[\d\.]+\)|hsl\(\s*\d+\s*(\s*\,\s*\d+\%){2}\)|hsla\(\s*\d+(\s*,\s*\d+\s*\%){2}\s*\,\s*[\d\.]+\)$/gm.test(target)) {
      return target;
    }
  }
  return defaultValue;
}
