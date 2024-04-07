import { useLocalStorage } from "usehooks-ts";

export enum Theme {
  light = "light",
  dark = "dark",
}
const useTheme = () => {
  const [value, setValue] = useLocalStorage("mk-theme-key", Theme.dark);
  const setTheme = (theme: Theme) => {
    document.documentElement.classList.add(theme);
    document.documentElement.setAttribute("data-theme", theme);
    setValue(theme);
  };
  const toggleMode = () => {
    setTheme(value === Theme.light ? Theme.dark : Theme.light);
  };
  return {
    theme: value,
    setTheme,
    toggleMode,
  };
};

export default useTheme;
