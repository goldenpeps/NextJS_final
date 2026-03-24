"use client";

import { useEffect, useState } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import { Button } from "./Button";

type VideoType = {
  id: string;
};
export default function Video({ id }: VideoType) {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    setHasConsent(CookieConsent.acceptedCategory("media"));
    const onChange = () =>
      setHasConsent(CookieConsent.acceptedCategory("media"));

    window.addEventListener("cc:onConsent", onChange);
    window.addEventListener("cc:onChange", onChange);
    return () => {
      window.removeEventListener("cc:onConsent", onChange);
      window.removeEventListener("cc:onChange", onChange);
    };
  }, []);

  if (!hasConsent)
    return (
      <div className="flex justify-center items-center rounded-lg bg-medium py-20">
        <Button onClick={() => CookieConsent.acceptCategory("media")}>
          Cookies vidéos
        </Button>
      </div>
    );

  return (
    <iframe
      className="rounded-lg overflow-hidden w-full mt-12 aspect-video"
      src={`https://player.vimeo.com/video/${id}`}
      allow="encrypted-media"
    />
  );
}
