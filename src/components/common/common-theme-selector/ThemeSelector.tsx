import { useEffect } from "react";
import { Icons } from "../icons";
import useTheme, { Theme } from "@/hooks/useTheme";

const ThemeSelector = () => {
  const { theme, toggleMode } = useTheme();
  return (
    <label className="swap swap-rotate">
      {/* this hidden checkbox controls the state */}
      <input
        defaultChecked={theme === Theme.light}
        type="checkbox"
        onChange={toggleMode}
      />
      <Icons.sun className="swap-on fill-current w-10 h-10" />
      <Icons.moon className="swap-off fill-current w-10 h-10" />
    </label>
  );
};

export default ThemeSelector;
