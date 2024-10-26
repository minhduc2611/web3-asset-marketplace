import { Icons } from "@/components/common/icons";
import { cn } from "@/lib/utils";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="app-logo flex items-center">
      <Icons.logoMinhKim className={cn("w-52")} />
    </Link>
  );
};

export default Logo;