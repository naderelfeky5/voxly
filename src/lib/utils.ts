import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildFaviconSVG(theme: "light" | "dark"): string {
  const bg = theme === "light" ? "#F5EFE3" : "#1C1A17";
  const barEdge = "#4FA69E";
  const barMid = "#DAB878";
  const barCenter = "#C9A15A";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 34"><rect width="34" height="34" rx="8" fill="${bg}"/><rect x="1" y="12" width="4" height="10" rx="2" fill="${barEdge}"/><rect x="8" y="8" width="4" height="18" rx="2" fill="${barMid}"/><rect x="15" y="3" width="4" height="28" rx="2" fill="${barCenter}"/><rect x="22" y="8" width="4" height="18" rx="2" fill="${barMid}"/><rect x="29" y="12" width="4" height="10" rx="2" fill="${barEdge}"/></svg>`;
}

export function updateFavicon(theme: "light" | "dark") {
  if (typeof document === "undefined") return;
  const svg = buildFaviconSVG(theme);
  const href = "data:image/svg+xml," + encodeURIComponent(svg);
  let link = document.querySelector<HTMLLinkElement>("link#dynamic-favicon");
  if (!link) {
    link = document.createElement("link");
    link.id = "dynamic-favicon";
    link.rel = "icon";
    link.type = "image/svg+xml";
    document.head.appendChild(link);
  }
  link.href = href;
}
