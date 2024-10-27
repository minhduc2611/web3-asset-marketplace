export function getLang() {
  if (typeof window !== "undefined") {
    if (window.navigator.languages != undefined)
      return window.navigator.languages[0];
    return window.navigator.language;
  }
  return "en";
}
