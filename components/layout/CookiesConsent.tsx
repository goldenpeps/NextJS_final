"use client";

import { useEffect } from "react";

import "vanilla-cookieconsent/dist/cookieconsent.css";
import * as CookieConsent from "vanilla-cookieconsent";
import cookiesParams from "@/libs/cookies";
import Script from "next/script";

export default function CookiesConsent() {
  useEffect(() => {
    CookieConsent.run(cookiesParams).then(() =>
      CookieConsent.showPreferences(),
    );
  }, []);

  return (
    <>
      <button type="button" onClick={() => CookieConsent.showPreferences()}>
        Manage cookie preferences
      </button>
      <Script
        type="text/plain"
        data-category="analytics"
        data-service="Google Analytics"
      >
        console.log('test')
      </Script>
    </>
  );
}
