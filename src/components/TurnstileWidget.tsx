import { useEffect, useRef } from "react";

interface TurnstileWidgetProps {
  onTokenChange: (token: string) => void;
  resetKey?: number;
  lang?: "zh" | "en";
}

declare global {
  interface Window {
    turnstile?: {
      render: (element: HTMLElement, options: Record<string, unknown>) => string;
      remove: (widgetId: string) => void;
    };
  }
}

const SCRIPT_ID = "cloudflare-turnstile-script";
const TEST_SITE_KEY = "1x00000000000000000000AA";

export default function TurnstileWidget({ onTokenChange, resetKey = 0, lang = "en" }: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);
  const siteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || (import.meta.env.DEV ? TEST_SITE_KEY : "");

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;
    let cancelled = false;

    const renderWidget = () => {
      if (cancelled || !containerRef.current || !window.turnstile) return;
      if (widgetIdRef.current) window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        action: "turnstile-spin-v1",
        language: lang === "zh" ? "zh-cn" : "en",
        callback: (token: string) => onTokenChange(token),
        "expired-callback": () => onTokenChange(""),
        "error-callback": () => onTokenChange(""),
      });
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
      script.addEventListener("load", renderWidget, { once: true });
    }

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = undefined;
      }
    };
  }, [lang, onTokenChange, resetKey, siteKey]);

  if (!siteKey) return <p className="text-sm text-red-600">Turnstile site key is not configured.</p>;

  return <div ref={containerRef} data-action="turnstile-spin-v1" className="min-h-[65px]" />;
}
