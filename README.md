# System Simulator Web

Versione web, semplice e offline, del simulatore di telemetria sintetica. L'interfaccia riproduce una console: i dati sono fittizi e vengono generati localmente nel browser.

**Demo:** https://giusettek.github.io/system-simulator-web/

## Funzionalità

- Generazione casuale di 5–15 sistemi immaginari con `scan`.
- Riepilogo dell'ultimo gruppo con `list` e `status`.
- Scheda dettagliata di un sistema con `access ID`.
- Registro eventi di sessione con `log`.
- Elenco laterale dei comandi: clicca un titolo per aprire la relativa spiegazione, senza eseguirlo.
- Console utilizzabile da tastiera: digita il comando nel prompt e premi **Invio**.
- Layout responsive per desktop e dispositivi mobili.

Il progetto non usa backend, database, dipendenze esterne o API e non accede a reti o dispositivi reali.

## Comandi

| Comando | Alias | Descrizione |
| --- | --- | --- |
| `scan` | `s` | Genera un gruppo casuale di sistemi e mostra la telemetria. |
| `list` | `ls` | Elenca gli ID e i dati sintetici del gruppo più recente. |
| `access 003` | `a 003` | Mostra il rapporto dettagliato del sistema indicato. Accetta anche `SYSTEM-003`. |
| `status` | — | Mostra conteggi degli stati e medie di CPU e segnale. |
| `log` | — | Mostra gli eventi recenti della sessione corrente. |
| `help` | `?` | Mostra il riepilogo dei comandi nel terminale. |
| `clear` | — | Pulisce la schermata e mostra di nuovo il messaggio iniziale. |
| `exit` | `quit`, `q` | Termina la demo corrente; ricarica la pagina per ricominciare. |

Per `access`, esegui prima `scan` e usa un ID del gruppo visualizzato.

## Avvio in locale

Non sono richiesti installazione o pacchetti. Puoi aprire `index.html` direttamente nel browser oppure avviare un server locale dalla cartella del progetto:

```bash
python3 -m http.server 8000
```

Apri quindi http://localhost:8000.

## Pubblicazione su GitHub Pages

Il repository include un workflow GitHub Actions in `.github/workflows/static.yml`. Dopo un push sul branch `main`, il workflow pubblica i file statici su GitHub Pages. È possibile avviarlo anche manualmente dalla scheda **Actions**.

Per la prima configurazione, in **Settings → Pages**, seleziona la pubblicazione tramite **GitHub Actions**. Al termine del deploy, la demo è disponibile all'indirizzo indicato in cima a questo README.

## Struttura del repository

- `index.html` — struttura e interfaccia della pagina.
- `style.css` — stile responsive con aspetto da terminale.
- `app.js` — generazione dati, comandi e interazioni.
- `.github/workflows/static.yml` — pubblicazione automatica su GitHub Pages.

## Licenza

Distribuito con licenza MIT. Consulta [LICENSE](LICENSE).
