import Link from "next/link";
import { Icons } from "@/components/common/icons";
import { twMerge } from "tailwind-merge";
import useIsMobile from "@/hooks/useIsMobile";

const Logo = ({...props}) => {
  const isMobile = useIsMobile();

  return (
    <Link href="/" {...props} className={twMerge("app-logo flex items-center", props.className)}>
      <Icons.logoMinhKim className={twMerge(isMobile?"w-32":"w-52", props.logoClassName)} />
    </Link>
  );
};

export default Logo;