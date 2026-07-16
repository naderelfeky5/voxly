import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { updateFavicon } from "../lib/utils";

export type Engine = "browser" | "elevenlabs" | "gemini" | "camb" | "azure" | "polly";
export type Locale = "ar" | "en";
export type Theme = "light" | "dark";
export type Status = "idle" | "loading" | "playing" | "paused" | "stopped" | "error";

type BrowserVoice = { name: string; lang: string; voiceURI: string };
type CambVoice = { id: number; voice_name: string; gender?: number; language?: number };
type CambLanguage = { id: number; language: string; short_name?: string };

interface TTSState {
  // ui
  locale: Locale;
  theme: Theme;
  setLocale: (l: Locale) => void;
  toggleTheme: () => void;

  // text
  text: string;
  setText: (v: string) => void;

  // engine
  engine: Engine;
  setEngine: (e: Engine) => void;

  // params
  rate: number;
  setRate: (v: number) => void;
  pitch: number;
  setPitch: (v: number) => void;
  volume: number;
  setVolume: (v: number) => void;

  // browser voices
  browserVoices: BrowserVoice[];
  browserVoicesReady: boolean;
  browserVoiceURI: string;
  setBrowserVoiceURI: (v: string) => void;

  // elevenlabs
  elevenKey: string;
  setElevenKey: (v: string) => void;
  elevenVoices: { voice_id: string; name: string }[];
  elevenVoiceId: string;
  setElevenVoiceId: (v: string) => void;
  elevenManualId: string;
  setElevenManualId: (v: string) => void;
  stability: number;
  setStability: (v: number) => void;
  similarity: number;
  setSimilarity: (v: number) => void;
  style: number;
  setStyle: (v: number) => void;
  speakerBoost: boolean;
  setSpeakerBoost: (v: boolean) => void;
  loadElevenVoices: () => Promise<void>;

  // gemini
  geminiKey: string;
  setGeminiKey: (v: string) => void;
  geminiModels: string[];
  geminiModel: string;
  setGeminiModel: (v: string) => void;
  loadGeminiModels: () => Promise<void>;
  geminiVoice: string;
  setGeminiVoice: (v: string) => void;
  geminiScene: string;
  setGeminiScene: (v: string) => void;
  geminiStyle: string;
  setGeminiStyle: (v: string) => void;
  geminiPace: string;
  setGeminiPace: (v: string) => void;
  geminiAccent: string;
  setGeminiAccent: (v: string) => void;

  // camb.ai
  cambKey: string;
  setCambKey: (v: string) => void;
  cambLanguages: CambLanguage[];
  loadCambLanguages: () => Promise<void>;
  cambLanguageId: string;
  setCambLanguageId: (v: string) => void;
  cambVoices: CambVoice[];
  cambVoiceId: string;
  setCambVoiceId: (v: string) => void;
  loadCambVoices: () => Promise<void>;
  cambSpeechModel: string;
  setCambSpeechModel: (v: string) => void;
  cambSpeakingRate: number;
  setCambSpeakingRate: (v: number) => void;
  cambUserInstructions: string;
  setCambUserInstructions: (v: string) => void;

  // azure
  azureKey: string;
  setAzureKey: (v: string) => void;
  azureRegion: string;
  setAzureRegion: (v: string) => void;
  azureVoice: string;
  setAzureVoice: (v: string) => void;
  azureStyle: string;
  setAzureStyle: (v: string) => void;
  azureStyleDegree: number;
  setAzureStyleDegree: (v: number) => void;
  azureRole: string;
  setAzureRole: (v: string) => void;

  // polly
  pollyAccessKey: string;
  setPollyAccessKey: (v: string) => void;
  pollySecretKey: string;
  setPollySecretKey: (v: string) => void;
  pollyRegion: string;
  setPollyRegion: (v: string) => void;
  pollyVoice: string;
  setPollyVoice: (v: string) => void;
  pollyEngine: string;
  setPollyEngine: (v: string) => void;

  // playback
  status: Status;
  errorMsg: string;
  lastAudioUrl: string | null;
  speak: () => Promise<void>;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  download: () => void;
}

const Ctx = createContext<TTSState | null>(null);

