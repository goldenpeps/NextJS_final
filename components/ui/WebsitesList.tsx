"use client";

import { useState } from "react";
import Website from "@/components/ui/Website";
import { Button } from "@/components/ui/Button";
import { WebsiteDocument } from "@/prismicio-types";

const PAGE_SIZE = 8;

type WebsitesListType = { websites: WebsiteDocument[] };

export default function WebsitesList({ websites }: WebsitesListType) {
  const [visible, setVisible] = useState(PAGE_SIZE);

  return (
    <>
      <div className="grid md:grid-cols-4 gap-x-4 gap-y-8 pt-12">
        {websites.slice(0, visible).map((w) => (
          <Website key={w.uid} website={w} />
        ))}
      </div>
      {visible < websites.length && (
        <footer className="pt-12 flex justify-center">
          <Button onClick={() => setVisible((v) => v + PAGE_SIZE)}>
            Charger plus de sites web
          </Button>
        </footer>
      )}
    </>
  );
}
