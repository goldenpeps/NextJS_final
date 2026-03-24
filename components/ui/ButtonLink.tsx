import clsx from "clsx";
import Link from "next/link";

type ButtonLinkType = {
  href: string;
  variant?: "filled" | "outline" | "link";
  color?: "light" | "dark";
  target?: string;
  children: React.ReactNode;
};

const buttonClasses = {
  dark: {
    filled: "bg-dark text-white! rounded-lg",
    outline: "border border-dark text-dark! rounded-lg",
    link: "text-dark",
  },
  light: {
    filled: "bg-white text-dark! rounded-lg",
    outline: "border border-medium-light text-white! rounded-lg ",
    link: "text-light",
  },
};

export function ButtonLink({
  href,
  variant = "filled",
  color = "dark",
  target,
  children,
}: ButtonLinkType) {
  return (
    <Link
      href={href}
      target={target}
      className={clsx(
        buttonClasses[color][variant],
        "px-4 py-3 font-bold flex items-center",
      )}
    >
      {variant === "link" && (
        <span className="material-symbols-outlined">arrow_forward</span>
      )}
      <span className={clsx(variant === "link" && "underline!")}>
        {children}
      </span>
    </Link>
  );
}
