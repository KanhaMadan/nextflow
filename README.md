<div align="center">

```
███╗   ██╗███████╗██╗  ██╗████████╗███████╗██╗      ██████╗ ██╗    ██╗
████╗  ██║██╔════╝╚██╗██╔╝╚══██╔══╝██╔════╝██║     ██╔═══██╗██║    ██║
██╔██╗ ██║█████╗   ╚███╔╝    ██║   █████╗  ██║     ██║   ██║██║ █╗ ██║
██║╚██╗██║██╔══╝   ██╔██╗    ██║   ██╔══╝  ██║     ██║   ██║██║███╗██║
██║ ╚████║███████╗██╔╝ ██╗   ██║   ██║     ███████╗╚██████╔╝╚███╔███╔╝
╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝     ╚══════╝ ╚═════╝  ╚══╝╚══╝
```

### ⚡ Visual LLM Workflow Builder — Powered by Google Gemini

[![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![React Flow](https://img.shields.io/badge/React_Flow-FF0072?style=for-the-badge&logo=react&logoColor=white)](https://reactflow.dev)
[![Trigger.dev](https://img.shields.io/badge/Trigger.dev-7C3AED?style=for-the-badge&logo=lightning&logoColor=white)](https://trigger.dev)
[![Clerk](https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.com)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://prisma.io)

<br/>

> **NextFlow** is a pixel-perfect, production-grade LLM workflow builder inspired by Krea.ai.
> Build, connect, and execute AI-powered pipelines visually — no code required.

<br/>

![NextFlow Canvas Preview](https://via.placeholder.com/900x500/0a0a0f/7c3aed?text=NextFlow+Canvas+Preview)

</div>

---

## 📋 Table of Contents

- [✨ What is NextFlow?](#-what-is-nextflow)
- [🎯 Key Features](#-key-features)
- [🏗️ Tech Stack](#️-tech-stack)
- [🧠 How It Works](#-how-it-works)
- [🔧 Node Types](#-node-types)
- [🚀 Getting Started](#-getting-started)
- [⚙️ Environment Variables](#️-environment-variables)
- [🗄️ Database Schema](#️-database-schema)
- [📁 Project Structure](#-project-structure)
- [🌐 Deployment](#-deployment)
- [🆘 Troubleshooting](#-troubleshooting)

---

## ✨ What is NextFlow?

NextFlow is a **visual AI workflow builder** that lets you create, connect and execute LLM pipelines through a drag-and-drop canvas interface. Think of it as a no-code automation tool where every "step" is a node — text input, image upload, AI inference, video processing — and you draw lines between them to define data flow.

### The Problem It Solves

Building AI pipelines traditionally requires:
- Writing complex chained API calls
- Managing async dependencies manually
- No visual feedback during execution
- Hard to experiment and iterate

**NextFlow solves all of this** with a visual canvas where you see your entire pipeline, watch it execute in real-time with glowing animations, and get results displayed directly on each node.

### Built For

This project was built as a **technical assessment** demonstrating:
- Production-quality full-stack engineering
- Complex state management with parallel execution
- Third-party API orchestration (Gemini, Trigger.dev, Transloadit, Clerk)
- Type-safe, scalable architecture

---

## 🎯 Key Features

| Feature | Description |
|---|---|
| 🎨 **Pixel-Perfect UI** | Dark theme matching Krea.ai — dot grid canvas, purple accents, smooth animations |
| 🔐 **Authentication** | Clerk-powered sign in/up with protected routes and per-user data isolation |
| 🖱️ **Drag & Drop Canvas** | React Flow canvas with pan, zoom, minimap, and snap-to-grid |
| ⚡ **Parallel Execution** | Independent workflow branches execute simultaneously — not sequentially |
| 🧠 **Gemini AI Integration** | Google Gemini with vision support — send text + multiple images in one prompt |
| 🎬 **Video Processing** | FFmpeg-powered frame extraction and image cropping via Trigger.dev |
| 📁 **File Uploads** | Transloadit handles all media uploads with CDN delivery |
| 💜 **Pulsating Glow** | Nodes pulse with purple glow while executing — real-time visual feedback |
| 📜 **Run History** | Full execution history with node-level details, timing, and status badges |
| 💾 **Persistence** | Workflows and history saved to PostgreSQL via Prisma ORM |
| 🔗 **Type-Safe Connections** | Enforces valid connections — image outputs can't connect to text inputs |
| 📤 **Import / Export** | Save and share workflows as JSON files |

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type safety throughout — strict mode enabled |
| **React Flow** | Visual workflow canvas — nodes, edges, minimap |
| **Zustand** | Global state management for canvas and history |
| **Tailwind CSS** | Utility-first styling matching Krea's dark theme |
| **Lucide React** | Icon library |

### Backend
| Technology | Purpose |
|---|---|
| **Next.js API Routes** | Server-side endpoints with Zod validation |
| **Prisma ORM** | Type-safe database access layer |
| **PostgreSQL (Neon)** | Serverless database for workflow and history persistence |
| **Clerk** | Authentication — sign in, sign up, protected routes |

### Execution & Media
| Technology | Purpose |
|---|---|
| **Trigger.dev** | Background task execution — ALL node processing runs here |
| **Google Gemini API** | LLM inference with vision support (multimodal) |
| **FFmpeg** | Image cropping and video frame extraction (runs on Trigger.dev) |
| **Transloadit** | File upload handling and CDN delivery |

### Validation & Utilities
| Technology | Purpose |
|---|---|
| **Zod** | Runtime schema validation on all API routes |
| **@google/generative-ai** | Official Google Generative AI SDK |

---

## 🧠 How It Works

### The Execution Engine

When you click **Run**, NextFlow performs a sophisticated multi-step execution:

```
┌─────────────────────────────────────────────────────────────────┐
│                    EXECUTION PIPELINE                            │
│                                                                  │
│  1. TOPOLOGICAL SORT                                             │
│     Your node graph → sorted by dependency order                 │
│     Nodes with no dependencies come first                        │
│                                                                  │
│  2. PARALLEL GROUPING                                            │
│     Independent branches grouped into execution "waves"          │
│     Each wave runs simultaneously                                │
│                                                                  │
│  3. WAVE EXECUTION                                               │
│     Wave 1: [Upload Image, Upload Video, Text Nodes]             │
│     Wave 2: [Crop Image, Extract Frame]  ← run in parallel       │
│     Wave 3: [LLM Node #1]                                        │
│     Wave 4: [LLM Node #2 - convergence]                          │
│                                                                  │
│  4. TRIGGER.DEV DISPATCH                                         │
│     Each computation node → fires a Trigger.dev background task  │
│     LLM Node → llm-task (calls Gemini API)                       │
│     Crop Node → crop-image-task (runs FFmpeg)                    │
│     Frame Node → extract-frame-task (runs FFmpeg)                │
│                                                                  │
│  5. RESULT PROPAGATION                                           │
│     Output of each node → fed as input to connected nodes        │
│     Results display inline on each node                          │
│                                                                  │
│  6. HISTORY PERSISTENCE                                          │
│     Every run → saved to PostgreSQL with node-level details      │
└─────────────────────────────────────────────────────────────────┘
```

### The DAG (Directed Acyclic Graph)

Workflows are represented as a **DAG** — this ensures:
- No circular dependencies (A → B → A is invalid)
- Clear execution order derivable from the graph
- Parallel branches are automatically detected
- Convergence nodes wait for ALL upstream dependencies

### Data Flow Between Nodes

```
Text Node ──────────────────→ LLM Node (system_prompt input)
                                    ↑
Text Node ──────────────────→ LLM Node (user_message input)
                                    ↑
Upload Image → Crop Image ──→ LLM Node (images input)
                                    ↓
                              Result displayed inline on node
```

---

## 🔧 Node Types

### 1. 📝 Text Node
- Simple textarea for text input
- Output: plain text string
- Use for: system prompts, user messages, configuration values

### 2. 🖼️ Upload Image Node
- File upload via Transloadit
- Accepts: JPG, JPEG, PNG, WEBP, GIF
- Shows image preview after upload
- Output: CDN image URL

### 3. 🎬 Upload Video Node
- File upload via Transloadit
- Accepts: MP4, MOV, WEBM, M4V
- Shows video player preview
- Output: CDN video URL

### 4. 🧠 Run LLM Node
- Dropdown to select Gemini model
- Input handles: `system_prompt`, `user_message`, `images` (multiple)
- Executes via **Trigger.dev → Google Gemini API**
- Output: AI text response (displayed inline on node)
- Supports vision — send images alongside text prompts

### 5. ✂️ Crop Image Node
- Input: image URL from upstream node
- Configurable: X%, Y%, Width%, Height% (sliders)
- Executes **FFmpeg crop via Trigger.dev**
- Output: cropped image URL (re-uploaded to Transloadit CDN)

### 6. 🎞️ Extract Frame from Video Node
- Input: video URL from upstream node
- Configurable: timestamp in seconds (e.g. `5`) or percentage (e.g. `50%`)
- Executes **FFmpeg frame extraction via Trigger.dev**
- Output: extracted frame as JPG URL

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:
- **Node.js** v18 or higher → [nodejs.org](https://nodejs.org)
- **VS Code** → [code.visualstudio.com](https://code.visualstudio.com)

### 1. Clone or Extract the Project

```bash
# If using git
git clone https://github.com/yourusername/nextflow.git
cd nextflow

# If using the ZIP
# Extract nextflow.zip → open the nextflow folder
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy `.env.local` and fill in all values (see [Environment Variables](#️-environment-variables) section):

```bash
# Create .env for Prisma CLI (copy of .env.local)
copy .env.local .env        # Windows
cp .env.local .env          # Mac/Linux
```

### 4. Set Up Database

```bash
npx prisma generate
npx prisma db push
```

### 5. Run the App

Open **two terminals** and run one command in each:

```bash
# Terminal 1 — Trigger.dev background worker
npx trigger.dev@latest dev

# Terminal 2 — Next.js web app
npm run dev
```

### 6. Open in Browser

Navigate to **[http://localhost:3000](http://localhost:3000)**

Sign up and start building workflows! 🎉

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory with the following:

```env
# ── DATABASE ──────────────────────────────────────────────────
# Get from: https://neon.tech → Create project → Connection string
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"

# ── CLERK AUTHENTICATION ───────────────────────────────────────
# Get from: https://dashboard.clerk.com → Your app → API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/workflow
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/workflow

# ── GOOGLE GEMINI AI ───────────────────────────────────────────
# Get from: https://aistudio.google.com → Get API Key
GEMINI_API_KEY="AIzaSy..."

# ── TRIGGER.DEV ────────────────────────────────────────────────
# Get from: https://cloud.trigger.dev → Your project → API Keys
TRIGGER_SECRET_KEY="tr_dev_..."
NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY="pk_dev_..."

# ── TRANSLOADIT ────────────────────────────────────────────────
# Get from: https://transloadit.com → Account → API Credentials
TRANSLOADIT_AUTH_KEY="your_auth_key"
TRANSLOADIT_AUTH_SECRET="your_auth_secret"
NEXT_PUBLIC_TRANSLOADIT_AUTH_KEY="your_auth_key"

# ── APP ────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Where to Get Each Key

| Key | Service | Link |
|---|---|---|
| `DATABASE_URL` | Neon PostgreSQL | [neon.tech](https://neon.tech) |
| `CLERK_*` | Clerk Auth | [clerk.com](https://clerk.com) |
| `GEMINI_API_KEY` | Google AI Studio | [aistudio.google.com](https://aistudio.google.com) |
| `TRIGGER_*` | Trigger.dev | [trigger.dev](https://trigger.dev) |
| `TRANSLOADIT_*` | Transloadit | [transloadit.com](https://transloadit.com) |

---

## 🗄️ Database Schema

Three tables power the persistence layer:

```
┌─────────────────┐       ┌──────────────────┐       ┌─────────────┐
│    Workflow      │       │   WorkflowRun     │       │   NodeRun   │
├─────────────────┤       ├──────────────────┤       ├─────────────┤
│ id (cuid)        │──────→│ id (cuid)         │──────→│ id (cuid)   │
│ userId (Clerk)   │       │ workflowId        │       │ workflowRunId│
│ name             │       │ userId            │       │ nodeId      │
│ nodes (JSON)     │       │ scope (FULL/      │       │ nodeType    │
│ edges (JSON)     │       │   PARTIAL/SINGLE) │       │ nodeLabel   │
│ viewport (JSON)  │       │ status            │       │ status      │
│ createdAt        │       │ startedAt         │       │ inputs JSON │
│ updatedAt        │       │ completedAt       │       │ outputs JSON│
└─────────────────┘       │ duration (ms)     │       │ error       │
                           │ nodeCount         │       │ duration ms │
                           │ errorMessage      │       │ triggerRunId│
                           └──────────────────┘       └─────────────┘
```

**RunStatus:** `RUNNING` | `SUCCESS` | `FAILED` | `PARTIAL`

**RunScope:** `FULL` | `PARTIAL` | `SINGLE`

---

## 📁 Project Structure

```
nextflow/
├── .env.local                    # 🔑 API keys (never commit)
├── trigger.config.ts             # Trigger.dev project config
├── package.json
├── tsconfig.json
├── tailwind.config.ts            # Dark theme + custom animations
├── next.config.js
│
├── prisma/
│   └── schema.prisma             # Database models
│
├── trigger/                      # Background tasks (cloud execution)
│   ├── llm-task.ts               # Google Gemini API calls
│   ├── crop-image-task.ts        # FFmpeg image cropping
│   └── extract-frame-task.ts    # FFmpeg video frame extraction
│
└── src/
    ├── middleware.ts             # Clerk route protection
    ├── app/
    │   ├── layout.tsx            # Root layout with Clerk provider
    │   ├── page.tsx              # Root redirect
    │   ├── globals.css           # Global dark theme styles
    │   ├── sign-in/              # Clerk sign-in page
    │   ├── sign-up/              # Clerk sign-up page
    │   ├── workflow/             # Main canvas page
    │   └── api/
    │       ├── workflows/        # CRUD for workflow persistence
    │       ├── execute/          # Node execution dispatcher
    │       ├── history/          # Run history endpoints
    │       └── upload/           # Transloadit file upload
    │
    ├── components/
    │   ├── nodes/                # All 6 node components
    │   ├── canvas/               # Canvas, editor, topbar
    │   └── sidebar/              # Left (nodes) + Right (history)
    │
    ├── hooks/
    │   └── useWorkflowExecution.ts  # Execution engine + DAG logic
    │
    ├── lib/
    │   ├── prisma.ts             # Database client singleton
    │   └── utils.ts              # Helper utilities
    │
    ├── store/
    │   └── workflowStore.ts      # Zustand global state
    │
    └── types/
        └── index.ts              # All TypeScript type definitions
```

---

## 🌐 Deployment

### Deploy to Vercel

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/yourusername/nextflow.git
git push -u origin main

# 2. Import on Vercel
# Go to vercel.com → Add New Project → Import your repo
# Add ALL environment variables from .env.local
# Click Deploy

# 3. Deploy Trigger.dev tasks to cloud
npx trigger.dev@latest deploy
```

### Post-Deployment Checklist

- [ ] All environment variables added in Vercel dashboard
- [ ] `NEXT_PUBLIC_APP_URL` updated to your Vercel URL
- [ ] Clerk domain configured with your Vercel URL
- [ ] Trigger.dev tasks deployed with `npx trigger.dev@latest deploy`
- [ ] Database accessible from Vercel (Neon allows all connections by default)

---

## 🆘 Troubleshooting

| Error | Cause | Fix |
|---|---|---|
| `DATABASE_URL not found` | Prisma needs `.env` not `.env.local` | Run `copy .env.local .env` |
| `Cannot find module` | Packages not installed | Run `npm install` |
| `Clerk: publishable key not found` | Missing env variable | Check `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` in `.env.local` |
| `LLM node stuck on running` | Trigger.dev worker not running | Run `npx trigger.dev@latest dev` in Terminal 1 |
| `Upload fails` | Transloadit keys wrong | Check `TRANSLOADIT_AUTH_KEY` and `TRANSLOADIT_AUTH_SECRET` |
| `Port 3000 in use` | App already running | Run `npx kill-port 3000` |
| `404 on Vercel` | Clerk domain not configured | Add Vercel URL in Clerk → Configure → Domains |
| `maxDuration missing` | Trigger.dev SDK version mismatch | Add `maxDuration: 300` to `trigger.config.ts` |

---

## 📜 Available Scripts

```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

npx prisma generate  # Generate Prisma client
npx prisma db push   # Sync database schema
npx prisma studio    # Open visual database browser

npx trigger.dev@latest dev     # Start Trigger.dev local worker
npx trigger.dev@latest deploy  # Deploy tasks to Trigger.dev cloud
```

---

## 🎯 Sample Workflow — Product Marketing Kit Generator

The app comes pre-loaded with a sample workflow that demonstrates all features:

```
Branch A (runs in parallel with Branch B):
  Text Node (System Prompt)  ──→┐
  Text Node (Product Details) ──→ LLM Node #1 → Product Description
  Upload Image → Crop Image   ──→┘

Branch B (runs in parallel with Branch A):
  Upload Video → Extract Frame

Convergence (waits for BOTH branches):
  Text Node (Social Prompt) ──→┐
  LLM Node #1 output        ──→ LLM Node #2 → Final Marketing Tweet
  Cropped Image + Frame     ──→┘
```

This demonstrates:
- ✅ All 6 node types
- ✅ Parallel execution (Branch A and B run simultaneously)
- ✅ Convergence node (waits for both branches)
- ✅ Input chaining (LLM output feeds into next LLM)
- ✅ Vision support (images passed to Gemini)

---

<div align="center">

**Built with ❤️ using Next.js, React Flow, Google Gemini, Trigger.dev, and Prisma**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

</div>
