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

type StrategicInput = {
  niche: string;
  offer: string;
  audience: string;
  problem: string;
  result: string;
  platform: Platform;
  goal: Goal;
  tone: Tone;
  contentType: ContentType;
  opener: string;
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
  const base: StrategicInput = {
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

  return {
    ...base,
    strategy: createStrategicContext(base)
  };
}

function buildHooks(d: ReturnType<typeof normalizeForm>) {
  const s = d.strategy;

  return [
    `Il vero motivo per cui ${s.audienceView} resta bloccato raramente è quello che sembra all'inizio.`,
    `Prima di cercare un cambiamento più grande, guarda l'errore che sta rendendo tutto più complicato del necessario.`,
    `Se ogni tentativo parte bene e poi si inceppa, forse non serve più motivazione: serve un percorso più facile da mantenere.`,
    `La maggior parte delle persone prova ad accelerare, ma ignora il punto in cui perde chiarezza e continuità.`,
    `Non devi per forza ${s.falseBeliefLower} per iniziare a vedere un progresso più stabile.`,
    `Il passaggio più sottovalutato è questo: rendere semplice il primo passo prima di chiedere costanza.`,
    `Cosa succede quando smetti di inseguire la soluzione perfetta e inizi da una scelta più sostenibile?`,
    `All'inizio sembra solo mancanza di tempo. Poi scopri che il problema è decidere cosa fare quando arrivano dubbi e distrazioni.`,
    `${s.realisticPromise}. È una promessa meno rumorosa, ma molto più credibile.`,
    `Tra improvvisare e seguire una direzione chiara c'è una differenza enorme: la seconda riduce il peso mentale.`
  ].map((hook) => adaptHookForPlatform(hook, d));
}

function buildCaptions(d: ReturnType<typeof normalizeForm>) {
  const s = d.strategy;
  const bases = [
    {
      title: "Educativa: il blocco non è dove sembra",
      angle: `Il punto non è spingere le persone a fare di più. Spesso il blocco nasce prima: quando ${s.audienceView} non capisce quale scelta sia davvero adatta, semplice e sostenibile.`
    },
    {
      title: "Emotiva: quando riparti sempre da capo",
      angle: `C'è una frustrazione che pesa più del problema in sé: la sensazione di averci già provato, di aver perso continuità e di non sapere se questa volta sarà diverso.`
    },
    {
      title: "Vendita: rendere la scelta più semplice",
      angle: `Una buona offerta non deve sembrare una scorciatoia miracolosa. Deve far capire perché il prossimo passo è più chiaro, più guidato e meno pesante da affrontare.`
    },
    {
      title: "Storytelling: il momento in cui tutto si ferma",
      angle: `Succede spesso così: all'inizio c'è entusiasmo, poi arrivano troppe opzioni, piccoli imprevisti e la sensazione di non sapere più qual è la strada giusta.`
    },
    {
      title: "Engagement: qual è il tuo ostacolo vero?",
      angle: `La domanda più utile non è "cosa vuoi ottenere?", ma "cosa ti fa fermare proprio quando dovresti continuare?". Le risposte spesso sono molto più concrete di quanto sembrino.`
    },
    {
      title: `Il ponte tra bisogno e decisione`,
      angle: `Nel settore ${d.niche}, il pubblico non decide solo perché vede un'offerta. Decide quando sente che qualcuno ha capito cosa lo blocca davvero e gli propone un passo meno confuso.`
    },
    {
      title: `La caption che parte dalla vita reale`,
      angle: `Un buon contenuto per ${d.platform} deve sembrare scritto per una situazione precisa, non per una categoria astratta. Deve far dire: "ok, questa cosa parla proprio del punto in cui mi blocco".`
    },
    {
      title: `Il modo più semplice per spiegare ${d.offer}`,
      angle: `Se provi a spiegare tutto, rischi di confondere. Se invece parti da una sola tensione concreta, puoi mostrare in modo ${d.tone} perché ${d.offer} riduce attrito e rende il percorso più praticabile.`
    },
    {
      title: `Una vendita più naturale`,
      angle: `Vendere su ${d.platform} non significa spingere. Significa far vedere che il problema è stato letto bene, che l'ostacolo non viene banalizzato e che la proposta ha un ruolo chiaro.`
    },
    {
      title: `Da contenuto qualsiasi a contenuto utile`,
      angle: `La differenza tra un contenuto ignorato e uno salvato sta nella prospettiva. Non basta parlare di ${d.niche}: devi trasformare una situazione comune in una lettura più lucida.`
    }
  ];

  return rotate(bases, seedFrom(d)).slice(0, 5).map((base, index) => ({
    title: base.title,
    text: `${base.angle}

Il primo passo è rendere il contenuto meno ovvio. Invece di ripetere il bisogno dichiarato, entra nel momento in cui nasce il blocco: ${s.painPoint}. Questo rende il testo più umano, perché non descrive solo un obiettivo, ma la fatica concreta che le persone incontrano prima di arrivarci.

Con un tono ${d.tone}, puoi educare senza appesantire: spiega che ${s.falseBeliefLower} non è l'unica strada. Il cambio di prospettiva è più forte quando mostri un'alternativa semplice: ${s.commonMistakeLower}, poi costruire un primo passo guidato, realistico e facile da ripetere. Questo rende il contenuto più credibile su ${d.platform}, soprattutto se l'obiettivo è ${d.goal}.

Qui entra in modo naturale ${d.offer}: non come soluzione magica, ma come struttura che aiuta a passare da confusione a chiarezza. Il beneficio non è solo pratico; è anche emotivo: ${s.emotionalBenefit}. Ed è proprio questa promessa realistica, ${s.realisticPromiseLower}, che rende la comunicazione più adulta e meno da template.

CTA: ${captionCta(d, index)}`
  }));
}

function buildCtas(d: ReturnType<typeof normalizeForm>) {
  const s = d.strategy;
  const ctas = [
    `Scrivimi "${keyword(d)}" se vuoi trasformare questa situazione in un percorso più chiaro e sostenibile.`,
    `Salva questo contenuto se ti serve una traccia meno generica per parlare a chi è fermo tra dubbi, tentativi e troppe opzioni.`,
    `Commenta con l'ostacolo che vedi più spesso: ti rispondo con un'idea di contenuto da usare su ${d.platform}.`,
    `Se vuoi comunicare ${d.offer} senza sembrare uguale a tutti, parti da questo cambio di prospettiva.`,
    `Condividilo con chi continua a provare soluzioni diverse ma non ha ancora trovato una direzione semplice da seguire.`,
    `Vuoi rendere più credibile la tua proposta? Parti da ${s.commonMistakeLower} e mostra un'alternativa concreta.`,
    `Mandami un messaggio se vuoi trasformare ${d.offer} in un contenuto più ${d.tone}, utile e meno promozionale.`,
    `Salva questa traccia: ti aiuta a parlare del desiderio finale senza ripetere sempre le stesse parole.`,
    `Usala per il tuo prossimo ${d.contentType}: prima mostra il blocco, poi la nuova prospettiva, poi la CTA.`,
    `Se questa lettura ti sembra familiare, il prossimo passo è rendere il messaggio più specifico per ${s.audienceView}.`
  ];

  return rotate(ctas, seedFrom(d)).slice(0, 5);
}

function buildReel(d: ReturnType<typeof normalizeForm>) {
  const s = d.strategy;

  return {
    duration: d.platform === "LinkedIn" ? "35-50 secondi" : "18-28 secondi",
    scenes: [
      {
        time: "0-2 secondi",
        scene: "Apertura con problema riconoscibile",
        screenText: "Non è solo questione di volontà",
        voiceover: `${d.opener} Il blocco spesso nasce quando il percorso sembra più complicato del risultato che vuoi ottenere.`,
        visual: "Primo piano o schermata con troppe opzioni aperte: rende visiva la confusione, senza ripetere l'input alla lettera."
      },
      {
        time: "2-5 secondi",
        scene: "Conseguenza concreta",
        screenText: "Troppi tentativi, poca direzione",
        voiceover: `Quando ${s.audienceView} prova a risolvere tutto insieme, il rischio è fermarsi prima di vedere un progresso stabile.`,
        visual: `Mostra una checklist incompleta, un calendario vuoto o un prima/dopo concettuale legato a ${d.niche}.`
      },
      {
        time: "5-8 secondi",
        scene: "Cambio di prospettiva",
        screenText: "Prima semplifica, poi accelera",
        voiceover: "Invece di aggiungere pressione, funziona meglio ridurre l'attrito: meno passaggi confusi, più continuità, una scelta concreta alla volta.",
        visual: "Taglio veloce con tre parole chiave: chiarezza, primo passo, continuità."
      },
      {
        time: "Finale",
        scene: "CTA coerente con l'obiettivo",
        screenText: `${capitalize(s.desire)} senza complicarti tutto`,
        voiceover: `${d.offer} serve proprio a questo: dare una struttura più semplice per avvicinarsi al risultato senza inseguire soluzioni casuali.`,
        visual: `Schermata finale pulita con CTA grande, promessa realistica e riferimento visivo a ${d.platform}.`
      }
    ]
  };
}

function buildCarousel(d: ReturnType<typeof normalizeForm>) {
  const s = d.strategy;

  return [
    {
      slide: 1,
      role: "titolo forte",
      title: "Il blocco non è dove pensi",
      text: "Una guida rapida per trasformare confusione e tentativi casuali in un percorso più semplice.",
      visual: `Titolo grande, contrasto forte, elemento visivo collegato a ${d.niche} ma senza testo troppo descrittivo.`
    },
    {
      slide: 2,
      role: "problema",
      title: "Il blocco reale",
      text: `${capitalize(s.painPoint)}. Quando succede, anche una buona intenzione diventa difficile da mantenere.`,
      visual: "Mostra confusione, scelte aperte o una situazione quotidiana del pubblico."
    },
    {
      slide: 3,
      role: "errore comune",
      title: "L'errore che rallenta",
      text: `${capitalize(s.commonMistakeLower)}. Così il percorso sembra più pesante di quello che dovrebbe essere.`,
      visual: "Due colonne: 'improvviso tutto' contro 'seguo un passaggio alla volta'."
    },
    {
      slide: 4,
      role: "nuova prospettiva",
      title: "Cambia punto di partenza",
      text: "Non partire dalla soluzione perfetta. Parti da ciò che rende il primo passo più leggero, chiaro e ripetibile.",
      visual: "Freccia da 'confusione' a 'continuità', con una tappa centrale chiamata metodo."
    },
    {
      slide: 5,
      role: "soluzione pratica",
      title: "La soluzione semplice",
      text: `${d.offer} diventa utile quando riduce attrito: meno decisioni inutili, più guida, un passo concreto da applicare subito.`,
      visual: "Mini schema in quattro step, leggibile anche da smartphone."
    },
    {
      slide: 6,
      role: "beneficio finale",
      title: "Cosa cambia davvero",
      text: `${capitalize(s.emotionalBenefit)}. Questo rende il risultato più vicino e meno dipendente dall'entusiasmo del momento.`,
      visual: "Prima/dopo visivo: caos iniziale e percorso finale ordinato."
    },
    {
      slide: 7,
      role: "CTA",
      title: "Vuoi applicarlo al tuo caso?",
      text: `Salva il carosello o scrivimi "${keyword(d)}" per trasformare questa idea in un contenuto adatto a ${d.platform}.`,
      visual: "CTA grande, spazio bianco, freccia o pulsante grafico ben visibile."
    }
  ];
}

function buildIdeas(d: ReturnType<typeof normalizeForm>) {
  const s = d.strategy;

  return [
    `Mini caso pratico: racconta il passaggio da tentativi disordinati a una prima azione guidata, collegando solo alla fine ${d.offer}.`,
    `Post confronto: metodo improvvisato contro metodo guidato, con esempi concreti adatti a ${d.platform}.`,
    "Storia cliente tipo: mostra il momento in cui la persona capisce che il problema non è impegnarsi di più, ma scegliere un percorso più sostenibile.",
    `Checklist rapida: 5 segnali che indicano che stai complicando troppo il percorso verso ${s.desire}.`,
    `Contenuto obiezioni: rispondi al dubbio "e se non facesse per me?" con tono ${d.tone}, usando prove logiche e passaggi semplici.`
  ];
}

function buildAngles(d: ReturnType<typeof normalizeForm>) {
  const s = d.strategy;

  return [
    {
      title: "Errore che blocca il risultato",
      description: `Mostra come ${s.commonMistakeLower} renda il percorso più faticoso. Poi presenta una scelta più semplice, concreta e collegata a ${d.offer}.`
    },
    {
      title: "Mito da sfatare",
      description: `Parti dalla falsa credenza "${s.falseBeliefLower}" e ribaltala: il pubblico non ha bisogno di pressione extra, ma di un modo più chiaro per iniziare e continuare.`
    },
    {
      title: "Risultato visto dal lato emotivo",
      description: `Non parlare solo del traguardo pratico. Racconta ${s.emotionalBenefitLower}: è spesso questo che rende il contenuto più memorabile e più umano.`
    }
  ];
}

function buildMistakes(d: ReturnType<typeof normalizeForm>) {
  const s = d.strategy;

  return [
    `Ripetere alla lettera il problema dichiarato: suona meccanico. Meglio trasformarlo in una situazione concreta, come ${s.painPointLower}.`,
    `Promettere un risultato garantito: meglio usare una promessa realistica, cioè ${s.realisticPromiseLower}.`,
    `Presentare ${d.offer} troppo presto: prima crea identificazione, poi mostra il cambio di prospettiva, infine proponi il passo successivo.`
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

function createStrategicContext(input: StrategicInput) {
  const audienceView = makeAudienceView(input.audience);
  const desire = reframeDesire(input.result);
  const painPoint = reframePainPoint(input.problem, input.niche, audienceView);
  const falseBelief = buildFalseBelief(input.niche, input.result);
  const commonMistake = buildCommonMistake(input.problem, input.offer);
  const emotionalBenefit = buildEmotionalBenefit(input.result);
  const realisticPromise = buildRealisticPromise(input.offer, desire);
  const narrativeAngle = buildNarrativeAngle(audienceView, painPoint, desire);

  return {
    audienceView,
    painPoint,
    painPointLower: lowerFirst(painPoint),
    desire,
    falseBelief,
    falseBeliefLower: lowerFirst(falseBelief),
    commonMistake,
    commonMistakeLower: lowerFirst(commonMistake),
    emotionalBenefit,
    emotionalBenefitLower: lowerFirst(emotionalBenefit),
    realisticPromise,
    realisticPromiseLower: lowerFirst(realisticPromise),
    narrativeAngle
  };
}

function makeAudienceView(audience: string) {
  if (isShortInput(audience)) {
    return "chi sente il bisogno di cambiare ma non ha ancora una strada chiara";
  }

  return `chi si riconosce in questa situazione: ${softenSentence(audience)}`;
}

function reframePainPoint(problem: string, niche: string, audienceView: string) {
  if (isShortInput(problem)) {
    return `il blocco nasce quando ${audienceView} prova ad affrontare ${niche} con troppe informazioni, poca guida e aspettative difficili da mantenere`;
  }

  return `il problema non è solo "${softenSentence(problem)}", ma il modo in cui quella difficoltà crea rinvii, dubbi e perdita di continuità`;
}

function reframeDesire(result: string) {
  if (isShortInput(result)) {
    return "sentire che il percorso è più leggero, concreto e finalmente gestibile";
  }

  return `arrivare a ${softenSentence(result)} con meno confusione e più fiducia nel processo`;
}

function buildFalseBelief(niche: string, result: string) {
  const desired = isShortInput(result) ? "vedere un cambiamento reale" : softenSentence(result);
  return `rivoluzionare tutto, fare scelte estreme o aspettare il momento perfetto per ${desired}`;
}

function buildCommonMistake(problem: string, offer: string) {
  if (isShortInput(problem)) {
    return `cercare subito la soluzione più completa invece di costruire un primo passo semplice attorno a ${offer}`;
  }

  return `trattare il blocco come un difetto personale invece di semplificare il percorso con una guida più chiara`;
}

function buildEmotionalBenefit(result: string) {
  if (isShortInput(result)) {
    return "sentirsi più lucidi, meno sopraffatti e più capaci di continuare anche quando l'entusiasmo cala";
  }

  return `sentire che ${softenSentence(result)} non dipende da uno slancio momentaneo, ma da una struttura che puoi seguire`;
}

function buildRealisticPromise(offer: string, desire: string) {
  return `${offer} non promette magie: aiuta a rendere più chiaro il prossimo passo verso ${desire}`;
}

function buildNarrativeAngle(audienceView: string, painPoint: string, desire: string) {
  return `raccontare il passaggio da "${painPoint}" a una situazione in cui ${audienceView} riesce a ${desire}`;
}

function adaptHookForPlatform(hook: string, d: ReturnType<typeof normalizeForm>) {
  const endings: Record<Platform, string> = {
    Instagram: "Perfetto da salvare prima di creare il prossimo post.",
    TikTok: "Detto in pochi secondi, questo cambia subito la prospettiva.",
    Facebook: "È il tipo di riflessione che apre una conversazione reale.",
    "YouTube Shorts": "Funziona bene come apertura rapida prima dell'esempio pratico.",
    LinkedIn: "È un punto di vista utile per chi vuole comunicare con più metodo."
  };

  return `${hook} ${endings[d.platform]}`;
}

function isShortInput(value: string) {
  return clean(value).split(" ").filter(Boolean).length <= 2;
}

function softenSentence(value: string) {
  return clean(value)
    .replace(/^(non riesco a|non riescono a|voglio|vuole|vorrei|ottenere|raggiungere)\s+/i, "")
    .replace(/[.!?]+$/g, "");
}

function lowerFirst(value: string) {
  if (!value) return value;
  return value.charAt(0).toLowerCase() + value.slice(1);
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
