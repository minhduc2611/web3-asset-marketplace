import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Icons } from "../icons";

enum Theme {
  light = "light",
  dark = "dark",
}
const ThemeSelector = () => {
  const [value, setValue] = useLocalStorage("mk-theme-key", Theme.dark);
  const setTheme = (theme: Theme) => {
    document.documentElement.classList.add(theme);
    document.documentElement.setAttribute("data-theme", theme);
    setValue(theme);
  };
  const toggleDarkmode = () => {
    setTheme(value === Theme.light ? Theme.dark : Theme.light);
  };
  useEffect(() => {
    setTheme(value);
  }, []);
  return (
    <label className="swap swap-rotate">
      {/* this hidden checkbox controls the state */}
      <input
        defaultChecked={value === Theme.light}
        type="checkbox"
        onChange={toggleDarkmode}
      />
      <Icons.sun className="swap-on fill-current w-10 h-10" />
      <Icons.moon className="swap-off fill-current w-10 h-10" />
    </label>
  );
};

export default ThemeSelector;
