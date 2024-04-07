import Link from "next/link";
import { Icons } from "@/components/common/icons";
import { twMerge } from "tailwind-merge";

const Logo = ({...props}) => {
  return (
    <Link href="/" {...props} className={twMerge("app-logo flex items-center", props.className)}>
      <Icons.logoMinhKim className={twMerge("w-52")} />
    </Link>
  );
};

export default Logo;