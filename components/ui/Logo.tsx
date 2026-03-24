import Image from "next/image";
import Link from "next/link";

type LogoType = {
  size?: number;
  color?: "dark" | "light";
};

export default function Logo({ size = 90, color = "dark" }: LogoType) {
  return (
    <Link href="/">
      <Image
        src={color == "dark" ? "/logo.svg" : "/logo-light.svg"}
        alt="logo"
        width="90"
        height="24"
        style={{ width: size }}
      />
    </Link>
  );
}
