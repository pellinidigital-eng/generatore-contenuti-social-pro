"use client";

import { Clipboard, Loader2, Sparkles } from "lucide-react";
import { FormEvent, type ReactNode, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { GenerateSocialInput, Platform, SocialContent } from "@/lib/types";
import { goals, platforms, tones } from "@/lib/validation";
import { cn } from "@/lib/utils";

const ERROR_MESSAGE = "Si e verificato un errore nella generazione. Riprova tra qualche secondo.";

const platformStyles: Record<Platform, string> = {
  Instagram: "border-pink-300 bg-gradient-to-br from-pink-50 via-orange-50 to-purple-50 text-pink-950 ring-pink-200",
  TikTok: "border-cyan-300 bg-gradient-to-br from-cyan-50 via-white to-rose-50 text-cyan-950 ring-cyan-200",
  Facebook: "border-blue-300 bg-blue-50 text-blue-950 ring-blue-200",
  YouTube: "border-red-300 bg-red-50 text-red-950 ring-red-200"
};

const initialForm: GenerateSocialInput = {
  description: "",
  platform: "Instagram",
  tone: "diretto",
  goal: "vendere"
};

export function SocialContentGenerator() {
  const [form, setForm] = useState<GenerateSocialInput>(initialForm);
  const [content, setContent] = useState<SocialContent | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedSection, setCopiedSection] = useState("");

  const canSubmit = form.description.trim().length >= 12 && !isLoading;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setContent(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-social", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error("Generation failed");
      }

      const data = (await response.json()) as SocialContent;
      setContent(data);
    } catch {
      setError(ERROR_MESSAGE);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
        <section className="rounded-[2rem] border border-white/70 bg-white/88 p-5 shadow-soft backdrop-blur sm:p-7 lg:sticky lg:top-6">
          <div className="mb-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-gray-600">
              <Sparkles className="h-4 w-4 text-orange-500" />
              AI Social Studio
            </div>
            <h1 className="text-3xl font-black leading-tight text-gray-950 sm:text-4xl">
              Generatore Contenuti Social PRO
            </h1>
            <p className="mt-3 text-base leading-7 text-gray-600">
              Crea hook, caption, caroselli e CTA specifici per la tua nicchia con una route AI sicura lato server.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <Textarea
              label="Descrizione prodotto, nicchia o idea"
              placeholder="Esempio: centro estetico a Milano che vuole aumentare prenotazioni per trattamenti viso tramite Instagram..."
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
            />

            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-gray-800">Piattaforma</legend>
              <div className="grid grid-cols-2 gap-3">
                {platforms.map((platform) => {
                  const selected = form.platform === platform;

                  return (
                    <button
                      className={cn(
                        "min-h-20 rounded-2xl border p-3 text-left text-sm font-bold transition focus:outline-none focus:ring-4",
                        platformStyles[platform],
                        selected ? "scale-[1.01] shadow-md ring-4" : "hover:-translate-y-0.5 hover:shadow-sm"
                      )}
                      key={platform}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setForm((current) => ({ ...current, platform }))}
                    >
                      <span className="block text-base">{platform}</span>
                      <span className="mt-2 block text-xs font-semibold opacity-70">
                        {selected ? "Selezionata" : "Tocca per scegliere"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Tono"
                value={form.tone}
                onChange={(event) => setForm((current) => ({ ...current, tone: event.target.value as GenerateSocialInput["tone"] }))}
              >
                {tones.map((tone) => (
                  <option key={tone} value={tone}>
                    {tone}
                  </option>
                ))}
              </Select>

              <Select
                label="Obiettivo"
                value={form.goal}
                onChange={(event) => setForm((current) => ({ ...current, goal: event.target.value as GenerateSocialInput["goal"] }))}
              >
                {goals.map((goal) => (
                  <option key={goal} value={goal}>
                    {goal}
                  </option>
                ))}
              </Select>
            </div>

            <Button className="w-full text-base" disabled={!canSubmit} type="submit">
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
              {isLoading ? "Generazione in corso..." : "Genera contenuti con AI"}
            </Button>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold leading-6 text-red-800">
                {error}
              </div>
            ) : null}
          </form>
        </section>

        <OutputPanel
          content={content}
          copiedSection={copiedSection}
          isLoading={isLoading}
          onCopy={async (section, text) => {
            await navigator.clipboard.writeText(text);
            setCopiedSection(section);
            window.setTimeout(() => setCopiedSection(""), 1600);
          }}
        />
      </div>
    </main>
  );
}

function OutputPanel({
  content,
  copiedSection,
  isLoading,
  onCopy
}: {
  content: SocialContent | null;
  copiedSection: string;
  isLoading: boolean;
  onCopy: (section: string, text: string) => Promise<void>;
}) {
  const copyText = useMemo(() => (content ? buildCopyText(content) : null), [content]);

  if (isLoading) {
    return (
      <section className="grid min-h-[28rem] place-items-center rounded-[2rem] border border-white/70 bg-white/75 p-8 shadow-soft backdrop-blur">
        <div className="text-center">
          <Loader2 className="mx-auto h-9 w-9 animate-spin text-gray-900" />
          <p className="mt-4 text-lg font-bold text-gray-950">Sto generando contenuti specifici...</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-gray-600">
            La risposta arriva dalla route interna server-side, senza chiavi esposte nel frontend.
          </p>
        </div>
      </section>
    );
  }

  if (!content || !copyText) {
    return (
      <section className="grid min-h-[28rem] place-items-center rounded-[2rem] border border-dashed border-gray-300 bg-white/60 p-8 text-center backdrop-blur">
        <div>
          <p className="text-xl font-black text-gray-950">Il tuo piano social apparira qui.</p>
          <p className="mt-3 max-w-md text-sm leading-6 text-gray-600">
            Compila i campi e genera contenuti pronti da adattare, pubblicare o passare al tuo team.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5 break-words">
      <ResultSection
        copied={copiedSection === "hooks"}
        title="Hook"
        onCopy={() => onCopy("hooks", copyText.hooks)}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {content.hooks.map((hook) => (
            <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm" key={hook.angle}>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-orange-600">{hook.angle}</p>
              <p className="mt-2 text-sm font-semibold leading-6 text-gray-950">{hook.text}</p>
            </article>
          ))}
        </div>
      </ResultSection>

      <ResultSection
        copied={copiedSection === "captions"}
        title="Caption"
        onCopy={() => onCopy("captions", copyText.captions)}
      >
        <div className="space-y-4">
          {content.captions.map((caption) => (
            <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm" key={caption.type}>
              <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-600">{caption.type}</p>
              <h2 className="mt-2 text-lg font-black leading-tight text-gray-950">{caption.title}</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-700">{caption.text}</p>
            </article>
          ))}
        </div>
      </ResultSection>

      <ResultSection
        copied={copiedSection === "carousel"}
        title="Carosello"
        onCopy={() => onCopy("carousel", copyText.carousel)}
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {content.carousel.map((slide) => (
            <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm" key={slide.slide}>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-black text-gray-950">Slide {slide.slide}</p>
                <p className="rounded-full bg-gray-100 px-3 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-gray-600">
                  {slide.role}
                </p>
              </div>
              <p className="mt-3 text-sm font-semibold leading-6 text-gray-800">{slide.text}</p>
            </article>
          ))}
        </div>
      </ResultSection>

      <ResultSection copied={copiedSection === "ctas"} title="CTA" onCopy={() => onCopy("ctas", copyText.ctas)}>
        <div className="space-y-3">
          {content.ctas.map((cta, index) => (
            <p className="rounded-2xl border border-gray-200 bg-white p-4 text-sm font-semibold leading-6 text-gray-900 shadow-sm" key={cta}>
              {index + 1}. {cta}
            </p>
          ))}
        </div>
      </ResultSection>
    </section>
  );
}

function ResultSection({
  children,
  copied,
  onCopy,
  title
}: {
  children: ReactNode;
  copied: boolean;
  onCopy: () => void;
  title: string;
}) {
  return (
    <div className="rounded-[2rem] border border-white/70 bg-white/85 p-4 shadow-soft backdrop-blur sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-2xl font-black text-gray-950">{title}</h2>
        <Button className="shrink-0" variant="secondary" onClick={onCopy}>
          <Clipboard className="h-4 w-4" />
          {copied ? "Copiato" : "Copia"}
        </Button>
      </div>
      {children}
    </div>
  );
}

function buildCopyText(content: SocialContent) {
  return {
    hooks: content.hooks.map((hook) => `${hook.angle}: ${hook.text}`).join("\n"),
    captions: content.captions.map((caption) => `${caption.type.toUpperCase()}\n${caption.title}\n${caption.text}`).join("\n\n"),
    carousel: content.carousel.map((slide) => `Slide ${slide.slide} - ${slide.role}\n${slide.text}`).join("\n\n"),
    ctas: content.ctas.join("\n")
  };
}
