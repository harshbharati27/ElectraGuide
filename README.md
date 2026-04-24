# ElectraGuide India 🗳️

> *Empowering 96 Crore voters, one question at a time.*

ElectraGuide is an intelligent, multilingual election process assistant designed specifically for Indian voters. Built to help first-time and experienced voters understand the election process, check eligibility, and access official resources — all through a conversational chat interface.

---

## ✨ Features

### 💬 Smart Chat Assistant
- Conversational AI that answers questions about Indian elections, voting, registration, NOTA, documents, and more.
- Smart keyword-scoring engine for accurate topic matching.
- **Wikipedia fallback** — if a question isn't in the knowledge base, it searches Wikipedia (scoped to Indian elections) for real-time answers.

### 🎙️ Voice Input & 🔊 Audio Output
- Speak your question using the built-in microphone (Web Speech Recognition API).
- Listen to any response with text-to-speech in your selected language.

### 🌐 Multilingual Support (4 Languages)
- **English**, **हिन्दी (Hindi)**, **বাংলা (Bengali)**, **मराठी (Marathi)**
- Entire UI — buttons, labels, suggestions, quiz — dynamically translates on language switch.

### 🚨 "What's Your Situation?" (Problem Solver)
- 5 interactive cards targeting the most common voter issues (First time voter, lost ID, missed registration, find booth, documents).
- Click any card to reveal a step-by-step actionable guide with direct links to the relevant official portals.
- Transforms the app from a passive info-tool into an active problem-solving assistant.

### 🧠 Election Quiz
- 5 randomized multiple-choice questions per round.
- Instant correct/wrong feedback with color highlights.
- Score tracking with celebration confetti on perfect scores! 🎊

### 📊 Animated India Stats
- Live counting animation showing India's election stats:
  - 96.8 Cr+ Registered Voters
  - 543 Lok Sabha Seats
  - 10.4L+ Polling Stations
  - 28 States

### ⏳ Election Countdown Timer
- Real-time countdown to the next Lok Sabha General Election.
- Updates every second.

### 💡 Did You Know Ticker
- Auto-scrolling bar with fascinating Indian election facts.
- Rotates through 8 facts continuously.

### 📤 WhatsApp Share
- Share any bot response directly to WhatsApp with one click.

### 🔗 Quick Links
- Direct links to official resources:
  - NVSP Portal (Voter Registration)
  - Election Commission of India
  - Find Your Polling Booth
  - Voter Helpline App (Google Play)
  - Helpline: 1950

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Node.js + Express |
| Frontend | Vanilla HTML + CSS + JavaScript |
| Voice | Web Speech Recognition API + SpeechSynthesis API |
| Search | Wikipedia REST API (free, no key) |
| Fonts | Google Fonts (Outfit) |
| Deployment | Docker / Google Cloud Run |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)

### Run Locally
```bash
cd election-assistant/app
npm install
npm start
```
Open **http://localhost:8080** in your browser.

### Run with Docker
```bash
cd election-assistant
docker build -t electraguide .
docker run -p 8080:8080 electraguide
```

### Deploy to Google Cloud Run
```bash
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/electraguide
gcloud run deploy electraguide --image gcr.io/YOUR_PROJECT_ID/electraguide --platform managed --allow-unauthenticated
```

---

## 📁 Project Structure

```
election-assistant/
├── app/
│   ├── server.js          # Express backend + knowledge base + quiz API
│   ├── package.json
│   └── public/
│       └── index.html     # Full frontend (chat, quiz, stats, voice)
├── Dockerfile
└── README.md
```

---

## 📸 Key Highlights

- **No external API keys required** — Wikipedia search is free and keyless.
- **Zero build step** — No webpack, no Vite, no compilation. Just `node server.js`.
- **Cloud Run ready** — Listens on `process.env.PORT`, Dockerfile included.
- **Fully offline knowledge base** — Core election topics work without internet.
- **Accessible** — Voice input/output, multilingual, mobile-responsive.

---

## 📞 Official Resources

- 🌐 [NVSP Portal](https://voters.eci.gov.in) — Register to vote
- 🏛️ [Election Commission of India](https://eci.gov.in)
- 🔍 [Find Your Polling Booth](https://electoralsearch.eci.gov.in)
- 📱 [Voter Helpline App](https://play.google.com/store/apps/details?id=com.eci.citizen)
- 📞 **Helpline: 1950**

---

Built with ❤️ for Indian democracy.
