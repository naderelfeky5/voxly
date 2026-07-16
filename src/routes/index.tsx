import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useTTS } from "@/contexts/tts-context";

export const Route = createFileRoute("/")({
  ssr: false,
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 lg:px-8">
        <Header />
        <main className="pb-24 pt-4 md:pt-8">
          <Hero />
          <Card />
          <HowItWorks />
          <Footer />
        </main>
      </div>
    </div>
  );
}

function Header() {
  const { locale, setLocale, toggleTheme } = useTTS();
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-5 sm:flex sm:justify-between">
      <div className="flex min-w-0 items-center gap-2.5">
        <BrandMark />
        <span className="truncate text-xl font-bold tracking-tight sm:text-2xl">Voxly</span>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={toggleTheme}
          aria-label="toggle theme"
          className="grid size-9 place-items-center rounded-full border border-border bg-card text-base shadow-sm transition hover:bg-accent"
        >
          <span className="dark:hidden">🌙</span>
          <span className="hidden dark:inline">☀️</span>
        </button>
        <button
          onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
          className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-semibold shadow-sm transition hover:bg-accent"
        >
          {locale === "ar" ? "English" : "العربية"}
        </button>
      </div>
    </header>
  );
}

function BrandMark() {
  return (
    <span className="inline-flex size-9 items-center justify-center" aria-hidden>
      <svg viewBox="0 0 34 34" width="34" height="34" xmlns="http://www.w3.org/2000/svg">
        <rect
          className="brand-bar"
          x="1"
          y="12"
          width="4"
          height="10"
          rx="2"
          fill="var(--color-primary)"
        />
        <rect
          className="brand-bar"
          x="8"
          y="8"
          width="4"
          height="18"
          rx="2"
          fill="color-mix(in oklch, var(--color-gold) 80%, white)"
        />
        <rect
          className="brand-bar"
          x="15"
          y="3"
          width="4"
          height="28"
          rx="2"
          fill="var(--color-gold)"
        />
        <rect
          className="brand-bar"
          x="22"
          y="8"
          width="4"
          height="18"
          rx="2"
          fill="color-mix(in oklch, var(--color-gold) 80%, white)"
        />
        <rect
          className="brand-bar"
          x="29"
          y="12"
          width="4"
          height="10"
          rx="2"
          fill="var(--color-primary)"
        />
      </svg>
    </span>
  );
}

function HeroWave() {
  const heights = [7, 13, 19, 25, 19, 13, 7];
  return (
    <svg viewBox="0 0 130 30" aria-hidden className="mx-auto mt-5 block h-7 w-32">
      {heights.map((h, i) => (
        <rect
          key={i}
          className="hero-wave-bar"
          x={i * 18 + 3}
          y={(30 - h) / 2}
          width="8"
          height={h}
          rx="4"
          fill="var(--color-gold)"
        />
      ))}
    </svg>
  );
}

function Hero() {
  const { locale } = useTTS();
  return (
    <section className="mb-8 text-center md:mb-12">
      <h1 className="intro-fade intro-fade-1 whitespace-nowrap text-2xl font-extrabold tracking-tight sm:text-3xl md:text-5xl">
        <span className="text-primary">Voxly</span>{" "}
        <span>{locale === "ar" ? "— حوّل نصوصك لصوت" : "— turn text into voice"}</span>
      </h1>
      <HeroWave />
      <p className="intro-fade intro-fade-2 mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
        {locale === "ar"
          ? "يدعم العربية والإنجليزية، ويعمل مباشرة من متصفحك — بلا تسجيل دخول."
          : "Arabic + English, runs entirely in your browser — no sign-in."}
      </p>
    </section>
  );
}

function Card() {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-[0_10px_40px_-15px_rgba(120,80,20,0.15)] md:p-8">
      <TextArea />
      <Sliders />
      <EngineTabs />
      <EnginePanel />
      <Controls />
      <EqualizerLine />
    </section>
  );
}

function TextArea() {
  const { text, setText, locale } = useTTS();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const onUpload = (f: File) => {
    const reader = new FileReader();
    reader.onload = () => setText(String(reader.result || ""));
    reader.readAsText(f);
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={() => inputRef.current?.click()}
          className="rounded-full border border-border bg-background px-4 py-1.5 text-sm font-semibold transition hover:bg-accent"
        >
          ⇪ {locale === "ar" ? "رفع ملف نصي" : "Upload text file"}
        </button>
        <span className="text-xs text-muted-foreground">
          {text.length} {locale === "ar" ? "حرف" : "chars"}
        </span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".txt,.md,text/plain"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onUpload(f);
        }}
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={locale === "ar" ? "اكتب أو الصق النص هنا..." : "Type or paste text..."}
        className="min-h-40 w-full resize-y rounded-2xl border border-border bg-muted/60 p-4 text-base leading-relaxed outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );
}

function EqualizerLine() {
  const { status } = useTTS();
  const playing = status === "playing";
  return (
    <div
      className={`waveform ${playing ? "waveform-active" : ""}`}
      id="waveform"
      aria-hidden="true"
    >
      {Array.from({ length: 40 }).map((_, i) => (
        <div key={i} className="bar" />
      ))}
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-sm font-semibold">
        <span>{label}</span>
        <span className="tabular-nums text-muted-foreground">{value.toFixed(2)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ ["--pct" as string]: `${((value - min) / (max - min)) * 100}%` }}
        className="slider-gold"
      />
    </div>
  );
}

