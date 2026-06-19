# Profound: AI Share of Voice Tracker

![Dashboard Preview](web/public/preview.png)

This project is a full-stack proof of concept demonstrating how to track and measure **AI Share of Voice**. As consumers increasingly turn to LLMs like Gemini to make purchasing decisions (e.g., "Where should I buy 2026 Knicks Championship gear?"), brands need intelligence to see how AI algorithms recommend them compared to competitors.

This application bridges the gap by simulating buyer-intent queries, extracting the AI's recommendations, and visualizing the market leaders in a real-time dashboard.

## 🚀 Architecture & Stack

The architecture is designed to handle enterprise data patterns using modern, scalable infrastructure:

- **AI Ingestion (Python)**: A robust Python pipeline (`scraper/main.py`) built with the new `google-genai` SDK that prompts the model with buyer-intent queries and parses the recommended brands.
- **Database (PostgreSQL / Supabase)**: The parsed data is inserted into a Supabase PostgreSQL database table designed for high-frequency writes and aggregations.
- **Backend APIs (Next.js / TypeScript)**: Built-in Next.js Route Handlers (`/api/share-of-voice` and `/api/recent-queries`) securely connect to the database to aggregate metrics and serve the frontend.
- **Frontend Dashboard (Next.js / React / Tailwind)**: A dark-themed, enterprise-ready dashboard built with Next.js App Router, styled with Tailwind CSS, and visualized using Recharts.

## 📦 Local Setup & Deployment

### 1. Database Setup
1. Create a [Supabase](https://supabase.com) project.
2. In the Supabase SQL Editor, run the contents of [`schema.sql`](schema.sql) to create the `ai_brand_recommendations` table and configure the Row Level Security (RLS) policies.

### 2. Python AI Scraper
Navigate to the `scraper` directory:
```bash
cd scraper
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```
Create a `.env` file from the example:
```bash
cp .env.example .env
```
Fill in your `GEMINI_API_KEY`, `SUPABASE_URL`, and `SUPABASE_KEY` (Publishable anon key). Then run the scraper to populate data:
```bash
python main.py
```

### 3. Next.js Dashboard
Navigate to the `web` directory:
```bash
cd web
npm install
```
Create a `.env.local` file and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_publishable_anon_key
```
Start the development server:
```bash
npm run dev
```
Visit `http://localhost:3000` to see your live dashboard.

## 💡 Use Cases

This architecture can easily be scaled to:
* Track daily brand sentiment shifts across different LLMs (Gemini, GPT-4, Claude).
* Automate competitor analysis reporting for marketing teams.
* Alert brands in real-time when they drop out of the top 3 recommendations.
