"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

interface GoogleAdSenseBannerProps {
  client?: string;
  slot?: string;
  format?: string;
}

export default function GoogleAdSenseBanner({
  client = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT,
  slot = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT,
  format = "auto",
}: GoogleAdSenseBannerProps) {
  const hasClient = Boolean(client);
  const hasAdUnit = Boolean(client && slot);

  useEffect(() => {
    if (!hasAdUnit) return;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (error) {
      console.error("AdSense failed to render:", error);
    }
  }, [hasAdUnit]);

  return (
    <div className="flex justify-center items-center my-4 w-full overflow-hidden">
      <div className="flex w-full max-w-lg flex-col items-center gap-1.5">
        <span className="text-[9px] font-extrabold uppercase tracking-widest text-muted/50">
          Sponsored Advertisement
        </span>
        <div className="flex min-h-[90px] w-full items-center justify-center overflow-hidden rounded-xl border border-outline-soft bg-surface text-[10px] uppercase tracking-widest text-muted/40 shadow-inner">
          {hasClient && (
            <Script
              async
              src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
          )}
          {hasAdUnit ? (
            <>
              <ins
                className="adsbygoogle"
                style={{ display: "block", width: "100%" }}
                data-ad-client={client}
                data-ad-slot={slot}
                data-ad-format={format}
                data-full-width-responsive="true"
              />
            </>
          ) : hasClient ? (
            <span>Add AdSense slot ID</span>
          ) : (
            <span>Google AdSense slot</span>
          )}
        </div>
      </div>
    </div>
  );
}