function Sliders() {
  const { rate, setRate, pitch, setPitch, volume, setVolume, locale } = useTTS();
  return (
    <div className="space-y-5">
      <Slider
        label={locale === "ar" ? "السرعة" : "Speed"}
        value={rate}
        min={0.5}
        max={2}
        step={0.05}
        onChange={setRate}
      />
      <Slider
        label={locale === "ar" ? "طبقة الصوت" : "Pitch"}
        value={pitch}
        min={0}
        max={2}
        step={0.05}
        onChange={setPitch}
      />
      <Slider
        label={locale === "ar" ? "مستوى الصوت" : "Volume"}
        value={volume}
        min={0}
        max={1}
        step={0.05}
        onChange={setVolume}
      />
    </div>
  );
}

function EngineTabs() {
  const { engine, setEngine, locale } = useTTS();
  const options: { id: typeof engine; ar: string; en: string }[] = [
    { id: "browser", ar: "صوت المتصفح (مجاني)", en: "Browser voice (free)" },
    { id: "elevenlabs", ar: "ElevenLabs", en: "ElevenLabs" },
    { id: "gemini", ar: "Google Gemini TTS", en: "Google Gemini TTS" },
    { id: "camb", ar: "CAMB.AI", en: "CAMB.AI" },
    { id: "azure", ar: "Microsoft Azure TTS (مدفوع)", en: "Microsoft Azure TTS (Paid)" },
    { id: "polly", ar: "Amazon Polly (مدفوع)", en: "Amazon Polly (Paid)" },
  ];
  return (
    <div className="mt-8">
      <label className="mb-1.5 block text-sm font-semibold">
        {locale === "ar" ? "محرك الصوت" : "Voice engine"}
      </label>
      <select
        value={engine}
        onChange={(e) => setEngine(e.target.value as typeof engine)}
        className="w-full rounded-xl border-2 border-primary/40 bg-primary/5 p-3 text-sm font-bold text-primary outline-none focus:border-primary"
      >
        {options.map((o) => (
          <option key={o.id} value={o.id} className="bg-background font-semibold text-foreground">
            {locale === "ar" ? o.ar : o.en}
          </option>
        ))}
      </select>
    </div>
  );
}

function EnginePanel() {
  const { engine } = useTTS();
  return (
    <div className="mt-5">
      {engine === "browser" && <BrowserPanel />}
      {engine === "elevenlabs" && <ElevenPanel />}
      {engine === "gemini" && <GeminiPanel />}
      {engine === "camb" && <CambPanel />}
      {engine === "azure" && <AzurePanel />}
      {engine === "polly" && <PollyPanel />}
    </div>
  );
}