export function useTTS() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useTTS must be used within TTSProvider");
  return v;
}

export function TTSProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") return "ar";
    const v = window.localStorage.getItem("voxly:locale");
    return v === "en" || v === "ar" ? v : "ar";
  });
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "light";
    const v = window.localStorage.getItem("voxly:theme");
    return v === "dark" || v === "light" ? v : "light";
  });
  const [text, setText] = useState("");
  const [engine, setEngine] = useState<Engine>("browser");

  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);

  const [browserVoices, setBrowserVoices] = useState<BrowserVoice[]>([]);
  const [browserVoicesReady, setBrowserVoicesReady] = useState(false);
  const [browserVoiceURI, setBrowserVoiceURI] = useState("");

  const [elevenKey, setElevenKey] = useState("");
  const [elevenVoices, setElevenVoices] = useState<{ voice_id: string; name: string }[]>([]);
  const [elevenVoiceId, setElevenVoiceId] = useState("");
  const [elevenManualId, setElevenManualId] = useState("");
  const [stability, setStability] = useState(0.5);
  const [similarity, setSimilarity] = useState(0.75);
  const [style, setStyle] = useState(0);
  const [speakerBoost, setSpeakerBoost] = useState(true);

  const [geminiKey, setGeminiKey] = useState("");
  const [geminiModels, setGeminiModels] = useState<string[]>([]);
  const [geminiModel, setGeminiModel] = useState("");
  const [geminiVoice, setGeminiVoice] = useState("Kore");
  const [geminiScene, setGeminiScene] = useState("");
  const [geminiStyle, setGeminiStyle] = useState("");
  const [geminiPace, setGeminiPace] = useState("");
  const [geminiAccent, setGeminiAccent] = useState("");

  const [cambKey, setCambKey] = useState("");
  const [cambLanguages, setCambLanguages] = useState<CambLanguage[]>([]);
  const [cambLanguageId, setCambLanguageId] = useState("");
  const [cambVoices, setCambVoices] = useState<CambVoice[]>([]);
  const [cambVoiceId, setCambVoiceId] = useState("");
  const [cambSpeechModel, setCambSpeechModel] = useState("mars-8.1-flash-beta");
  const [cambSpeakingRate, setCambSpeakingRate] = useState(1);
  const [cambUserInstructions, setCambUserInstructions] = useState("");

  const [azureKey, setAzureKey] = useState("");
  const [azureRegion, setAzureRegion] = useState("eastus");
  const [azureVoice, setAzureVoice] = useState("ar-EG-SalmaNeural");
  const [azureStyle, setAzureStyle] = useState("");
  const [azureStyleDegree, setAzureStyleDegree] = useState(1);
  const [azureRole, setAzureRole] = useState("");

  const [pollyAccessKey, setPollyAccessKey] = useState("");
  const [pollySecretKey, setPollySecretKey] = useState("");
  const [pollyRegion, setPollyRegion] = useState("us-east-1");
  const [pollyVoice, setPollyVoice] = useState("Zeina");
  const [pollyEngine, setPollyEngine] = useState("standard");

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [lastAudioUrl, setLastAudioUrl] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  // theme
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    updateFavicon(theme);
    try {
      window.localStorage.setItem("voxly:theme", theme);
    } catch {}
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme((t) => (t === "light" ? "dark" : "light")), []);

  // locale/dir — apply on mount and whenever locale changes
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    try {
      window.localStorage.setItem("voxly:locale", locale);
    } catch {}
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
  }, []);

  // load browser voices
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    let settled = false;
    const load = () => {
      const list = window.speechSynthesis.getVoices().map((v) => ({
        name: v.name,
        lang: v.lang,
        voiceURI: v.voiceURI,
      }));
      setBrowserVoices(list);
      if (list.length > 0) {
        settled = true;
        setBrowserVoicesReady(true);
      }
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    // Some browsers genuinely have no voices for a locale — don't show the
    // "no voices" message until we've given getVoices() a fair chance.
    const timer = setTimeout(() => {
      if (!settled) setBrowserVoicesReady(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredBrowserVoices = useMemo(() => {
    const prefix = locale === "ar" ? "ar" : "en";
    return browserVoices.filter((v) => v.lang.toLowerCase().startsWith(prefix));
  }, [browserVoices, locale]);

  useEffect(() => {
    if (!browserVoiceURI && filteredBrowserVoices.length > 0 && engine === "browser") {
      setBrowserVoiceURI(filteredBrowserVoices[0].voiceURI);
    }
  }, [filteredBrowserVoices, browserVoiceURI, engine]);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setStatus("stopped");
  }, []);

  const pause = useCallback(() => {
    if (utterRef.current && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.pause();
    }
    audioRef.current?.pause();
    setStatus("paused");
  }, []);

  const resume = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.resume();
    }
    audioRef.current?.play().catch(() => {});
    setStatus("playing");
  }, []);

  const speakBrowser = useCallback(async () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      throw new Error("متصفحك لا يدعم Speech Synthesis");
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = window.speechSynthesis.getVoices().find((x) => x.voiceURI === browserVoiceURI);
    if (v) u.voice = v;
    u.lang = v?.lang || (locale === "ar" ? "ar-SA" : "en-US");
    u.rate = rate;
    u.pitch = pitch;
    u.volume = volume;
    utterRef.current = u;
    u.onend = () => setStatus("idle");
    u.onerror = (e) => {
      if (e.error === "canceled" || e.error === "interrupted") return;
      setStatus("error");
      setErrorMsg("خطأ أثناء التشغيل");
    };
    window.speechSynthesis.speak(u);
    setStatus("playing");
  }, [text, browserVoiceURI, locale, rate, pitch, volume]);

  const playAudioBlob = useCallback((blob: Blob) => {
    const url = URL.createObjectURL(blob);
    setLastAudioUrl(url);
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.onended = () => setStatus("idle");
    }
    audioRef.current.src = url;
    audioRef.current.playbackRate = 1;
    audioRef.current.volume = 1;
    return audioRef.current.play();
  }, []);

  const speakEleven = useCallback(async () => {
    const vId = elevenManualId.trim() || elevenVoiceId;
    if (!elevenKey) throw new Error("أدخل مفتاح ElevenLabs API");
    if (!vId) throw new Error("اختر صوتًا أو أدخل Voice ID");
    setStatus("loading");
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${vId}`, {
      method: "POST",
      headers: {
        "xi-api-key": elevenKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability,
          similarity_boost: similarity,
          style,
          use_speaker_boost: speakerBoost,
        },
      }),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`ElevenLabs: ${res.status} ${t.slice(0, 120)}`);
    }
    const blob = await res.blob();
    await playAudioBlob(blob);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      audioRef.current.volume = volume;
    }
    setStatus("playing");
  }, [
    elevenKey,
    elevenVoiceId,
    elevenManualId,
    text,
    stability,
    similarity,
    style,
    speakerBoost,
    playAudioBlob,
    rate,
    volume,
  ]);

  const loadElevenVoices = useCallback(async () => {
    if (!elevenKey) throw new Error("أدخل المفتاح أولاً");
    const res = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: { "xi-api-key": elevenKey },
    });
    if (!res.ok) throw new Error("فشل تحميل الأصوات");
    const data = (await res.json()) as {
      voices: { voice_id: string; name: string }[];
    };
    setElevenVoices(data.voices || []);
    if (data.voices?.[0]) setElevenVoiceId(data.voices[0].voice_id);
  }, [elevenKey]);

  // Gemini TTS via generateContent with response_modalities: ["AUDIO"]
  const buildGeminiPrompt = useCallback(
    (raw: string) => {
      const scene = geminiScene.trim();
      let instruction =
        "TTS the following text exactly as written, verbatim, do not reply to it or add anything of your own.";
      const bits: string[] = [];
      if (geminiStyle) bits.push(`${geminiStyle} tone`);
      if (geminiPace) bits.push(`${geminiPace} pace`);
      if (geminiAccent) bits.push(`${geminiAccent} accent`);
      if (bits.length) instruction += ` Speak in a ${bits.join(", ")}.`;
      if (scene) instruction += ` Context/scene: ${scene}.`;
      return `${instruction}\n${raw}`;
    },
    [geminiScene, geminiStyle, geminiPace, geminiAccent],
  );

  const speakGemini = useCallback(async () => {
    if (!geminiKey) throw new Error("أدخل مفتاح Google API");
    const model = geminiModel || "gemini-2.5-flash-preview-tts";
    const voiceName = geminiVoice || "Kore";
    setStatus("loading");
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: buildGeminiPrompt(text) }] }],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName },
              },
            },
          },
        }),
      },
    );
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`Gemini: ${res.status} ${t.slice(0, 160)}`);
    }
    const data = await res.json();
    const b64 =
      data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ||
      data?.candidates?.[0]?.content?.parts?.[0]?.inline_data?.data;
    if (!b64) throw new Error("لم يتم إرجاع صوت");
    // Gemini returns raw PCM (24kHz, 16-bit, mono) — wrap into WAV
    const pcm = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const wav = pcmToWav(pcm, 24000, 1, 16);
    await playAudioBlob(new Blob([wav], { type: "audio/wav" }));
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      audioRef.current.volume = volume;
    }
    setStatus("playing");
  }, [geminiKey, geminiModel, geminiVoice, text, buildGeminiPrompt, playAudioBlob, rate, volume]);

  const loadGeminiModels = useCallback(async () => {
    if (!geminiKey) throw new Error("أدخل المفتاح أولاً");
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${geminiKey}`,
    );
    if (!res.ok) throw new Error("فشل تحميل النماذج");
    const data = (await res.json()) as {
      models: { name: string; supportedGenerationMethods?: string[] }[];
    };
    const tts = (data.models || [])
      .map((m) => m.name.replace(/^models\//, ""))
      .filter((n) => n.toLowerCase().includes("tts"));
    const list = tts.length ? tts : ["gemini-2.5-flash-preview-tts"];
    setGeminiModels(list);
    if (!geminiModel) setGeminiModel(list[0]);
  }, [geminiKey, geminiModel]);

  const loadCambLanguages = useCallback(async () => {
    if (!cambKey) throw new Error("أدخل المفتاح أولاً");
    const res = await fetch("https://client.camb.ai/apis/source-languages", {
      headers: { "x-api-key": cambKey, Accept: "application/json" },
    });
    if (!res.ok) throw new Error("فشل تحميل اللغات");
    const data = (await res.json()) as CambLanguage[];
    setCambLanguages(data || []);
    const arabic = data?.find((l) => /arabic/i.test(l.language));
    if (arabic) setCambLanguageId(String(arabic.id));
    else if (data?.[0]) setCambLanguageId(String(data[0].id));
  }, [cambKey]);

  const loadCambVoices = useCallback(async () => {
    if (!cambKey) throw new Error("أدخل المفتاح أولاً");
    const res = await fetch("https://client.camb.ai/apis/list-voices", {
      headers: { "x-api-key": cambKey },
    });
    if (!res.ok) throw new Error("فشل تحميل الأصوات");
    const data = (await res.json()) as CambVoice[];
    setCambVoices(data || []);
    const firstMatch = cambLanguageId
      ? data?.find((v) => String(v.language) === cambLanguageId)
      : data?.[0];
    if (firstMatch) setCambVoiceId(String(firstMatch.id));
  }, [cambKey, cambLanguageId]);

  const speakCamb = useCallback(async () => {
    if (!cambKey) throw new Error("أدخل مفتاح CAMB.AI API");
    if (!cambLanguageId) throw new Error("اختر لغة أولًا (حمّل اللغات المتاحة)");
    if (!cambVoiceId) throw new Error("اختر صوتًا أولًا (حمّل الأصوات المتاحة)");
    setStatus("loading");
    const body: Record<string, unknown> = {
      text,
      voice_id: Number(cambVoiceId),
      language: Number(cambLanguageId),
      speech_model: cambSpeechModel || "mars-8.1-flash-beta",
      speed: cambSpeakingRate,
      output_configuration: { format: "wav" },
    };
    if (cambUserInstructions.trim() && cambSpeechModel === "mars-instruct") {
      body.user_instructions = cambUserInstructions.trim();
    }
    const res = await fetch("https://client.camb.ai/apis/tts-stream", {
      method: "POST",
      headers: {
        "x-api-key": cambKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`CAMB.AI: ${res.status} ${t.slice(0, 160)}`);
    }
    const blob = await res.blob();
    await playAudioBlob(blob);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      audioRef.current.volume = volume;
    }
    setStatus("playing");
  }, [
    cambKey,
    cambLanguageId,
    cambVoiceId,
    cambSpeechModel,
    cambSpeakingRate,
    cambUserInstructions,
    text,
    playAudioBlob,
    rate,
    volume,
  ]);

  const speakAzure = useCallback(async () => {
    if (!azureKey) throw new Error("أدخل مفتاح Azure API");
    const region = azureRegion || "eastus";
    const voice = azureVoice || "ar-EG-SalmaNeural";
    const lang = voice.split("-").slice(0, 2).join("-");
    const escaped = escapeXml(text);
    const expressAttrs = azureStyle
      ? ` style="${azureStyle}"${azureStyleDegree !== 1 ? ` styledegree="${azureStyleDegree}"` : ""}${azureRole ? ` role="${azureRole}"` : ""}`
      : "";
    const voiceContent = azureStyle
      ? `<mstts:express-as${expressAttrs}>${escaped}</mstts:express-as>`
      : escaped;
    const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="${lang}"><voice name="${voice}">${voiceContent}</voice></speak>`;
    setStatus("loading");
    const res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": azureKey,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
      },
      body: ssml,
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`Azure: ${res.status} ${t.slice(0, 160)}`);
    }
    const blob = await res.blob();
    await playAudioBlob(blob);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      audioRef.current.volume = volume;
    }
    setStatus("playing");
  }, [
    azureKey,
    azureRegion,
    azureVoice,
    azureStyle,
    azureStyleDegree,
    azureRole,
    text,
    playAudioBlob,
    rate,
    volume,
  ]);

  // Amazon Polly requires each request to be signed (AWS SigV4) — done entirely
  // in the browser using Web Crypto, no server involved.
  const speakPolly = useCallback(async () => {
    if (!pollyAccessKey || !pollySecretKey) {
      throw new Error("أدخل Access Key وSecret Key الخاصين بـ AWS");
    }
    const region = pollyRegion || "us-east-1";
    const host = `polly.${region}.amazonaws.com`;
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
    const dateStamp = amzDate.slice(0, 8);
    const body = JSON.stringify({
      OutputFormat: "mp3",
      Text: text,
      VoiceId: pollyVoice || "Zeina",
      Engine: pollyEngine || "standard",
      TextType: "text",
    });
    const payloadHash = await sha256Hex(body);
    const canonicalHeaders = `content-type:application/json\nhost:${host}\nx-amz-date:${amzDate}\n`;
    const signedHeaders = "content-type;host;x-amz-date";
    const canonicalRequest = `POST\n/v1/speech\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;
    const credentialScope = `${dateStamp}/${region}/polly/aws4_request`;
    const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${await sha256Hex(canonicalRequest)}`;
    const signingKey = await getSigningKey(pollySecretKey, dateStamp, region, "polly");
    const signature = toHex(await hmacSha256(signingKey, stringToSign));
    const authHeader = `AWS4-HMAC-SHA256 Credential=${pollyAccessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    setStatus("loading");
    const res = await fetch(`https://${host}/v1/speech`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Amz-Date": amzDate,
        Authorization: authHeader,
      },
      body,
    });
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`Polly: ${res.status} ${t.slice(0, 160)}`);
    }
    const blob = await res.blob();
    await playAudioBlob(blob);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      audioRef.current.volume = volume;
    }
    setStatus("playing");
  }, [
    pollyAccessKey,
    pollySecretKey,
    pollyRegion,
    pollyVoice,
    pollyEngine,
    text,
    playAudioBlob,
    rate,
    volume,
  ]);

  const speak = useCallback(async () => {
    setErrorMsg("");
    try {
      if (!text.trim()) throw new Error("اكتب نصًا أولًا");
      if (engine === "browser") await speakBrowser();
      else if (engine === "elevenlabs") await speakEleven();
      else if (engine === "gemini") await speakGemini();
      else if (engine === "camb") await speakCamb();
      else if (engine === "azure") await speakAzure();
      else await speakPolly();
    } catch (e) {
      setStatus("error");
      setErrorMsg(e instanceof Error ? e.message : "حدث خطأ");
    }
  }, [engine, text, speakBrowser, speakEleven, speakGemini, speakCamb, speakAzure, speakPolly]);

  const download = useCallback(() => {
    if (!lastAudioUrl) return;
    const a = document.createElement("a");
    a.href = lastAudioUrl;
    a.download = `voxly-${Date.now()}.${engine === "gemini" || engine === "camb" ? "wav" : "mp3"}`;
    a.click();
  }, [lastAudioUrl, engine]);

  // apply live rate/volume to browser utterance is not supported mid-speech, but audio element yes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
      audioRef.current.volume = volume;
    }
  }, [rate, volume]);

  const value: TTSState = {
    locale,
    setLocale,
    theme,
    toggleTheme,
    text,
    setText,
    engine,
    setEngine,
    rate,
    setRate,
    pitch,
    setPitch,
    volume,
    setVolume,
    browserVoices: filteredBrowserVoices,
    browserVoicesReady,
    browserVoiceURI,
    setBrowserVoiceURI,
    elevenKey,
    setElevenKey,
    elevenVoices,
    elevenVoiceId,
    setElevenVoiceId,
    elevenManualId,
    setElevenManualId,
    stability,
    setStability,
    similarity,
    setSimilarity,
    style,
    setStyle,
    speakerBoost,
    setSpeakerBoost,
    loadElevenVoices,
    geminiKey,
    setGeminiKey,
    geminiModels,
    geminiModel,
    setGeminiModel,
    loadGeminiModels,
    geminiVoice,
    setGeminiVoice,
    geminiScene,
    setGeminiScene,
    geminiStyle,
    setGeminiStyle,
    geminiPace,
    setGeminiPace,
    geminiAccent,
    setGeminiAccent,
    cambKey,
    setCambKey,
    cambLanguages,
    loadCambLanguages,
    cambLanguageId,
    setCambLanguageId,
    cambVoices,
    cambVoiceId,
    setCambVoiceId,
    loadCambVoices,
    cambSpeechModel,
    setCambSpeechModel,
    cambSpeakingRate,
    setCambSpeakingRate,
    cambUserInstructions,
    setCambUserInstructions,
    azureKey,
    setAzureKey,
    azureRegion,
    setAzureRegion,
    azureVoice,
    setAzureVoice,
    azureStyle,
    setAzureStyle,
    azureStyleDegree,
    setAzureStyleDegree,
    azureRole,
    setAzureRole,
    pollyAccessKey,
    setPollyAccessKey,
    pollySecretKey,
    setPollySecretKey,
    pollyRegion,
    setPollyRegion,
    pollyVoice,
    setPollyVoice,
    pollyEngine,
    setPollyEngine,
    status,
    errorMsg,
    lastAudioUrl,
    speak,
    pause,
    resume,
    stop,
    download,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

async function sha256Hex(message: string): Promise<string> {
  const enc = new TextEncoder().encode(message);
  const hash = await crypto.subtle.digest("SHA-256", enc);
  return toHex(hash);
}

async function hmacSha256(key: ArrayBuffer, message: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(message));
}

async function getSigningKey(
  secretKey: string,
  dateStamp: string,
  region: string,
  service: string,
): Promise<ArrayBuffer> {
  const kDate = await hmacSha256(
    new TextEncoder().encode("AWS4" + secretKey).buffer as ArrayBuffer,
    dateStamp,
  );
  const kRegion = await hmacSha256(kDate, region);
  const kService = await hmacSha256(kRegion, service);
  return hmacSha256(kService, "aws4_request");
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function pcmToWav(
  pcm: Uint8Array,
  sampleRate: number,
  channels: number,
  bits: number,
): ArrayBuffer {
  const byteRate = (sampleRate * channels * bits) / 8;
  const blockAlign = (channels * bits) / 8;
  const buffer = new ArrayBuffer(44 + pcm.length);
  const view = new DataView(buffer);
  const w = (off: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i));
  };
  w(0, "RIFF");
  view.setUint32(4, 36 + pcm.length, true);
  w(8, "WAVE");
  w(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bits, true);
  w(36, "data");
  view.setUint32(40, pcm.length, true);
  new Uint8Array(buffer, 44).set(pcm);
  return buffer;
}
