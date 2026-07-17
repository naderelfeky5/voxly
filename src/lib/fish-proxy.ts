import { createServerFn } from "@tanstack/react-start";

// Fish Audio's API does not allow direct calls from a browser (no CORS
// headers), so these two server functions act as a thin, stateless relay:
// the browser sends its own key + request here, this runs on the server
// (server-to-server calls have no CORS restriction), and the response is
// streamed straight back. The key is never stored anywhere — it only lives
// for the duration of this one request.

type FishVoicesInput = { apiKey: string };

export const fishVoicesProxy = createServerFn({ method: "POST" })
  .validator((d: FishVoicesInput) => d)
  .handler(async ({ data }) => {
    const res = await fetch("https://api.fish.audio/model?self=true&page_size=100", {
      headers: { Authorization: `Bearer ${data.apiKey}` },
    });
    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: { "content-type": "application/json" },
    });
  });

type FishTtsInput = {
  apiKey: string;
  model: string;
  text: string;
  voiceId?: string;
  speed: number;
  latency: string;
};

export const fishTtsProxy = createServerFn({ method: "POST" })
  .validator((d: FishTtsInput) => d)
  .handler(async ({ data }) => {
    const body: Record<string, unknown> = {
      text: data.text,
      format: "mp3",
      latency: data.latency || "normal",
      prosody: { speed: data.speed },
    };
    if (data.voiceId) body.reference_id = data.voiceId;
    const res = await fetch("https://api.fish.audio/v1/tts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${data.apiKey}`,
        "Content-Type": "application/json",
        model: data.model || "s2.1-pro",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const t = await res.text();
      return new Response(t, { status: res.status, headers: { "content-type": "text/plain" } });
    }
    return new Response(res.body, {
      status: res.status,
      headers: { "content-type": res.headers.get("content-type") || "audio/mpeg" },
    });
  });
