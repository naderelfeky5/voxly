import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useTTS } from "@/contexts/tts-context";

export const Route = createFileRoute("/")({
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
  const { locale, setLocale, theme, toggleTheme } = useTTS();
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
          {theme === "light" ? "🌙" : "☀️"}
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
  const { rate, setRate, pitch, setPitch, volume, setVolume, engine, locale } = useTTS();
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
      {engine !== "browser" && (
        <p className="rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
          {locale === "ar"
            ? "طبقة الصوت غير متاحة إلا في وضع صوت المتصفح المجاني (السرعة والصوت لا يزالان يعملان في الوضعين الآخرين)."
            : "Pitch is only available in the free browser voice mode."}
        </p>
      )}
    </div>
  );
}

function EngineTabs() {
  const { engine, setEngine, locale } = useTTS();
  const tabs: { id: typeof engine; ar: string; en: string }[] = [
    { id: "browser", ar: "صوت المتصفح (مجاني)", en: "Browser voice (free)" },
    {
      id: "elevenlabs",
      ar: "ElevenLabs",
      en: "High quality (ElevenLabs)",
    },
    { id: "gemini", ar: "Google Gemini TTS", en: "Google Gemini TTS" },
  ];
  return (
    <div className="mt-8 flex flex-wrap gap-2 rounded-2xl bg-muted p-1.5">
      {tabs.map((t) => {
        const active = engine === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setEngine(t.id)}
            className={`flex-1 rounded-xl px-3 py-2 text-sm font-semibold transition ${
              active
                ? "bg-card text-foreground shadow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {locale === "ar" ? t.ar : t.en}
          </button>
        );
      })}
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
    </div>
  );
}

function BrowserPanel() {
  const { browserVoices, browserVoiceURI, setBrowserVoiceURI, locale } = useTTS();
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold">
        {locale === "ar" ? "الصوت" : "Voice"}
      </label>
      {browserVoices.length === 0 ? (
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
        <div className="space-y-4 rounded-2xl border border-border bg-muted/40 p-4">
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

      <details className="rounded-xl border border-border p-3">
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
    value: "بصوت حماسي وسريع الإيقاع، زي إعلان تجاري",
    ar: "إعلان حماسي",
    en: "Excited ad",
  },
  {
    value: "بصوت دافئ وبطيء وحنون، زي قصة قبل النوم لطفل",
    ar: "قصة أطفال",
    en: "Bedtime story",
  },
  { value: "بصوت رسمي وواضح، زي مذيع نشرة أخبار", ar: "نشرة أخبار", en: "News anchor" },
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
          ? "يشتغل"
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
