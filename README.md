# System Simulator Web

A lightweight, offline browser version of the synthetic telemetry simulator. The interface mimics a console, and all data is fictional and generated locally in the browser.

**Demo:** https://giusettek.github.io/system-simulator-web/

## Features

- Generate a random batch of 5–15 fictional systems with `scan`.
- Review the latest group with `list` and `status`.
- Fetch a detailed system report with `access ID`.
- View the latest session events with `log`.
- Use the side panel to click command names for explanations without executing them.
- Type commands directly into the console prompt and press **Enter**.
- Responsive layout for desktop and mobile screens.

This project has no backend, no database, no external dependencies, and does not access real devices or networks.

## Commands

| Command | Alias | Description |
| --- | --- | --- |
| `scan` | `s` | Generates a random group of systems and displays synthetic telemetry. |
| `list` | `ls` | Lists the IDs and basic data for the latest generated group. |
| `access 003` | `a 003` | Shows the full report for the selected system. Also accepts `SYSTEM-003`. |
| `status` | — | Displays state counts and average CPU/signal values for the active group. |
| `log` | — | Shows the recent events from the current session. |
| `help` | `?` | Displays the available commands in the terminal. |
| `clear` | — | Clears the screen and shows the initial welcome message again. |
| `exit` | `quit`, `q` | Ends the demo session; reload the page to start again. |

For `access`, run `scan` first and use an ID from the generated batch.

## Run locally

No installation is required. Open `index.html` directly in a browser, or start a local server from the project folder:

```bash
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## GitHub Pages deployment

The repository includes a GitHub Actions workflow in `.github/workflows/static.yml`. After a push to the `main` branch, the workflow publishes the static site to GitHub Pages. It can also be triggered manually from the **Actions** tab.

For the first setup, go to **Settings → Pages** and choose **GitHub Actions** as the source. Once the deployment completes, the app is available at the URL shown above.

## Repository structure

- `index.html` — page structure and interface layout.
- `style.css` — responsive terminal-inspired styling.
- `app.js` — data generation, command handling, and interactions.
- `.github/workflows/static.yml` — automatic deployment to GitHub Pages.

## License

Distributed under the MIT License. See [LICENSE](LICENSE).
