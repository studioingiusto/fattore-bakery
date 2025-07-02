# Integrazione WordPress - Fattore Bakery

Questo documento descrive l'integrazione tra il frontend Next.js di Fattore Bakery e il backend WordPress.

## Configurazione Domini

### Opzione 1: WordPress su Sottodominio (CONSIGLIATA)
- **Frontend Next.js**: `https://fattorebakery.it` (sito principale)
- **Backend WordPress**: `https://admin.fattorebakery.it` (admin e API)

### Opzione 2: Configurazione Attuale
- **WordPress + Next.js**: `https://fattorebakery.it` (configurazione ibrida)

## Variabili d'Ambiente

Crea un file `.env.local` nella root del progetto:

```env
# WordPress Configuration
NEXT_PUBLIC_WORDPRESS_URL=https://admin.fattorebakery.it

# WordPress API Credentials (per Contact Form 7 e operazioni autenticate)
WP_API_USERNAME=your_wp_username
WP_API_PASSWORD=your_wp_application_password
```

## Struttura dell'integrazione

### 1. Libreria WordPress (`src/lib/wordpress.ts`)

La libreria contiene tutte le funzioni per interfacciarsi con l'API REST di WordPress:

- **`getPosts()`** - Recupera una collezione di post
- **`getPostBySlug()`** - Recupera un singolo post tramite slug
- **`getMedia()`** - Recupera le immagini featured
- **`getPages()`** - Recupera le pagine
- **`submitContactForm()`** - Invia form tramite Contact Form 7
- **`stripHtml()`** - Rimuove tag HTML dalle stringhe
- **`formatDate()`** - Formatta le date in italiano

### 2. Homepage (`src/app/page.tsx`)

**IMPORTANTE: La homepage NON è stata modificata**. È stato solo aggiunto:
- Import del componente `ContactForm`
- Form di contatto alla fine della pagina

Le sezioni esistenti rimangono intatte:
- Sezione Hero con "ALZA IL LIVELLO DEI TUOI PANIFICATI"
- Sezione "COS'È FATTORE BAKERY"
- Call-to-action "CONTATTACI PER LA CREAZIONE DEL TUO PANIFICATO SU MISURA"

### 3. Pagina Blog (`src/app/blog/page.tsx`)

Nuova pagina che mostra:
- Lista dei post dal WordPress
- Immagini featured
- Estratti dei contenuti
- Link ai singoli articoli

### 4. Pagina Articolo Singolo (`src/app/blog/[slug]/page.tsx`)

Pagina dinamica per ogni articolo:
- Titolo e data
- Immagine featured come hero
- Contenuto completo dell'articolo
- Navigazione verso altri articoli

### 5. Form di Contatto (`src/components/ContactForm.tsx`)

Componente che integra Contact Form 7:
- Form reattivo e validato
- Invio tramite API di Contact Form 7
- Gestione stato di invio e errori
- Design coerente con il resto del sito

## Configurazione WordPress

### Plugin necessari:

1. **Contact Form 7** - Per i form di contatto
2. **REST API** - Attivato di default in WordPress

### Endpoint utilizzati:

- `GET ${WORDPRESS_URL}/wp-json/wp/v2/posts` - Lista post
- `GET ${WORDPRESS_URL}/wp-json/wp/v2/posts?slug={slug}` - Post singolo
- `GET ${WORDPRESS_URL}/wp-json/wp/v2/media/{id}` - Immagini
- `POST ${WORDPRESS_URL}/wp-json/contact-form-7/v1/contact-forms/1/feedback` - Form contatti

Dove `${WORDPRESS_URL}` è configurabile tramite variabile d'ambiente.

## Come utilizzare

### Accedere al blog:
- Visita `/blog` per vedere tutti gli articoli
- Clicca su un articolo per leggerlo completo

### Aggiungere contenuto:
1. Accedi al backend WordPress su `${WORDPRESS_URL}/wp-admin` (es. https://admin.fattorebakery.it/wp-admin)
2. Crea nuovi post nella sezione "Articoli"
3. Aggiungi immagini featured per una migliore presentazione
4. I contenuti appariranno automaticamente sul sito Next.js

### Form di contatto:
- Il form è presente alla fine della homepage
- I messaggi vengono inviati tramite Contact Form 7
- Configurazione form ID: `1` (modificabile in `wordpress.ts`)

## Personalizzazioni future

### Aggiungere nuovi endpoint:
Modifica `src/lib/wordpress.ts` per aggiungere nuove funzioni API.

### Modificare il form:
1. Aggiorna il Contact Form 7 nel WordPress admin
2. Modifica `ContactFormData` interface se necessario
3. Aggiorna la funzione `submitContactForm()`

### Styling blog:
Gli stili per i contenuti del blog sono in `src/app/globals.css` nella sezione "Blog content styling".

## Cache e Performance

- Le pagine del blog hanno `revalidate: 3600` (1 ora)
- Le immagini utilizzano Next.js Image con ottimizzazione automatica
- I contenuti sono pre-renderizzati dove possibile

## Sicurezza

- Tutti i contenuti HTML sono sanificati con `stripHtml()`
- Il form utilizza validazione client e server-side
- CORS configurato correttamente per le API WordPress

## Migrazione da WordPress Frontend a Next.js

### Passaggi per spostare WordPress su sottodominio:

1. **Backup completo**: Crea un backup del sito WordPress
2. **Configurazione DNS**: Crea un record A o CNAME per `admin.fattorebakery.it`
3. **Spostamento WordPress**: 
   - Installa WordPress sul nuovo sottodominio
   - Ripristina il backup
   - Aggiorna le URL nelle impostazioni WP (`wp-admin/options-general.php`)
4. **Configurazione Next.js**:
   - Crea il file `.env.local` con `NEXT_PUBLIC_WORDPRESS_URL=https://admin.fattorebakery.it`
   - Testa che le API funzionino correttamente
5. **Deploy del frontend**: Carica il frontend Next.js su `https://fattorebakery.it`
6. **Verifica**: Controlla che blog, form e tutte le funzionalità funzionino

### Alternativa: Reverse Proxy (più complessa)

Se preferisci mantenere tutto sullo stesso dominio:
- Configura un reverse proxy (Nginx/Apache)
- Next.js serve `/`, `/blog`, `/api` ecc.
- WordPress accessibile solo su `/wp-admin` e `/wp-json`
- Richiede configurazione server avanzata 