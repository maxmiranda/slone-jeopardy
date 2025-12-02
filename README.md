# Jeopardy

A website for playing Jeopardy! together with friends over the Internet. Designed for computer browsers, although it's playable on mobile. If the UI/code looks familiar, much of it is copied from my other project, WatchParty: https://github.com/howardchung/watchparty

## Description

- Implements the game show Jeopardy!, including the Jeopardy, Double Jeopardy, and Final Jeopardy rounds. Daily Doubles are also included.
- Any archived episode of Jeopardy! can be loaded, with options for loading specific event games (e.g. College Championship)
- Load games by episode number
- Create your own custom game with a CSV file
- Supports creating multiple rooms for private/simultaneous games.
- Text chat included

### Reading:

- Uses text-to-speech to read clues

### Buzzing:

- After a set time (based on number of syllables in the clue text), buzzing is unlocked
- Buzzing in enables a user to submit an answer
- Answers will be judged in buzz order

### Judging:

- Players can judge answer correctness themselves.
- An experimental AI judge powered by ChatGPT is in testing.

### Data:

- Game data is from http://j-archive.com/
- Games might be incomplete if some clues weren't revealed on the show.

## Updating Clues:

- Game data is collected using a separate j-archive-parser project and collected into a single gzipped JSON file, which this project can retrieve.

## Environment Variables

- `REDIS_URL`: Provide to allow persisting rooms to Redis so they survive server reboots
- `OPENAI_SECRET_KEY`: Provide to allow using OpenAI's ChatGPT to judge answers

## Tech

- React
- TypeScript
- Node.js
- Redis

## Admin/Display Views

- Players join at `/?game=<roomId>` (existing flow).
- Admin controls live play at `/admin?game=<roomId>`: start games, pick clues, see buzz order, and award scores.
- A read-only display for big screens lives at `/display?game=<roomId>` and shows the board plus team names/scores along the bottom.

## Firebase Hosting (static UI)

The Vite build outputs to `build/`, which is pre-configured for Firebase Hosting.

1. Install the CLI: `npm install -g firebase-tools` and `firebase login`.
2. Set your project: `firebase use jeopardy-hosting` (or update `.firebaserc`).
3. Build the UI: `npm run buildReact`.
4. Deploy static assets: `firebase deploy --only hosting`.

Set `VITE_SERVER_HOST` at build time to point the UI to your running websocket server (deploy the `server/` app separately, e.g., on Cloud Run/VM, since Firebase Hosting serves static files only).

## Deploying the server on Cloud Run

1. Build the container (uses `Dockerfile`):  
   `gcloud builds submit --tag gcr.io/YOUR_PROJECT/jeopardy-server`
2. Deploy to Cloud Run:  
   `gcloud run deploy jeopardy-server --image gcr.io/YOUR_PROJECT/jeopardy-server --region=YOUR_REGION --allow-unauthenticated --port=8083`
3. Set env vars on the service as needed (`REDIS_URL`, `OPENAI_SECRET_KEY`, `STATS_KEY`, `PORT=8083`).  
4. Point the UI to the Cloud Run URL: build with `VITE_SERVER_HOST=https://<cloud-run-url>` before deploying to Firebase, or append `?server=https://<cloud-run-url>` to your admin/player/display links.
