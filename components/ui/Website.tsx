import { WebsiteDocument } from "@/prismicio-types";
import { PrismicImage } from "@prismicio/react";
import Link from "next/link";

export default function Website({ website }: { website: WebsiteDocument }) {
  return (
    <Link href={`websites/${website.uid}`}>
      <div className="relative">
        <PrismicImage
          field={website.data.img}
          className="rounded-lg"
        />
        <h3 className="mt-4">{website.data.title}</h3>
      </div>
    </Link>
  );
}