function BrowserPanel() {
  const { browserVoices, browserVoicesReady, browserVoiceURI, setBrowserVoiceURI, locale } =
    useTTS();
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold">
        {locale === "ar" ? "الصوت" : "Voice"}
      </label>
      {!browserVoicesReady ? null : browserVoices.length === 0 ? (
        <p className="rounded-xl border border-border bg-muted/50 p-3 text-sm text-muted-foreground">
          {locale === "ar"
            ? "لا توجد أصوات متاحة في متصفحك لهذه اللغة."
            : "No voices available in your browser for this language."}
        </p>
      ) : (
        <select
          value={browserVoiceURI}
          onChange={(e) => setBrowserVoiceURI(e.target.value)}
          className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
        >
          {browserVoices.map((v) => (
            <option key={v.voiceURI} value={v.voiceURI}>
              {v.name} — {v.lang}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

function ElevenPanel() {
  const t = useTTS();
  const [advanced, setAdvanced] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const isAr = t.locale === "ar";

  const load = async () => {
    setBusy(true);
    setErr("");
    try {
      await t.loadElevenVoices();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "err");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold">
        {isAr ? "مفتاح ElevenLabs API" : "ElevenLabs API key"}
      </label>
      <input
        type="password"
        value={t.elevenKey}
        onChange={(e) => t.setElevenKey(e.target.value)}
        placeholder="sk_..."
        className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
      />
      <div className="flex justify-center">
        <button
          onClick={load}
          disabled={busy}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow transition hover:opacity-90 disabled:opacity-60"
        >
          ⟳ {isAr ? "تحميل الأصوات المتاحة على حسابي" : "Load my available voices"}
        </button>
      </div>

      {err && <p className="text-sm text-destructive">{err}</p>}

      {t.elevenVoices.length > 0 && (
        <select
          value={t.elevenVoiceId}
          onChange={(e) => t.setElevenVoiceId(e.target.value)}
          className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
        >
          {t.elevenVoices.map((v) => (
            <option key={v.voice_id} value={v.voice_id}>
              {v.name}
            </option>
          ))}
        </select>
      )}

      <button
        onClick={() => setAdvanced((v) => !v)}
        className="text-sm font-semibold text-primary hover:underline"
      >
        {isAr ? "إعدادات متقدمة ومعلومات" : "Advanced settings & info"} {advanced ? "▲" : "▼"}
      </button>

      {advanced && (
        <div className="space-y-4 rounded-2xl border-2 border-primary/30 bg-primary/5 p-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold">
              {isAr ? "أو أدخل معرّف الصوت يدويًا (Voice ID)" : "Or enter Voice ID manually"}
            </label>
            <input
              value={t.elevenManualId}
              onChange={(e) => t.setElevenManualId(e.target.value)}
              className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <Slider
            label={isAr ? "الثبات" : "Stability"}
            value={t.stability}
            min={0}
            max={1}
            step={0.01}
            onChange={t.setStability}
          />
          <Slider
            label={isAr ? "التشابه مع الصوت الأصلي" : "Similarity"}
            value={t.similarity}
            min={0}
            max={1}
            step={0.01}
            onChange={t.setSimilarity}
          />
          <Slider
            label={isAr ? "قوة الأسلوب" : "Style"}
            value={t.style}
            min={0}
            max={1}
            step={0.01}
            onChange={t.setStyle}
          />
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={t.speakerBoost}
              onChange={(e) => t.setSpeakerBoost(e.target.checked)}
              className="size-4 accent-[var(--color-gold)]"
            />
            {isAr ? "تعزيز وضوح الصوت (Speaker boost)" : "Speaker boost"}
          </label>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {isAr
              ? "المفتاح لا يُحفظ ولا يمر بأي خادم وسيط — يُرسل مباشرة إلى ElevenLabs عند الاستماع فقط، ويختفي بمجرد إغلاق الصفحة."
              : "The key is never stored and never proxied — sent directly to ElevenLabs only on playback and gone when you close the page."}
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {isAr
              ? "لا تملك مفتاحًا؟ أنشئ حسابًا مجانيًا على elevenlabs.io واحصل عليه من إعدادات الحساب."
              : "No key? Create a free account at elevenlabs.io and grab it from account settings."}
          </p>
        </div>
      )}
    </div>
  );
}

function GeminiPanel() {
  const t = useTTS();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const isAr = t.locale === "ar";

  const load = async () => {
    setBusy(true);
    setErr("");
    try {
      await t.loadGeminiModels();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "err");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold">
        {isAr ? "مفتاح Google AI Studio API" : "Google AI Studio API key"}
      </label>
      <input
        type="password"
        value={t.geminiKey}
        onChange={(e) => t.setGeminiKey(e.target.value)}
        placeholder="AI..."
        className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
      />
      <div className="flex justify-center">
        <button
          onClick={load}
          disabled={busy}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow transition hover:opacity-90 disabled:opacity-60"
        >
          ⟳ {isAr ? "تحميل النماذج المتاحة على حسابي" : "Load available models"}
        </button>
      </div>

      {err && <p className="text-sm text-destructive">{err}</p>}

      {t.geminiModels.length > 0 && (
        <select
          value={t.geminiModel}
          onChange={(e) => t.setGeminiModel(e.target.value)}
          className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
        >
          {t.geminiModels.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      )}

      <label className="block text-sm font-semibold">
        {isAr ? "اسم الصوت (Voice)" : "Voice name"}
      </label>
      <select
        value={t.geminiVoice}
        onChange={(e) => t.setGeminiVoice(e.target.value)}
        className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
      >
        {GEMINI_VOICES.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>

      <details className="rounded-xl border-2 border-primary/30 bg-primary/5 p-3">
        <summary className="cursor-pointer text-sm font-semibold">
          {isAr ? "إعدادات متقدمة ومعلومات" : "Advanced settings & info"}
        </summary>
        <div className="mt-3 space-y-3">
          <div>
            <label className="block text-sm font-semibold">
              {isAr ? "وصف المشهد أو الأسلوب (اختياري)" : "Scene / style description (optional)"}
            </label>
            <input
              type="text"
              value={t.geminiScene}
              onChange={(e) => t.setGeminiScene(e.target.value)}
              placeholder={
                isAr
                  ? "مثال: صوت هادئ وواثق في نشرة أخبار مسائية"
                  : "e.g. calm confident voice, evening news broadcast"
              }
              className="mt-1 w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {GEMINI_SCENE_CHIPS.map((chip) => (
                <button
                  key={chip.value}
                  type="button"
                  onClick={() => t.setGeminiScene(t.geminiScene === chip.value ? "" : chip.value)}
                  className={`rounded-full border px-3 py-1 text-xs transition ${
                    t.geminiScene === chip.value
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:bg-accent"
                  }`}
                >
                  {isAr ? chip.ar : chip.en}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-semibold">{isAr ? "الأسلوب" : "Style"}</label>
              <select
                value={t.geminiStyle}
                onChange={(e) => t.setGeminiStyle(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
              >
                {GEMINI_STYLE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {isAr ? o.ar : o.en}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold">{isAr ? "الإيقاع" : "Pace"}</label>
              <select
                value={t.geminiPace}
                onChange={(e) => t.setGeminiPace(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
              >
                {GEMINI_PACE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {isAr ? o.ar : o.en}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold">{isAr ? "اللكنة" : "Accent"}</label>
              <select
                value={t.geminiAccent}
                onChange={(e) => t.setGeminiAccent(e.target.value)}
                className="mt-1 w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
              >
                {GEMINI_ACCENT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {isAr ? o.ar : o.en}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-xs leading-relaxed text-muted-foreground">
            {isAr
              ? "المفتاح لا يُحفظ ويُرسل مباشرة إلى Google عند الاستماع فقط — لن يظهر لك مرة أخرى بعد إغلاق الصفحة."
              : "Your key isn't saved anywhere and goes straight to Google only when you press Listen — it disappears once you close this page."}
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {isAr
              ? "لا تملك مفتاحًا؟ أنشئ واحدًا مجانًا من aistudio.google.com ← Get API Key."
              : "No key yet? Get a free one at aistudio.google.com → Get API Key."}
          </p>
        </div>
      </details>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {isAr
          ? "المفتاح يُستخدم مباشرة من متصفحك ولا يمر بأي خادم."
          : "Your key is used directly from the browser — no server in the middle."}
      </p>
    </div>
  );
}

const GEMINI_VOICES = [
  "Zephyr",
  "Puck",
  "Charon",
  "Kore",
  "Fenrir",
  "Leda",
  "Orus",
  "Aoede",
  "Callirrhoe",
  "Autonoe",
  "Enceladus",
  "Iapetus",
  "Umbriel",
  "Algieba",
  "Despina",
  "Erinome",
  "Algenib",
  "Rasalgethi",
  "Laomedeia",
  "Achernar",
  "Alnilam",
  "Schedar",
  "Gacrux",
  "Pulcherrima",
  "Achird",
  "Zubenelgenubi",
  "Vindemiatrix",
  "Sadachbia",
  "Sadaltager",
  "Sulafat",
];

const GEMINI_SCENE_CHIPS = [
  { value: "بصوت هادئ ومهني وواثق", ar: "هادئ ومهني", en: "Calm & professional" },
  {
    value: "بصوت حماسي وسريع الإيقاع، مثل إعلان تجاري",
    ar: "إعلان حماسي",
    en: "Excited ad",
  },
  {
    value: "بصوت دافئ وبطيء وحنون، مثل قصة قبل النوم لطفل",
    ar: "قصة أطفال",
    en: "Bedtime story",
  },
  { value: "بصوت رسمي وواضح، مثل مذيع نشرة أخبار", ar: "نشرة أخبار", en: "News anchor" },
];

const GEMINI_STYLE_OPTIONS = [
  { value: "", ar: "بدون تحديد", en: "None" },
  { value: "Empathetic", ar: "متعاطف", en: "Empathetic" },
  { value: "Cheerful", ar: "مرح", en: "Cheerful" },
  { value: "Calm", ar: "هادئ", en: "Calm" },
  { value: "Serious", ar: "جاد", en: "Serious" },
  { value: "Excited", ar: "متحمس", en: "Excited" },
  { value: "Sad", ar: "حزين", en: "Sad" },
  { value: "Whispering", ar: "هامس", en: "Whispering" },
];

const GEMINI_PACE_OPTIONS = [
  { value: "", ar: "بدون تحديد", en: "None" },
  { value: "Slow", ar: "بطيء", en: "Slow" },
  { value: "Natural", ar: "طبيعي", en: "Natural" },
  { value: "Fast", ar: "سريع", en: "Fast" },
];

const GEMINI_ACCENT_OPTIONS = [
  { value: "", ar: "بدون تحديد", en: "None" },
  { value: "Egyptian Arabic", ar: "مصرية", en: "Egyptian Arabic" },
  { value: "Gulf Arabic", ar: "خليجية", en: "Gulf Arabic" },
  { value: "Levantine Arabic", ar: "شامية", en: "Levantine Arabic" },
  { value: "Standard Arabic", ar: "فصحى", en: "Standard Arabic" },
  { value: "American English", ar: "أمريكية", en: "American English" },
  { value: "British English", ar: "بريطانية", en: "British English" },
];

function Controls() {
  const { speak, pause, resume, stop, download, status, errorMsg, lastAudioUrl, engine, locale } =
    useTTS();
  const isAr = locale === "ar";
  const label =
    status === "loading"
      ? isAr
        ? "جاري..."
        : "Loading..."
      : status === "playing"
        ? isAr
          ? "يعمل"
          : "Playing"
        : status === "paused"
          ? isAr
            ? "متوقف مؤقتًا"
            : "Paused"
          : status === "stopped"
            ? isAr
              ? "إيقاف"
              : "Stopped"
            : status === "error"
              ? isAr
                ? "خطأ"
                : "Error"
              : isAr
                ? "جاهز"
                : "Ready";

  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => speak()}
          disabled={status === "loading"}
          className="rounded-full bg-gold px-6 py-3 text-base font-bold text-gold-foreground shadow-lg transition hover:opacity-90 disabled:opacity-60"
        >
          ▶ {isAr ? "استمع" : "Listen"}
        </button>
        {status === "paused" ? (
          <button
            onClick={resume}
            className="rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold transition hover:bg-accent"
          >
            ▶ {isAr ? "استئناف" : "Resume"}
          </button>
        ) : (
          <button
            onClick={pause}
            disabled={status !== "playing"}
            className="rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold transition hover:bg-accent disabled:opacity-50"
          >
            ‖ {isAr ? "إيقاف مؤقت" : "Pause"}
          </button>
        )}
        <button
          onClick={stop}
          className="rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold transition hover:bg-accent"
        >
          ■ {isAr ? "إيقاف" : "Stop"}
        </button>
        <button
          onClick={download}
          disabled={!lastAudioUrl || engine === "browser"}
          title={
            engine === "browser"
              ? isAr
                ? "تنزيل الصوت غير متاح في وضع المتصفح"
                : "Download not available for browser voice"
              : ""
          }
          className="rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold transition hover:bg-accent disabled:opacity-50"
        >
          ⇩ {isAr ? "تنزيل الصوت" : "Download"}
        </button>
      </div>
      <div
        className={`text-sm ${status === "error" ? "text-destructive" : "text-muted-foreground"}`}
      >
        {status === "error" ? errorMsg : label}
      </div>
    </div>
  );
}

function HowItWorks() {
  const { locale } = useTTS();
  const isAr = locale === "ar";
  const steps = isAr
    ? [
        {
          t: "اختر نوع الصوت",
          d: "مجاني، أو ElevenLabs، أو Gemini — ولو اخترت وضع الـ API حط مفتاحك.",
        },
        {
          t: "اكتب النص",
          d: "اكتب نصًا، أو الصقه، أو ارفع ملف ‎.txt‏، وعدّل السرعة والإعدادات حسب رغبتك.",
        },
        {
          t: "اضغط استمع",
          d: "يمكنك تنزيل الملف بعد الاستماع والتأكد من صحة الكلام.",
        },
      ]
    : [
        { t: "Write or paste", d: "Type text, paste, or upload a .txt file." },
        { t: "Tune it", d: "Pick the engine, voice, speed and pitch." },
        { t: "Listen or download", d: "Hit play, then download the audio." },
      ];
  return (
    <section className="mt-16">
      <h2 className="text-center text-2xl font-extrabold tracking-tight md:text-3xl">
        {isAr ? "كيف يعمل" : "How it works"}
      </h2>
      <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-gold" />
      <ol className="mt-8 grid gap-4 sm:grid-cols-3">
        {steps.map((s, i) => (
          <li key={i} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="grid size-9 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              {i + 1}
            </div>
            <h3 className="mt-3 text-base font-bold">{s.t}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Footer() {
  const { locale } = useTTS();
  return (
    <p className="mt-10 text-center text-xs text-muted-foreground">
      {locale === "ar"
        ? "يعمل بالكامل داخل متصفحك — نصوصك لا تُرسل لأي خادم إلا في أوضاع الصوت عالي الجودة."
        : "Runs entirely in your browser — your text is never sent to a server, except in high-quality voice modes."}
    </p>
  );
}

const CAMB_SPEECH_MODELS = [
  { value: "mars-8.1-flash-beta", ar: "سريع (Flash)", en: "Fast (Flash)" },
  { value: "mars-8.1-pro-beta", ar: "عالي الجودة (Pro)", en: "High quality (Pro)" },
  { value: "mars-instruct", ar: "تحكم بالتعليمات (Instruct)", en: "Instruction-controlled" },
];

const CAMB_ALL_ARABIC = "all-arabic";

function CambPanel() {
  const t = useTTS();
  const isAr = t.locale === "ar";
  const arabicLanguageIds = t.cambLanguages
    .filter((l) => /arabic/i.test(l.language))
    .map((l) => String(l.id));
  const filteredVoices =
    t.cambLanguageId === CAMB_ALL_ARABIC
      ? t.cambVoices.filter((v) => arabicLanguageIds.includes(String(v.language)))
      : t.cambLanguageId
        ? t.cambVoices.filter((v) => String(v.language) === t.cambLanguageId)
        : t.cambVoices;
  const loadBtnClass =
    "w-full rounded-xl border-2 border-primary/40 bg-primary/5 p-3 text-sm font-semibold text-primary transition hover:bg-primary/10";
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold">
        {isAr ? "مفتاح CAMB.AI API" : "CAMB.AI API key"}
      </label>
      <input
        type="password"
        value={t.cambKey}
        onChange={(e) => t.setCambKey(e.target.value)}
        className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
      />

      <button
        type="button"
        onClick={() => {
          t.loadCambLanguages().catch(() => {});
        }}
        className={loadBtnClass}
      >
        {isAr ? "تحميل اللغات المتاحة" : "Load available languages"}
      </button>

      {t.cambLanguages.length > 0 && (
        <>
          <label className="block text-sm font-semibold">{isAr ? "اللغة" : "Language"}</label>
          <select
            value={t.cambLanguageId}
            onChange={(e) => t.setCambLanguageId(e.target.value)}
            className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
          >
            {arabicLanguageIds.length > 0 && (
              <option value={CAMB_ALL_ARABIC}>{isAr ? "عربي (كل اللهجات)" : "Arabic (all)"}</option>
            )}
            {t.cambLanguages.map((l) => (
              <option key={l.id} value={l.id}>
                {l.language}
              </option>
            ))}
          </select>
        </>
      )}

      <button
        type="button"
        onClick={() => {
          t.loadCambVoices().catch(() => {});
        }}
        className={loadBtnClass}
      >
        {isAr ? "تحميل الأصوات المتاحة على حسابي" : "Load voices available on my account"}
      </button>

      {filteredVoices.length > 0 && (
        <select
          value={t.cambVoiceId}
          onChange={(e) => t.setCambVoiceId(e.target.value)}
          className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
        >
          {filteredVoices.map((v) => (
            <option key={v.id} value={v.id}>
              {v.voice_name}
            </option>
          ))}
        </select>
      )}
      {t.cambVoices.length > 0 && filteredVoices.length === 0 && (
        <p className="text-xs text-muted-foreground">
          {isAr
            ? "لا توجد أصوات محمّلة لهذه اللغة على حسابك."
            : "No loaded voices support this language on your account."}
        </p>
      )}

      <details className="rounded-xl border-2 border-primary/30 bg-primary/5 p-3">
        <summary className="cursor-pointer text-sm font-semibold">
          {isAr ? "إعدادات متقدمة ومعلومات" : "Advanced settings & info"}
        </summary>
        <div className="mt-3 space-y-3">
          <div>
            <label className="block text-sm font-semibold">
              {isAr ? "نموذج الكلام" : "Speech model"}
            </label>
            <select
              value={t.cambSpeechModel}
              onChange={(e) => t.setCambSpeechModel(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
            >
              {CAMB_SPEECH_MODELS.map((o) => (
                <option key={o.value} value={o.value}>
                  {isAr ? o.ar : o.en}
                </option>
              ))}
            </select>
          </div>
          <Slider
            label={isAr ? "سرعة الكلام" : "Speaking rate"}
            value={t.cambSpeakingRate}
            min={0.5}
            max={2}
            step={0.05}
            onChange={t.setCambSpeakingRate}
          />
          {t.cambSpeechModel === "mars-instruct" && (
            <div>
              <label className="block text-sm font-semibold">
                {isAr ? "تعليمات الأسلوب (اختياري)" : "Style instructions (optional)"}
              </label>
              <input
                type="text"
                value={t.cambUserInstructions}
                onChange={(e) => t.setCambUserInstructions(e.target.value)}
                placeholder={
                  isAr ? "مثال: تكلم بحماس وسرعة معتدلة" : "e.g. Speak cheerfully and briskly"
                }
                className="mt-1 w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {isAr
                  ? "يمكنك أيضًا كتابة وسوم زي [excited] أو [speaking slowly] داخل النص نفسه مع هذا النموذج."
                  : "You can also add tags like [excited] or [speaking slowly] inside the text itself with this model."}
              </p>
            </div>
          )}
          <p className="text-xs leading-relaxed text-muted-foreground">
            {isAr
              ? "المفتاح لا يُحفظ ويُرسل مباشرة إلى CAMB.AI عند الاستماع فقط."
              : "Your key isn't saved anywhere and goes straight to CAMB.AI only when you press Listen."}
          </p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {isAr
              ? "لا تملك مفتاحًا؟ سجّل مجانًا على studio.camb.ai ثم اذهب إلى Settings → API Keys."
              : "No key yet? Sign up for free at studio.camb.ai then go to Settings → API Keys."}
          </p>
        </div>
      </details>
    </div>
  );
}

const AZURE_VOICES = [
  { id: "ar-EG-SalmaNeural", ar: "سلمى — عربي (مصر)", en: "Salma — Arabic (Egypt)" },
  { id: "ar-EG-ShakirNeural", ar: "شاكر — عربي (مصر)", en: "Shakir — Arabic (Egypt)" },
  { id: "ar-SA-HamedNeural", ar: "حامد — عربي (السعودية)", en: "Hamed — Arabic (Saudi Arabia)" },
  {
    id: "ar-SA-ZariyahNeural",
    ar: "زارية — عربي (السعودية)",
    en: "Zariyah — Arabic (Saudi Arabia)",
  },
  { id: "en-US-JennyNeural", ar: "Jenny — إنجليزي (أمريكا)", en: "Jenny — English (US)" },
  { id: "en-US-GuyNeural", ar: "Guy — إنجليزي (أمريكا)", en: "Guy — English (US)" },
  { id: "en-US-AriaNeural", ar: "Aria — إنجليزي (أمريكا)", en: "Aria — English (US)" },
  { id: "en-GB-SoniaNeural", ar: "Sonia — إنجليزي (بريطانيا)", en: "Sonia — English (UK)" },
  { id: "en-GB-RyanNeural", ar: "Ryan — إنجليزي (بريطانيا)", en: "Ryan — English (UK)" },
];

const AZURE_ROLES = [
  { value: "", ar: "بدون تحديد", en: "None" },
  { value: "YoungAdultFemale", ar: "أنثى — شابة", en: "Young adult female" },
  { value: "YoungAdultMale", ar: "ذكر — شاب", en: "Young adult male" },
  { value: "OlderAdultFemale", ar: "أنثى — أكبر سنًا", en: "Older adult female" },
  { value: "OlderAdultMale", ar: "ذكر — أكبر سنًا", en: "Older adult male" },
  { value: "Girl", ar: "طفلة", en: "Girl" },
  { value: "Boy", ar: "طفل", en: "Boy" },
];

const AZURE_REGIONS = [
  "eastus",
  "westus",
  "westus2",
  "westeurope",
  "northeurope",
  "uaenorth",
  "uksouth",
  "southeastasia",
];

const AZURE_STYLES = [
  { value: "", ar: "بدون تحديد", en: "None" },
  { value: "cheerful", ar: "مرح", en: "Cheerful" },
  { value: "sad", ar: "حزين", en: "Sad" },
  { value: "angry", ar: "غاضب", en: "Angry" },
  { value: "excited", ar: "متحمس", en: "Excited" },
  { value: "friendly", ar: "ودود", en: "Friendly" },
  { value: "whispering", ar: "هامس", en: "Whispering" },
];

function AzurePanel() {
  const t = useTTS();
  const isAr = t.locale === "ar";
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold">
        {isAr ? "مفتاح Azure API" : "Azure API key"}
      </label>
      <input
        type="password"
        value={t.azureKey}
        onChange={(e) => t.setAzureKey(e.target.value)}
        className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
      />

      <label className="block text-sm font-semibold">{isAr ? "المنطقة (Region)" : "Region"}</label>
      <input
        list="azure-regions"
        value={t.azureRegion}
        onChange={(e) => t.setAzureRegion(e.target.value)}
        placeholder="eastus"
        className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
      />
      <datalist id="azure-regions">
        {AZURE_REGIONS.map((r) => (
          <option key={r} value={r} />
        ))}
      </datalist>

      <label className="block text-sm font-semibold">{isAr ? "الصوت" : "Voice"}</label>
      <select
        value={t.azureVoice}
        onChange={(e) => t.setAzureVoice(e.target.value)}
        className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
      >
        {AZURE_VOICES.map((v) => (
          <option key={v.id} value={v.id}>
            {isAr ? v.ar : v.en} — {v.id}
          </option>
        ))}
      </select>

      <details className="rounded-xl border-2 border-primary/30 bg-primary/5 p-3">
        <summary className="cursor-pointer text-sm font-semibold">
          {isAr ? "إعدادات متقدمة ومعلومات" : "Advanced settings & info"}
        </summary>
        <div className="mt-3 space-y-3">
          <div>
            <label className="block text-sm font-semibold">{isAr ? "الأسلوب" : "Style"}</label>
            <select
              value={t.azureStyle}
              onChange={(e) => t.setAzureStyle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
            >
              {AZURE_STYLES.map((o) => (
                <option key={o.value} value={o.value}>
                  {isAr ? o.ar : o.en}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-muted-foreground">
              {isAr
                ? "بعض الأصوات لا تدعم كل الأساليب — إذا فشل الطلب جرّب بدون تحديد أسلوب."
                : "Not every voice supports every style — if the request fails, try leaving this unset."}
            </p>
          </div>
          {t.azureStyle && (
            <Slider
              label={isAr ? "قوة الأسلوب" : "Style intensity"}
              value={t.azureStyleDegree}
              min={0.01}
              max={2}
              step={0.01}
              onChange={t.setAzureStyleDegree}
            />
          )}
          <div>
            <label className="block text-sm font-semibold">
              {isAr ? "الشخصية (Role)" : "Role"}
            </label>
            <select
              value={t.azureRole}
              onChange={(e) => t.setAzureRole(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
            >
              {AZURE_ROLES.map((o) => (
                <option key={o.value} value={o.value}>
                  {isAr ? o.ar : o.en}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-muted-foreground">
              {isAr
                ? "تجعل الصوت يقلّد فئة عمرية أو جنسًا مختلفًا — وهذا مدعوم في بعض الأصوات الصينية والإنجليزية فقط."
                : "Makes the voice mimic a different age/gender — only supported by some Chinese and English voices."}
            </p>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {isAr
              ? "المفتاح لا يُحفظ ويُرسل مباشرة إلى Azure عند الاستماع فقط."
              : "Your key isn't saved anywhere and goes straight to Azure only when you press Listen."}
          </p>
          <div className="text-xs leading-relaxed text-muted-foreground">
            <p className="font-semibold text-foreground">
              {isAr ? "طريقة الحصول على المفتاح والمنطقة:" : "How to get your key and region:"}
            </p>
            <ol className="mt-1 list-decimal space-y-1 pr-4">
              <li>
                {isAr
                  ? "افتح portal.azure.com وسجّل دخول (أو أنشئ حساب مجاني)."
                  : "Open portal.azure.com and sign in (or create a free account)."}
              </li>
              <li>
                {isAr
                  ? "من البحث فوق، اكتب 'Speech services' وأنشئ مورد جديد (Create)."
                  : "Search for 'Speech services' at the top and click Create."}
              </li>
              <li>
                {isAr
                  ? "اختر Region (مثلاً eastus) — ده نفس الاسم اللي هتحطه في الحقل فوق."
                  : "Pick a Region (e.g. eastus) — this is the exact value to paste in the field above."}
              </li>
              <li>
                {isAr
                  ? "بعد إنشاء المورد، انتقل إلى 'Keys and Endpoint' وانسخ KEY 1."
                  : "After the resource is created, go to 'Keys and Endpoint' and copy KEY 1."}
              </li>
              <li>
                {isAr
                  ? "يوفر حساب Azure المجاني 500 ألف حرف مجانًا شهريًا للأصوات Neural."
                  : "The Azure free tier includes 500,000 characters per month for Neural voices."}
              </li>
            </ol>
          </div>
        </div>
      </details>
    </div>
  );
}

const POLLY_REGIONS = ["us-east-1", "us-west-2", "eu-west-1", "eu-central-1", "ap-southeast-1"];
const POLLY_ENGINES = [
  { value: "standard", ar: "عادي (Standard)", en: "Standard" },
  { value: "neural", ar: "عالي الجودة (Neural)", en: "Neural" },
  { value: "long-form", ar: "نصوص طويلة (Long-Form)", en: "Long-Form" },
  { value: "generative", ar: "توليدي (Generative)", en: "Generative" },
];
const POLLY_VOICES = ["Zeina", "Joanna", "Matthew", "Ivy", "Kendra", "Amy", "Brian"];

function PollyPanel() {
  const t = useTTS();
  const isAr = t.locale === "ar";
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold">
        {isAr ? "AWS Access Key ID" : "AWS Access Key ID"}
      </label>
      <input
        type="password"
        value={t.pollyAccessKey}
        onChange={(e) => t.setPollyAccessKey(e.target.value)}
        placeholder="AKIA..."
        className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
      />

      <label className="block text-sm font-semibold">
        {isAr ? "AWS Secret Access Key" : "AWS Secret Access Key"}
      </label>
      <input
        type="password"
        value={t.pollySecretKey}
        onChange={(e) => t.setPollySecretKey(e.target.value)}
        className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
      />

      <label className="block text-sm font-semibold">{isAr ? "المنطقة (Region)" : "Region"}</label>
      <input
        list="polly-regions"
        value={t.pollyRegion}
        onChange={(e) => t.setPollyRegion(e.target.value)}
        className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
      />
      <datalist id="polly-regions">
        {POLLY_REGIONS.map((r) => (
          <option key={r} value={r} />
        ))}
      </datalist>

      <label className="block text-sm font-semibold">{isAr ? "الصوت" : "Voice"}</label>
      <input
        list="polly-voices"
        value={t.pollyVoice}
        onChange={(e) => t.setPollyVoice(e.target.value)}
        className="w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
      />
      <datalist id="polly-voices">
        {POLLY_VOICES.map((v) => (
          <option key={v} value={v} />
        ))}
      </datalist>
      <p className="text-xs text-muted-foreground">
        {isAr
          ? "Zeina هو الصوت العربي المتاح، ويعمل فقط مع نوع المحرك Standard."
          : "Zeina is the Arabic voice, and only works with the Standard engine type."}
      </p>

      <details className="rounded-xl border-2 border-primary/30 bg-primary/5 p-3">
        <summary className="cursor-pointer text-sm font-semibold">
          {isAr ? "إعدادات متقدمة ومعلومات" : "Advanced settings & info"}
        </summary>
        <div className="mt-3 space-y-3">
          <div>
            <label className="block text-sm font-semibold">
              {isAr ? "نوع المحرك" : "Engine type"}
            </label>
            <select
              value={t.pollyEngine}
              onChange={(e) => t.setPollyEngine(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
            >
              {POLLY_ENGINES.map((o) => (
                <option key={o.value} value={o.value}>
                  {isAr ? o.ar : o.en}
                </option>
              ))}
            </select>
          </div>
          <p className="rounded-lg bg-destructive/10 p-2 text-xs leading-relaxed text-destructive">
            {isAr
              ? "تنبيه أمني: مفاتيح AWS أخطر من مفاتيح باقي المحركات، لأنها قد تمنح صلاحيات على حسابك بالكامل إذا لم تُقيَّد. اتّبع الخطوات أدناه بدقة لإنشاء مفتاح مقيّد بخدمة Polly فقط."
              : "Security note: AWS keys are riskier than other engines' keys — an unrestricted key can control your whole account. Follow the steps below exactly to create a key scoped to Polly only."}
          </p>
          <div className="text-xs leading-relaxed text-muted-foreground">
            <p className="font-semibold text-foreground">
              {isAr
                ? "طريقة إنشاء مفتاح آمن مقيّد بـ Polly فقط:"
                : "Creating a Polly-only key safely:"}
            </p>
            <ol className="mt-1 list-decimal space-y-1 pr-4">
              <li>
                {isAr
                  ? "افتح console.aws.amazon.com وسجّل دخول (أو أنشئ حسابًا مجانيًا)."
                  : "Open console.aws.amazon.com and sign in (or create a free account)."}
              </li>
              <li>
                {isAr
                  ? "من مربع البحث في الأعلى، اكتب 'IAM' وادخل إليها."
                  : "Search for 'IAM' at the top and open it."}
              </li>
              <li>
                {isAr
                  ? "من القائمة الجانبية Users → Create user، واختر اسمًا مثل voxly-polly."
                  : "In the sidebar go to Users → Create user, and give it a name like voxly-polly."}
              </li>
              <li>
                {isAr
                  ? "في خطوة الصلاحيات، اختر 'Attach policies directly' وابحث عن AmazonPollyReadOnlyAccess وحددها (تكفي للتحويل النصي للصوت فقط)."
                  : "At the permissions step, choose 'Attach policies directly', search for AmazonPollyReadOnlyAccess, and select it (enough for text-to-speech only)."}
              </li>
              <li>
                {isAr
                  ? "بعد إنشاء المستخدم، افتحه → Security credentials → Create access key → اختر 'Application running outside AWS'."
                  : "After creating the user, open it → Security credentials → Create access key → choose 'Application running outside AWS'."}
              </li>
              <li>
                {isAr
                  ? "انسخ Access Key ID وSecret Access Key فورًا (لن يظهر المفتاح السري مرة أخرى بعد ذلك)."
                  : "Copy the Access Key ID and Secret Access Key immediately — the secret won't be shown again."}
              </li>
            </ol>
          </div>
        </div>
      </details>
    </div>
  );
}
