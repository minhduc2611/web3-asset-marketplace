import { Icons } from "@/components/common/icons";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

const Logo = () => {
  return (
    <Link href="/" className="app-logo flex items-center">
      <Icons.logoMinhKim className={twMerge("w-52")} />
    </Link>
  );
};

export default Logo;