# Generatore Contenuti Social PRO

Tool Next.js 15 per generare hook, caption, CTA, reel, caroselli e idee editoriali.

## Stato reale del generatore (audit 29/10/2026)

Il componente attualmente renderizzato da `app/page.tsx` è `components/social-content-generator.tsx`: il pulsante Genera usa `generateLocalContent(form)` nel browser, senza chiamare API esterne. Esiste anche `POST /api/generate-social` che usa OpenAI lato server, ma il percorso UI ispezionato non lo invoca. La route rimane nel codice: non attribuire al frontend attuale generazioni AI via API, né dare per certo che la route non sia usata da client esterni.

## Avvio

```bash
npm install
npm run dev
npm run lint
npx tsc --noEmit
node --experimental-strip-types --test tests/protected-access.test.mjs
```

## Accesso protetto (PR in review; NON attivo in produzione)

Questo branch propone lo stesso schema di accesso del tool UGC, **senza** abilitare ancora la vendita: WordPress verifica l'acquisto EDD, emette un token HS256 a vita breve, `GET /access?token=...` lo valida e imposta un cookie HttpOnly di 6 ore. Il middleware protegge pagina e route `/api/generate-social`; `/access` e `/access-denied` sono gli unici percorsi applicativi pubblici. Nessuna chiave è salvata nel repository.

Configurare **soltanto** nelle variabili server Vercel, dopo avere verificato il prodotto EDD reale:

- `PELLINIDIGITAL_TOOL_ACCESS_SECRET`: segreto lungo casuale e **unico** per questo tool, uguale alla costante server WordPress `PELLINIDIGITAL_SOCIAL_TOOL_ACCESS_SECRET`.
- `PELLINIDIGITAL_TOOL_ACCESS_KEY_ID`: identificatore chiave uguale a WordPress.
- `PELLINIDIGITAL_TOKEN_ISSUER`: `https://pellinidigital.it` (deve corrispondere all'issuer WordPress).
- `PELLINIDIGITAL_TOOL_ID`: `social-content-generator` (deve corrispondere al registry WordPress).
- `PELLINIDIGITAL_EDD_PRODUCT_ID`: ID numerico del **prodotto EDD verificato**, NON uno Shopify e NON un numero di esempio.

**Fail closed:** senza anche una sola variabile obbligatoria valida, l'accesso è negato. Non impostare un ID EDD di prova in produzione.

### Prima di un merge/deploy

1. Confermare su Vercel quale repository/branch alimenta il deployment effettivo e che il piano sia idoneo all'uso commerciale.
2. Creare/verificare il prodotto EDD pubblicato e il suo ID, file/diritti/prezzo.
3. Configurare i segreti su WordPress (fuori repository) e Vercel; NON pubblicarli.
4. Preparare e sottoporre a review registry WordPress, landing, Tool Hub e dashboard, mantenendo `In arrivo` finché non è tutto verificato.
5. Verificare con test manuali: non autenticato, non acquirente, acquirente, JWT scaduto/manomesso, accesso diretto a `/` e `/api/generate-social`, mobile, login/logout, sessione scaduta, checkout EDD test.
6. Solo dopo approvazione esplicita valutare merge/deploy e pagamento reale controllato.

## Route OpenAI esistente

`POST /api/generate-social` è **disabilitata di default** (404) anche per gli utenti autenticati, per evitare spese API involontarie. Per attivarla deliberatamente occorre impostare lato server `SOCIAL_PRO_ENABLE_OPENAI_API=true` oltre a `OPENAI_API_KEY` e all'eventuale `OPENAI_TEXT_MODEL`; prima servono controllo costi, rate limit e review. Il generatore locale non richiede alcuna chiave. Il middleware protegge comunque la route con cookie valido. Non attivare la flag durante il lancio senza una decisione commerciale esplicita.

## Deploy

Non distribuire questo branch direttamente in produzione senza review di sicurezza e senza completare l'integrazione WordPress/EDD. Il solo superamento di lint, typecheck e test JWT **non** prova che l'acquisto o l'accesso reale funzionino.
