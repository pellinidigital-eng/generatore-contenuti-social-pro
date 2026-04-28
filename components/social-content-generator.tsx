"use client";

import { type Dispatch, type FormEvent, type ReactNode, type SetStateAction, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Platform = "Instagram" | "TikTok" | "Facebook" | "YouTube Shorts" | "LinkedIn";
type Goal = "vendere" | "ottenere contatti" | "aumentare engagement" | "educare" | "creare fiducia";
type Tone = "diretto" | "educativo" | "persuasivo" | "amichevole" | "professionale" | "motivazionale";
type ContentType = "reel" | "carosello" | "post" | "storia" | "video breve";

type GeneratorForm = {
  niche: string;
  offer: string;
  audience: string;
  problem: string;
  desiredResult: string;
  platform: Platform;
  goal: Goal;
  tone: Tone;
  contentType: ContentType;
};

type GeneratedContent = {
  hooks: string[];
  captions: { title: string; text: string }[];
  ctas: string[];
  reel: {
    duration: string;
    scenes: { time: string; scene: string; screenText: string; voiceover: string; visual: string }[];
  };
  carousel: { slide: number; role: string; title: string; text: string; visual: string }[];
  ideas: string[];
  angles: { title: string; description: string }[];
  mistakes: string[];
};

const platforms: Platform[] = ["Instagram", "TikTok", "Facebook", "YouTube Shorts", "LinkedIn"];
const goals: Goal[] = ["vendere", "ottenere contatti", "aumentare engagement", "educare", "creare fiducia"];
const tones: Tone[] = ["diretto", "educativo", "persuasivo", "amichevole", "professionale", "motivazionale"];
const contentTypes: ContentType[] = ["reel", "carosello", "post", "storia", "video breve"];

const initialForm: GeneratorForm = {
  niche: "",
  offer: "",
  audience: "",
  problem: "",
  desiredResult: "",
  platform: "Instagram",
  goal: "vendere",
  tone: "diretto",
  contentType: "reel"
};

const platformStyles: Record<Platform, string> = {
  Instagram: "border-pink-300 bg-gradient-to-br from-pink-50 via-orange-50 to-purple-50 text-pink-950 ring-pink-200",
  TikTok: "border-cyan-300 bg-gradient-to-br from-cyan-50 via-white to-rose-50 text-cyan-950 ring-cyan-200",
  Facebook: "border-blue-300 bg-blue-50 text-blue-950 ring-blue-200",
  "YouTube Shorts": "border-red-300 bg-red-50 text-red-950 ring-red-200",
  LinkedIn: "border-sky-300 bg-sky-50 text-sky-950 ring-sky-200"
};

export function SocialContentGenerator() {
  const [form, setForm] = useState<GeneratorForm>(initialForm);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedSection, setCopiedSection] = useState("");

  const canSubmit = Object.values(form).every((value) => value.trim().length > 0) && !isLoading;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    setContent(null);
    setIsLoading(true);

    window.setTimeout(() => {
      setContent(generateLocalContent(form));
      setIsLoading(false);
    }, 1400);
  }

  async function handleCopy(section: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopiedSection(section);
    window.setTimeout(() => setCopiedSection(""), 1600);
  }

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[0.86fr_1.14fr] lg:items-start">
        <section className="rounded-[2rem] border border-white/70 bg-white/90 p-5 shadow-soft backdrop-blur sm:p-7 lg:sticky lg:top-6">
          <div className="mb-6">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-gray-600">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              Social Content Studio
            </div>
            <h1 className="text-3xl font-black leading-tight text-gray-950 sm:text-4xl">
              Generatore Contenuti Social PRO
            </h1>
            <p className="mt-3 text-base leading-7 text-gray-600">
              Inserisci contesto reale: il generatore userà nicchia, offerta, pubblico, problema e risultato per creare una base completa e pronta da adattare.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nicchia / settore" value={form.niche} placeholder="Es. prodotti digitali, estetica, fitness, consulenza..." onChange={(value) => setFormField(setForm, "niche", value)} />
              <Field label="Prodotto, servizio o idea" value={form.offer} placeholder="Es. generatore contenuti social, trattamento viso, corso online..." onChange={(value) => setFormField(setForm, "offer", value)} />
            </div>

            <Textarea
              label="Pubblico target"
              placeholder="Es. freelance e creator che vendono online ma non hanno un piano editoriale chiaro"
              value={form.audience}
              onChange={(event) => setFormField(setForm, "audience", event.target.value)}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Textarea
                label="Problema principale del pubblico"
                placeholder="Es. non sa cosa pubblicare e perde tempo ogni giorno davanti al calendario vuoto"
                value={form.problem}
                onChange={(event) => setFormField(setForm, "problem", event.target.value)}
              />
              <Textarea
                label="Risultato desiderato"
                placeholder="Es. creare contenuti velocemente, sentirsi più sicuro e pubblicare con costanza"
                value={form.desiredResult}
                onChange={(event) => setFormField(setForm, "desiredResult", event.target.value)}
              />
            </div>

            <fieldset>
              <legend className="mb-3 text-sm font-semibold text-gray-800">Piattaforma</legend>
              <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
                {platforms.map((platform) => {
                  const selected = form.platform === platform;

                  return (
                    <button
                      className={cn(
                        "min-h-16 rounded-2xl border p-3 text-left text-sm font-bold transition focus:outline-none focus:ring-4",
                        platformStyles[platform],
                        selected ? "scale-[1.01] shadow-md ring-4" : "hover:-translate-y-0.5 hover:shadow-sm"
                      )}
                      key={platform}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setFormField(setForm, "platform", platform)}
                    >
                      <span className="block text-base">{platform}</span>
                      <span className="mt-1 block text-xs font-semibold opacity-70">{selected ? "Selezionata" : "Tocca per scegliere"}</span>
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="grid gap-4 sm:grid-cols-3">
              <Select label="Obiettivo" value={form.goal} onChange={(event) => setFormField(setForm, "goal", event.target.value as Goal)}>
                {goals.map((goal) => <option key={goal} value={goal}>{goal}</option>)}
              </Select>
              <Select label="Tono" value={form.tone} onChange={(event) => setFormField(setForm, "tone", event.target.value as Tone)}>
                {tones.map((tone) => <option key={tone} value={tone}>{tone}</option>)}
              </Select>
              <Select label="Tipo contenuto" value={form.contentType} onChange={(event) => setFormField(setForm, "contentType", event.target.value as ContentType)}>
                {contentTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </Select>
            </div>

            <Button className="w-full text-base sm:text-lg" disabled={!canSubmit} type="submit">
              {isLoading ? <Spinner /> : null}
              {isLoading ? "Sto creando i tuoi contenuti..." : "Genera contenuti"}
            </Button>
          </form>

          <p className="mt-5 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-700">
            Questo tool genera una base strategica pronta da usare. Per ottenere il massimo risultato, personalizza sempre i testi con il tuo tono, la tua esperienza e il tuo modo di comunicare.
          </p>
        </section>

        <OutputPanel content={content} copiedSection={copiedSection} isLoading={isLoading} onCopy={handleCopy} />
      </div>
    </main>
  );
}

function Field({ label, onChange, placeholder, value }: { label: string; onChange: (value: string) => void; placeholder: string; value: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-gray-800">{label}</span>
      <input
        className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-base text-gray-950 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-4 focus:ring-gray-200"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function OutputPanel({
  content,
  copiedSection,
  isLoading,
  onCopy
}: {
  content: GeneratedContent | null;
  copiedSection: string;
  isLoading: boolean;
  onCopy: (section: string, text: string) => Promise<void>;
}) {
  const copyText = useMemo(() => (content ? buildCopyText(content) : null), [content]);

  if (isLoading) {
    return (
      <section className="grid min-h-[22rem] place-items-center rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-soft backdrop-blur">
        <div className="text-center">
          <div className="mx-auto"><Spinner size="large" /></div>
          <p className="mt-4 text-xl font-black text-gray-950">Sto creando i tuoi contenuti...</p>
          <p className="mt-2 max-w-md text-base leading-7 text-gray-600">Organizzo hook, caption, CTA, reel, carosello e angoli di comunicazione in base ai dati inseriti.</p>
        </div>
      </section>
    );
  }

  if (!content || !copyText) return null;

  return (
    <section className="space-y-5 break-words">
      <div className="rounded-[2rem] border border-gray-900 bg-gray-950 p-5 text-white shadow-soft">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-300">Output generato</p>
            <h2 className="mt-1 text-2xl font-black">Piano contenuti pronto da adattare</h2>
          </div>
          <Button className="bg-white text-gray-950 hover:bg-gray-100" onClick={() => onCopy("all", copyText.all)}>
            {copiedSection === "all" ? "Copiato" : "Copia tutto"}
          </Button>
        </div>
      </div>

      <ResultSection copied={copiedSection === "hooks"} title="10 Hook specifici" onCopy={() => onCopy("hooks", copyText.hooks)}>
        <NumberedList items={content.hooks} />
      </ResultSection>

      <ResultSection copied={copiedSection === "captions"} title="5 Caption complete" onCopy={() => onCopy("captions", copyText.captions)}>
        <div className="space-y-4">
          {content.captions.map((caption, index) => (
            <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm" key={caption.title}>
              <p className="text-sm font-black text-blue-700">Caption {index + 1}</p>
              <h3 className="mt-2 text-lg font-black leading-tight text-gray-950">{caption.title}</h3>
              <p className="mt-3 whitespace-pre-line text-base leading-8 text-gray-700">{caption.text}</p>
            </article>
          ))}
        </div>
      </ResultSection>

      <ResultSection copied={copiedSection === "ctas"} title="5 CTA diverse" onCopy={() => onCopy("ctas", copyText.ctas)}>
        <NumberedList items={content.ctas} />
      </ResultSection>

      <ResultSection copied={copiedSection === "reel"} title="Struttura reel / video breve" onCopy={() => onCopy("reel", copyText.reel)}>
        <p className="mb-4 rounded-2xl bg-orange-50 p-4 text-base font-bold text-orange-900">Durata consigliata: {content.reel.duration}</p>
        <div className="space-y-3">
          {content.reel.scenes.map((scene) => (
            <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm" key={scene.time}>
              <p className="text-sm font-black text-orange-700">{scene.time}</p>
              <h3 className="mt-2 text-base font-black text-gray-950">{scene.scene}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-700"><strong>Testo a schermo:</strong> {scene.screenText}</p>
              <p className="mt-2 text-sm leading-6 text-gray-700"><strong>Voce narrante:</strong> {scene.voiceover}</p>
              <p className="mt-2 text-sm leading-6 text-gray-700"><strong>Visual:</strong> {scene.visual}</p>
            </article>
          ))}
        </div>
      </ResultSection>

      <ResultSection copied={copiedSection === "carousel"} title="Carosello da 7 slide" onCopy={() => onCopy("carousel", copyText.carousel)}>
        <div className="grid gap-3 sm:grid-cols-2">
          {content.carousel.map((slide) => (
            <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm" key={slide.slide}>
              <p className="text-sm font-black text-gray-950">Slide {slide.slide}: {slide.role}</p>
              <h3 className="mt-2 text-base font-black text-gray-950">{slide.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-700">{slide.text}</p>
              <p className="mt-3 rounded-xl bg-gray-50 p-3 text-sm leading-6 text-gray-600"><strong>Visual:</strong> {slide.visual}</p>
            </article>
          ))}
        </div>
      </ResultSection>

      <ResultSection copied={copiedSection === "ideas"} title="5 Idee contenuto aggiuntive" onCopy={() => onCopy("ideas", copyText.ideas)}>
        <NumberedList items={content.ideas} />
      </ResultSection>

      <ResultSection copied={copiedSection === "angles"} title="3 Angoli di comunicazione" onCopy={() => onCopy("angles", copyText.angles)}>
        <div className="space-y-3">
          {content.angles.map((angle) => (
            <article className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm" key={angle.title}>
              <h3 className="text-base font-black text-gray-950">{angle.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-700">{angle.description}</p>
            </article>
          ))}
        </div>
      </ResultSection>

      <ResultSection copied={copiedSection === "mistakes"} title="3 Errori da evitare" onCopy={() => onCopy("mistakes", copyText.mistakes)}>
        <NumberedList items={content.mistakes} />
      </ResultSection>
    </section>
  );
}

function ResultSection({ children, copied, onCopy, title }: { children: ReactNode; copied: boolean; onCopy: () => void; title: string }) {
  return (
    <div className="rounded-[2rem] border border-white/70 bg-white/90 p-4 shadow-soft backdrop-blur sm:p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-black leading-tight text-gray-950">{title}</h2>
        <Button className="w-full shrink-0 sm:w-auto" variant="secondary" onClick={onCopy}>
          {copied ? "Copiato" : "Copia questo blocco"}
        </Button>
      </div>
      {children}
    </div>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <p className="rounded-2xl border border-gray-200 bg-white p-4 text-base font-semibold leading-7 text-gray-900 shadow-sm" key={`${item}-${index}`}>
          {index + 1}. {item}
        </p>
      ))}
    </div>
  );
}

function Spinner({ size = "normal" }: { size?: "normal" | "large" }) {
  return (
    <span
      className={cn(
        "inline-block animate-spin rounded-full border-2 border-current border-t-transparent",
        size === "large" ? "h-10 w-10 text-gray-900" : "h-5 w-5"
      )}
      aria-hidden="true"
    />
  );
}

function setFormField<Key extends keyof GeneratorForm>(
  setForm: Dispatch<SetStateAction<GeneratorForm>>,
  key: Key,
  value: GeneratorForm[Key]
) {
  setForm((current) => ({ ...current, [key]: value }));
}

function generateLocalContent(form: GeneratorForm): GeneratedContent {
  const data = normalizeForm(form);
  const hooks = buildHooks(data);
  const captions = buildCaptions(data);
  const ctas = buildCtas(data);

  return {
    hooks,
    captions,
    ctas,
    reel: buildReel(data),
    carousel: buildCarousel(data),
    ideas: buildIdeas(data),
    angles: buildAngles(data),
    mistakes: buildMistakes(data)
  };
}

function normalizeForm(form: GeneratorForm) {
  return {
    niche: clean(form.niche),
    offer: clean(form.offer),
    audience: clean(form.audience),
    problem: clean(form.problem),
    result: clean(form.desiredResult),
    platform: form.platform,
    goal: form.goal,
    tone: form.tone,
    contentType: form.contentType,
    opener: toneOpener(form.tone)
  };
}

function buildHooks(d: ReturnType<typeof normalizeForm>) {
  return [
    `Se lavori in ${d.niche} e il tuo pubblico sente che ${d.problem}, ${d.offer} può diventare il punto di partenza per aiutarlo a ${d.result} senza perdere altro tempo su ${d.platform}.`,
    `L'errore più comune in ${d.niche}: parlare del prodotto prima di mostrare a ${d.audience} come uscire da "${d.problem}". Parti da questo, poi presenta ${d.offer}.`,
    `${capitalize(d.audience)}: quanto tempo stai ancora perdendo perché ${d.problem}? Questo ${d.contentType} ti mostra come avvicinarti a ${d.result} con ${d.offer}.`,
    `Prima: ${d.problem}. Dopo: un percorso più chiaro per ${d.result}. Nel mezzo c'è ${d.offer}, spiegato in modo ${d.tone} per ${d.platform}.`,
    `Mito da sfatare in ${d.niche}: non serve comunicare di più, serve comunicare meglio il legame tra ${d.problem}, ${d.offer} e ${d.result}.`,
    `Se continui a rimandare i contenuti su ${d.platform}, il problema non è la creatività: è che non stai partendo dal dolore reale di ${d.audience}, cioè ${d.problem}.`,
    `Vuoi ${d.result}? Allora smetti di creare contenuti generici e usa ${d.offer} per mostrare a ${d.audience} un passaggio concreto da applicare subito.`,
    `La paura nascosta di ${d.audience} non è comprare ${d.offer}: è restare bloccato in "${d.problem}" senza vedere una strada credibile verso ${d.result}.`,
    `C'è un'opportunità enorme per chi opera in ${d.niche}: trasformare ogni contenuto su ${d.platform} in una risposta pratica al problema "${d.problem}".`,
    `Salva questo ${d.contentType}: ti aiuta a spiegare ${d.offer} a ${d.audience} partendo da ciò che conta davvero, cioè ${d.result}.`
  ];
}

function buildCaptions(d: ReturnType<typeof normalizeForm>) {
  const bases = [
    {
      title: `Da "${d.problem}" a "${d.result}"`,
      angle: `Molte persone nel mondo ${d.niche} pensano di dover semplicemente pubblicare di più su ${d.platform}. In realtà, se il pubblico vive il problema "${d.problem}", un contenuto in più non basta: serve un messaggio che faccia capire subito perché ${d.offer} è collegato al risultato che desidera.`
    },
    {
      title: `Il messaggio che ${d.audience} deve sentire`,
      angle: `Quando parli a ${d.audience}, il punto non è riempire il post di caratteristiche. Il punto è far riconoscere il momento esatto in cui nasce il problema: ${d.problem}. Solo dopo puoi introdurre ${d.offer} come soluzione concreta e credibile.`
    },
    {
      title: `Perché il tuo contenuto non deve sembrare una vendita`,
      angle: `Un contenuto efficace per ${d.platform} non forza la decisione. Accompagna. Parte da una situazione reale, mostra cosa sta bloccando ${d.audience}, spiega un passaggio semplice e poi collega tutto a ${d.offer}.`
    },
    {
      title: `Una prospettiva più utile per ${d.niche}`,
      angle: `Il tuo pubblico non cerca solo informazioni: cerca sollievo, chiarezza e un modo più semplice per avvicinarsi a ${d.result}. Se comunichi ${d.offer} partendo da questo, il contenuto diventa subito più rilevante.`
    },
    {
      title: `Il contenuto che crea fiducia prima della CTA`,
      angle: `Prima di chiedere un'azione, devi far sentire a ${d.audience} che hai capito il problema. Nel tuo caso significa nominare ${d.problem}, spiegare perché succede e mostrare come ${d.offer} può aiutare a costruire ${d.result}.`
    },
    {
      title: `Il ponte tra bisogno e decisione`,
      angle: `Nel settore ${d.niche}, il pubblico non decide solo perché vede un'offerta. Decide quando capisce che quella proposta parla del suo problema reale: ${d.problem}. Per questo ${d.offer} deve essere presentato come ponte tra la situazione attuale e ${d.result}.`
    },
    {
      title: `La caption che parte dalla vita reale`,
      angle: `Un buon contenuto per ${d.platform} deve sembrare scritto per una persona precisa. Nel tuo caso quella persona è ${d.audience}, con una frustrazione chiara: ${d.problem}. Se parti da qui, il messaggio diventa subito più credibile.`
    },
    {
      title: `Il modo più semplice per spiegare ${d.offer}`,
      angle: `Se provi a spiegare tutto, rischi di confondere. Se invece parti da un solo problema, "${d.problem}", puoi mostrare in modo ${d.tone} perché ${d.offer} aiuta ${d.audience} ad avvicinarsi a ${d.result}.`
    },
    {
      title: `Una vendita più naturale`,
      angle: `Vendere su ${d.platform} non significa spingere. Significa far vedere a ${d.audience} che hai compreso il blocco, che sai perché ${d.problem} pesa nella quotidianità e che ${d.offer} può essere una scelta sensata.`
    },
    {
      title: `Da contenuto qualsiasi a contenuto utile`,
      angle: `La differenza tra un contenuto ignorato e uno salvato sta nella specificità. Se parli di ${d.niche}, cita ${d.audience}, nomina ${d.problem} e collega il tutto a un risultato concreto: ${d.result}.`
    }
  ];

  return rotate(bases, seedFrom(d)).slice(0, 5).map((base, index) => ({
    title: base.title,
    text: `${base.angle}

Il primo passo è rendere specifico il contenuto: non parlare a "tutti", parla a ${d.audience}. Usa esempi vicini alla loro giornata, alle obiezioni che hanno prima di fidarsi e al fastidio concreto che provano quando ${d.problem}. Su ${d.platform}, questo è ancora più importante perché l'attenzione è breve e le persone decidono in pochi secondi se continuare a leggere o scorrere oltre.

Con un tono ${d.tone}, puoi spiegare ${d.offer} senza sembrare freddo o generico: parti dal problema, mostra una conseguenza concreta, poi presenta un piccolo cambio di prospettiva. Per esempio: "non ti manca solo tempo, ti manca una struttura che trasformi le idee in contenuti pubblicabili". Questo rende il beneficio più chiaro e collega il tuo lavoro al risultato desiderato: ${d.result}.

Il beneficio concreto è che ${d.audience} non percepisce più ${d.offer} come una cosa astratta, ma come un aiuto pratico per uscire da una situazione frustrante. Se l'obiettivo è ${d.goal}, chiudi con una CTA coerente: invita a salvare, commentare, scrivere in privato o chiedere informazioni, senza promettere risultati garantiti.

CTA: ${captionCta(d, index)}`
  }));
}

function buildCtas(d: ReturnType<typeof normalizeForm>) {
  const ctas = [
    `Scrivimi "${keyword(d)}" se vuoi capire come usare ${d.offer} per avvicinarti a ${d.result}.`,
    `Salva questo contenuto se lavori in ${d.niche} e vuoi smettere di restare bloccato su "${d.problem}".`,
    `Commenta con la tua difficoltà principale su ${d.platform}: ti rispondo con uno spunto pratico per ${d.result}.`,
    `Se sei ${d.audience} e vuoi una strada più chiara, parti da ${d.offer} e chiedimi informazioni.`,
    `Condividilo con qualcuno che opera in ${d.niche} e sta ancora cercando di risolvere "${d.problem}".`,
    `Vuoi trasformare ${d.problem} in un contenuto più forte? Usa questo schema e adattalo a ${d.offer}.`,
    `Mandami un messaggio se vuoi comunicare ${d.offer} con un tono più ${d.tone} e meno generico.`,
    `Salva questa traccia: è pensata per ${d.audience} che vuole ${d.result} senza comunicare a caso.`,
    `Usala per il tuo prossimo ${d.contentType} su ${d.platform} e parti dal problema, non dalla promozione.`,
    `Se questo parla della tua situazione, il prossimo passo è rendere ${d.offer} ancora più specifico per ${d.audience}.`
  ];

  return rotate(ctas, seedFrom(d)).slice(0, 5);
}

function buildReel(d: ReturnType<typeof normalizeForm>) {
  return {
    duration: d.platform === "LinkedIn" ? "35-50 secondi" : "18-28 secondi",
    scenes: [
      {
        time: "0-2 secondi",
        scene: "Apertura con problema riconoscibile",
        screenText: `${capitalize(d.problem)}?`,
        voiceover: `${d.opener} Se sei ${d.audience}, probabilmente conosci bene questo problema: ${d.problem}.`,
        visual: `Primo piano, gesto rapido o schermata che mostra il blocco concreto legato a ${d.niche}.`
      },
      {
        time: "2-5 secondi",
        scene: "Conseguenza concreta",
        screenText: `Il rischio: restare fermo`,
        voiceover: `Il punto è che finché questo resta confuso, diventa difficile arrivare a ${d.result}, anche se l'offerta è valida.`,
        visual: `Mostra una checklist incompleta, un calendario vuoto o un esempio reale del problema vissuto da ${d.audience}.`
      },
      {
        time: "5-8 secondi",
        scene: "Cambio di prospettiva",
        screenText: `Parti dal problema, non dal prodotto`,
        voiceover: `Invece di spiegare subito ${d.offer}, parti dalla situazione che il pubblico vive ogni giorno e collega la soluzione a un beneficio pratico.`,
        visual: `Taglio veloce con tre parole chiave: problema, soluzione, risultato.`
      },
      {
        time: "Finale",
        scene: "CTA coerente con l'obiettivo",
        screenText: `${capitalize(d.result)} con più chiarezza`,
        voiceover: `Se vuoi usare ${d.offer} per aiutare ${d.audience} a ${d.result}, salva questo video o scrivimi per saperne di più.`,
        visual: `Schermata finale pulita con CTA grande, riferimento a ${d.platform} e promessa realistica.`
      }
    ]
  };
}

function buildCarousel(d: ReturnType<typeof normalizeForm>) {
  return [
    {
      slide: 1,
      role: "titolo forte",
      title: `${capitalize(d.audience)}: smetti di bloccarti su "${d.problem}"`,
      text: `Una guida rapida per capire come ${d.offer} può aiutarti a ${d.result}.`,
      visual: `Titolo grande, contrasto forte, elemento visivo collegato a ${d.niche}.`
    },
    {
      slide: 2,
      role: "problema",
      title: `Il blocco reale`,
      text: `Il problema non è solo mancanza di idee: è non sapere come trasformare ${d.problem} in un messaggio chiaro su ${d.platform}.`,
      visual: `Mostra confusione, bozze incomplete o una situazione quotidiana del pubblico.`
    },
    {
      slide: 3,
      role: "errore comune",
      title: `L'errore da evitare`,
      text: `Parlare subito di ${d.offer} senza prima far riconoscere a ${d.audience} il proprio problema.`,
      visual: `Due colonne: "troppo generico" contro "specifico per il pubblico".`
    },
    {
      slide: 4,
      role: "nuova prospettiva",
      title: `Cambia punto di partenza`,
      text: `Parti da ciò che il pubblico vuole ottenere: ${d.result}. Poi mostra perché ${d.problem} lo sta rallentando.`,
      visual: `Freccia dal problema al risultato, con una tappa centrale chiamata metodo.`
    },
    {
      slide: 5,
      role: "soluzione pratica",
      title: `La soluzione semplice`,
      text: `Usa ${d.offer} come ponte: problema chiaro, spiegazione breve, beneficio concreto e CTA coerente con "${d.goal}".`,
      visual: `Mini schema in quattro step, leggibile anche da smartphone.`
    },
    {
      slide: 6,
      role: "beneficio finale",
      title: `Cosa cambia davvero`,
      text: `${capitalize(d.audience)} capisce meglio il valore, si sente compreso e vede una strada più concreta verso ${d.result}.`,
      visual: `Prima/dopo visivo: caos iniziale e contenuto finale ordinato.`
    },
    {
      slide: 7,
      role: "CTA",
      title: `Vuoi applicarlo al tuo caso?`,
      text: `Salva il carosello o scrivimi "${keyword(d)}" per capire come adattare ${d.offer} alla tua comunicazione su ${d.platform}.`,
      visual: `CTA grande, spazio bianco, freccia o pulsante grafico ben visibile.`
    }
  ];
}

function buildIdeas(d: ReturnType<typeof normalizeForm>) {
  return [
    `Mini caso pratico: mostra come ${d.audience} passa da "${d.problem}" a un primo passo verso ${d.result} usando ${d.offer}.`,
    `Post confronto: "contenuto generico" contro "contenuto specifico per ${d.niche}" con esempio pensato per ${d.platform}.`,
    `Storia personale o cliente tipo: racconta il momento in cui ${d.problem} diventa evidente e come cambia la percezione grazie a ${d.offer}.`,
    `Checklist rapida: 5 domande da farsi prima di pubblicare un ${d.contentType} con obiettivo "${d.goal}".`,
    `Contenuto obiezioni: rispondi ai dubbi di ${d.audience} prima che valuti ${d.offer}, mantenendo un tono ${d.tone}.`
  ];
}

function buildAngles(d: ReturnType<typeof normalizeForm>) {
  return [
    {
      title: "Angolo problema-soluzione",
      description: `Metti al centro "${d.problem}" e presenta ${d.offer} come strumento pratico per rendere più semplice il percorso verso ${d.result}. Ideale quando l'obiettivo è ${d.goal}.`
    },
    {
      title: "Angolo trasformazione",
      description: `Mostra il prima/dopo di ${d.audience}: prima confusione, frizione o blocco; dopo più chiarezza, metodo e vicinanza al risultato "${d.result}".`
    },
    {
      title: "Angolo educativo autorevole",
      description: `Spiega un errore tipico in ${d.niche}, dai una regola semplice e collega la regola a ${d.offer}. Funziona bene su ${d.platform} con tono ${d.tone}.`
    }
  ];
}

function buildMistakes(d: ReturnType<typeof normalizeForm>) {
  return [
    `Parlare di ${d.offer} come se fosse adatto a chiunque: rendilo specifico per ${d.audience} e per il problema "${d.problem}".`,
    `Promettere ${d.result} come risultato garantito: meglio mostrare passaggi concreti, esempi realistici e benefici credibili.`,
    `Usare su ${d.platform} frasi vaghe tipo "migliora la tua presenza online": sostituiscile con situazioni reali della nicchia ${d.niche}.`
  ];
}

function buildCopyText(content: GeneratedContent) {
  const hooks = content.hooks.map((hook, index) => `${index + 1}. ${hook}`).join("\n");
  const captions = content.captions.map((caption, index) => `Caption ${index + 1}: ${caption.title}\n${caption.text}`).join("\n\n");
  const ctas = content.ctas.map((cta, index) => `${index + 1}. ${cta}`).join("\n");
  const reel = `Durata consigliata: ${content.reel.duration}\n\n${content.reel.scenes.map((scene) => `${scene.time}\nScena: ${scene.scene}\nTesto a schermo: ${scene.screenText}\nVoce narrante: ${scene.voiceover}\nVisual: ${scene.visual}`).join("\n\n")}`;
  const carousel = content.carousel.map((slide) => `Slide ${slide.slide} - ${slide.role}\nTitolo: ${slide.title}\nTesto: ${slide.text}\nVisual: ${slide.visual}`).join("\n\n");
  const ideas = content.ideas.map((idea, index) => `${index + 1}. ${idea}`).join("\n");
  const angles = content.angles.map((angle, index) => `${index + 1}. ${angle.title}\n${angle.description}`).join("\n\n");
  const mistakes = content.mistakes.map((mistake, index) => `${index + 1}. ${mistake}`).join("\n");
  const all = [hooks, captions, ctas, reel, carousel, ideas, angles, mistakes].join("\n\n---\n\n");

  return { all, hooks, captions, ctas, reel, carousel, ideas, angles, mistakes };
}

function captionCta(d: ReturnType<typeof normalizeForm>, index: number) {
  const ctas = [
    `Scrivimi "${keyword(d)}" e ti aiuto a capire come adattare ${d.offer} al tuo caso.`,
    `Salva questo post e usalo come traccia per il prossimo contenuto su ${d.platform}.`,
    `Commenta con "${keyword(d)}" se vuoi un esempio pensato per ${d.niche}.`,
    `Se vuoi ${d.result}, parti da un messaggio più specifico: questo è il primo passo.`,
    `Condividilo con un collega che continua a bloccarsi su "${d.problem}".`,
    `Mandami il tuo caso e ti aiuto a trasformarlo in un contenuto più chiaro.`,
    `Prova questa struttura nel tuo prossimo ${d.contentType} e osserva quali risposte ricevi.`,
    `Scrivi quale parte ti blocca di più: problema, promessa o CTA finale.`,
    `Salva la caption se vuoi costruire contenuti più coerenti con ${d.goal}.`,
    `Usa questa traccia per spiegare ${d.offer} senza sembrare generico.`
  ];

  return ctas[index % ctas.length];
}

function rotate<T>(items: T[], seed: number) {
  const start = seed % items.length;
  return [...items.slice(start), ...items.slice(0, start)];
}

function seedFrom(d: ReturnType<typeof normalizeForm>) {
  return `${d.niche}${d.offer}${d.audience}${d.problem}${d.result}${d.platform}${d.tone}${d.goal}`
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);
}

function keyword(d: ReturnType<typeof normalizeForm>) {
  const firstWord = d.niche.split(" ")[0] || "contenuti";
  return firstWord.toUpperCase().replace(/[^A-ZÀ-Ù]/g, "");
}

function toneOpener(tone: Tone) {
  const map: Record<Tone, string> = {
    diretto: "Te lo dico in modo diretto.",
    educativo: "Partiamo da un concetto semplice.",
    persuasivo: "Ecco perché questo conta davvero.",
    amichevole: "Facciamola semplice.",
    professionale: "Guardiamo il punto con metodo.",
    motivazionale: "Se vuoi sbloccare la situazione, parti da qui."
  };

  return map[tone];
}

function clean(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function capitalize(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}
