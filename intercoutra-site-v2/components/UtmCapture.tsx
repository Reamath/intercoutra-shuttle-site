"use client";

import { useEffect } from "react";
import { captureUtmFromLocation } from "@/lib/analytics";

// Silently stashes utm_source/medium/campaign/content from the current URL
// into localStorage on first load, so the enquiry form can attach them even
// if the visitor lands on an ad, browses a few pages, then converts later.
export default function UtmCapture() {
  useEffect(() => {
    captureUtmFromLocation();
  }, []);
  return null;
}
