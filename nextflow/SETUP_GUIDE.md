# 🚀 NextFlow — Complete Beginner Setup Guide
### "I have never worked on these technologies" friendly — every single step explained

---

## 👋 READ THIS FIRST

This guide assumes you know **nothing** about coding tools. Every step is explained like it's your first time. Follow each step **in order** and don't skip anything.

**Total time to set up:** About 30–45 minutes  
**Difficulty:** Beginner friendly ✅

---

# 🧰 PART 1 — INSTALL THE TOOLS YOU NEED ON YOUR COMPUTER

---

## STEP 1 — Install Node.js

Node.js is the engine that makes this project run. Without it, nothing works.

**On Windows:**
1. Open your browser and go to: **https://nodejs.org**
2. You'll see two green download buttons. Click the one that says **"LTS"** (it says "Recommended For Most Users" underneath)
3. A file named something like `node-v20.x.x-x64.msi` will download
4. Open that file from your Downloads folder
5. A setup wizard opens — click **Next → Next → Next → Install → Finish**
   (Don't change any settings, just keep clicking Next)

**On Mac:**
1. Go to: **https://nodejs.org**
2. Click the **LTS** button to download
3. Open the `.pkg` file from Downloads
4. Click **Continue → Continue → Install → Close**

**Verify it worked:**
- On **Windows**: Press the `Windows key`, type `cmd`, press Enter. A black window opens.
- On **Mac**: Press `Cmd + Space`, type `Terminal`, press Enter.
- In that window, type exactly this and press Enter:
  ```
  node --version
  ```
- You should see something like: `v20.11.0`
- If you see a version number — ✅ Node.js is installed! You can close that window.
- If you see an error — try restarting your computer and trying again.

---

## STEP 2 — Install VS Code (Your Code Editor)

VS Code is the app where you'll open and work with this project.

1. Go to: **https://code.visualstudio.com**
2. Click the big blue **Download** button (it auto-detects your OS)
3. Open the downloaded file
   - **Windows:** Run the `.exe` installer, click Next → Accept Agreement → Next → Install → Finish
   - **Mac:** Drag the VS Code icon to your Applications folder
4. Open **VS Code** from your Desktop or Start Menu / Applications

---

## STEP 3 — Extract the ZIP file and Open in VS Code

1. Find the `nextflow.zip` file (wherever you saved it)
2. Extract it:
   - **Windows:** Right-click the ZIP file → click **"Extract All..."** → click **Extract**
   - **Mac:** Double-click the ZIP file
3. A folder called `nextflow` will appear in the same location
4. Open **VS Code**
5. In VS Code, click the top menu: **File → Open Folder...**
6. A file browser opens — find and click on the `nextflow` folder, then click **"Select Folder"** (Windows) or **"Open"** (Mac)
7. VS Code will open the project. On the LEFT side you'll see a panel with all the files listed — this is normal ✅

---

## STEP 4 — Open the Built-in Terminal in VS Code

The Terminal is like a command center where you type instructions for your computer.

1. In VS Code, look at the very top menu bar
2. Click **Terminal** → **New Terminal**
3. A panel slides up from the **bottom** of VS Code
4. You'll see a blinking cursor and some text showing your folder path

> ⚠️ **IMPORTANT:** Whenever this guide says **"run this command"** or **"type this"** — you type it into this terminal panel and press **Enter**.

> 💡 **TIP:** If you close VS Code and reopen it, you'll need to open the terminal again with Terminal → New Terminal.

---

# 🔑 PART 2 — CREATE YOUR 5 FREE ACCOUNTS AND GET API KEYS

An API key is like a password that lets your app talk to an external service. You need 5 of them. **All are completely free.**

---

## STEP 5 — Neon (Your Database — stores workflows and history)

1. Open your browser and go to: **https://neon.tech**
2. Click **"Sign up"** — you can sign up with Google or GitHub (easiest) or email
3. After logging in, you'll see a dashboard
4. Click the **"Create a project"** button
5. Fill in:
   - **Project name:** type anything, e.g. `nextflow-db`
   - **Postgres version:** leave as default
   - **Region:** pick one closest to you (e.g. if you're in India, choose `AWS / Singapore` or `AWS / Mumbai`)
6. Click **"Create project"**
7. A popup appears with your connection details. Look for the **"Connection string"** — it looks like this:
   ```
   postgresql://alex:AbCdEfGh@ep-cool-breeze-123.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
8. Click the **copy icon** next to it (or select all and Ctrl+C)
9. Open **Notepad** (Windows) or **TextEdit** (Mac) and paste it there temporarily — you'll need it in Step 10

---

## STEP 6 — Clerk (Handles User Login)

1. Go to: **https://clerk.com**
2. Click **"Sign up"** at the top right
3. Sign up with GitHub, Google, or email
4. After signing in, you'll see "Create your first application"
5. In the **"Application name"** field, type: `NextFlow`
6. Under **"How will your users sign in?"** — make sure **Email address** is checked
7. Click **"Create application"**
8. You'll land on your app dashboard
9. In the **left sidebar**, find and click **"API Keys"**
10. You'll see two keys — copy both to your Notepad:
    - **Publishable key** — looks like: `pk_test_abc123xyz456...`
    - **Secret key** — looks like: `sk_test_def456uvw789...`
    - (There's a little eye icon or copy button next to each)

---

## STEP 7 — Google AI Studio (Gemini — the AI brain of your app)

1. Go to: **https://aistudio.google.com**
2. Sign in with your **Google account**
3. Once inside, look for a button that says **"Get API key"** — it's usually on the left sidebar or top area
4. Click it
5. Click **"Create API key"**
6. A dialog appears — click **"Create API key in new project"**
7. Your key appears — it looks like: `AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
8. Copy it and paste it in your Notepad

---

## STEP 8 — Trigger.dev (Runs AI and Video Tasks in the Background)

1. Go to: **https://trigger.dev**
2. Click **"Sign up"**
3. Sign up with GitHub or email
4. After signup, it may ask you to create an organization — type any name (e.g. your name)
5. You'll see a "Create new project" screen:
   - **Name:** type `nextflow`
   - **Runtime:** select **Node.js**
   - Click **"Create project"**
6. Now you need to find 3 things. In the **left sidebar**:

   **A. Project Ref:**
   - Click **"Settings"** in the left sidebar
   - Look for **"Project ref"** — it looks like: `proj_xxxxxxxxxxxxxxxxxxx`
   - Copy it to Notepad

   **B. Secret Key:**
   - Click **"API Keys"** in the left sidebar
   - You'll see a key starting with `tr_dev_...`
   - Click the copy icon next to it, paste to Notepad

   **C. Public Key:**
   - On the same API Keys page, look for a key starting with `pk_dev_...`
   - Copy it to Notepad

---

## STEP 9 — Transloadit (Handles File Uploads)

1. Go to: **https://transloadit.com**
2. Click **"Sign up"** and create a free account
3. After logging in, click on your **profile picture or name** at the top right
4. Click **"Account"** or go directly to: **https://transloadit.com/accounts/credentials**
5. You'll see your API credentials:
   - **Auth Key** — a short string like: `abcd1234efgh5678ijkl`
   - **Auth Secret** — a longer string
6. Copy **both** to your Notepad (label them so you know which is which)

---

# ⚙️ PART 3 — PUT YOUR API KEYS INTO THE PROJECT

Now you'll open the project files and replace the placeholder text with your real keys.

---

## STEP 10 — Edit the .env.local file

This is the most important step. This file holds all your secret keys.

1. In VS Code, look at the left file panel
2. Find the file named **`.env.local`** — click it to open it
   > 💡 If you don't see it, look carefully — it starts with a dot. If files are hidden, click the arrow next to the folder name to expand it, or go to View → Explorer.
3. The file opens in the editor. It looks like this:
   ```
   DATABASE_URL="{ENTER YOUR NEON POSTGRESQL CONNECTION STRING}"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="{ENTER YOUR CLERK PUBLISHABLE KEY}"
   ...
   ```
4. For each line, **delete the entire placeholder including the curly braces `{...}` and the quotes**, and replace it with your actual key **keeping the quotes**.

Here is exactly what each line should look like after you fill it in:

---

**DATABASE_URL** — paste your Neon connection string from Step 5:
```
DATABASE_URL="postgresql://alex:mypassword@ep-cool-breeze.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
```

**NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY** — paste your Clerk Publishable key from Step 6:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_abc123xyz456def789..."
```

**CLERK_SECRET_KEY** — paste your Clerk Secret key from Step 6:
```
CLERK_SECRET_KEY="sk_test_def456uvw789ghi012..."
```

**GEMINI_API_KEY** — paste your Google Gemini key from Step 7:
```
GEMINI_API_KEY="AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

**TRIGGER_SECRET_KEY** — paste your Trigger.dev Secret key from Step 8:
```
TRIGGER_SECRET_KEY="tr_dev_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

**NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY** — paste your Trigger.dev Public key from Step 8:
```
NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY="pk_dev_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

**TRANSLOADIT_AUTH_KEY** — paste your Transloadit Auth Key from Step 9:
```
TRANSLOADIT_AUTH_KEY="abcd1234efgh5678ijkl"
```

**TRANSLOADIT_AUTH_SECRET** — paste your Transloadit Auth Secret from Step 9:
```
TRANSLOADIT_AUTH_SECRET="abcdefghijklmnopqrstuvwxyz1234567890ab"
```

**NEXT_PUBLIC_TRANSLOADIT_AUTH_KEY** — paste the **same** Transloadit Auth Key again:
```
NEXT_PUBLIC_TRANSLOADIT_AUTH_KEY="abcd1234efgh5678ijkl"
```

5. After filling in ALL lines, save the file: press **Ctrl+S** (Windows) or **Cmd+S** (Mac)

> ✅ Quick check: every line in .env.local should have a real value, no more curly braces `{}` or placeholder text anywhere.

---

## STEP 11 — Edit the trigger.config.ts file

1. In VS Code left panel, find and click **`trigger.config.ts`**
2. Find this line near the top:
   ```ts
   project: "{ENTER YOUR TRIGGER.DEV PROJECT REF}",
   ```
3. Replace just the `{ENTER YOUR TRIGGER.DEV PROJECT REF}` part with your Project Ref from Step 8. It should look like:
   ```ts
   project: "proj_xxxxxxxxxxxxxxxxxxx",
   ```
4. Save the file: **Ctrl+S** / **Cmd+S**

---

# 📦 PART 4 — INSTALL PACKAGES AND SET UP THE DATABASE

---

## STEP 12 — Install all packages

Packages are code libraries your project depends on. This is like installing apps your app needs.

1. Go to the **Terminal** at the bottom of VS Code
2. Check that the terminal shows you're in the right folder. You should see `nextflow` in the path, like:
   - Windows: `C:\Users\YourName\Desktop\nextflow>`
   - Mac: `~/Desktop/nextflow $`
3. If you don't see `nextflow` in the path, type this and press Enter:
   ```
   cd nextflow
   ```
4. Now type this command and press **Enter**:
   ```
   npm install
   ```
5. You'll see a LOT of text scrolling — this is normal! It's downloading all the packages.
6. **Wait patiently** — this can take 2–4 minutes depending on your internet.
7. When it's done, the scrolling stops and you see the cursor again with something like:
   ```
   added 847 packages in 45s
   ```
8. ✅ Done! Don't worry about any yellow "warning" messages — those are fine.

---

## STEP 13 — Set up the database tables

This creates all the necessary tables in your Neon database.

**Command 1:** Type this and press Enter:
```
npx prisma generate
```
Wait for it. You should see:
```
✔ Generated Prisma Client (v5.x.x)
```
before this below command to run always rememeber prism is gonna take command from .env not from .env.local so before pushing below command write this below command

**Command 2:** Type this and press Enter:
```
copy .env.local .env
```
it will copy your .env.local to your .env


**Command 3:** Type this and press Enter:
```
npx prisma db push
```
Wait for it. You should see:
```
Your database is now in sync with your Prisma schema. 🚀
```

> ❌ **If you see an error here:** 99% of the time it means your `DATABASE_URL` in `.env.local` is wrong. Open that file, delete the DATABASE_URL value, go back to Neon (https://neon.tech), copy the connection string again fresh, and paste it in. Then try `npx prisma db push` again.

---

# ▶️ PART 5 — RUN THE APP

---

## STEP 14 — Open a second terminal window

You need **two terminals running at the same time** (one for the background worker, one for the web app).

1. Look at the terminal panel at the bottom of VS Code
2. At the top-right of that terminal panel, you'll see a **"+" icon** or a **split icon**
3. Click the **"+"** — a second terminal tab opens
4. You can switch between them by clicking **"1: bash"** or **"2: bash"** (or similar names) in that panel

---

## STEP 15 — Start the Trigger.dev background worker (in Terminal 1)

The background worker runs your AI and video processing tasks.

1. Click on your **first terminal** (Terminal 1)
2. Type this and press **Enter**:
   ```
   npx trigger.dev@latest dev
   ```
3. One of two things will happen:
   
   **A) It asks you to log in:**
   - It will show a URL — copy it and open it in your browser, OR it may automatically open a browser tab
   - Log into your Trigger.dev account in the browser
   - Come back to VS Code — it should continue automatically
   
   **B) It just starts working:**
   - You'll see output like:
     ```
     ✔ Connected to Trigger.dev  
     ✔ Watching for task changes...
     ```

4. **LEAVE THIS TERMINAL RUNNING.** Do not type anything else in Terminal 1 and do not close it. It needs to keep running.

---

## STEP 16 — Start the web app (in Terminal 2)

1. Click on your **second terminal** (Terminal 2)
2. Type this and press **Enter**:
   ```
   npm run dev
   ```
3. After 5–10 seconds you'll see:
   ```
    ▲ Next.js 14.x.x
    - Local:   http://localhost:3000
    ✓ Ready in 2.5s
   ```
4. **LEAVE THIS TERMINAL RUNNING TOO.**

---

## STEP 17 — Open the app in your browser 🎉

1. Open **Google Chrome** (or any browser)
2. Click in the address bar at the top
3. Type: **http://localhost:3000**
4. Press **Enter**
5. You should see the **NextFlow login page** with a purple lightning bolt logo!

If you see this — congratulations! 🎉 Your app is running!

---

# ✅ PART 6 — FIRST TIME USING THE APP

---

## STEP 18 — Create your account

1. On the login page, click **"Sign up"**
2. Enter your email address and choose a password
3. Clerk might send you a verification email — check your inbox and click the confirmation link
4. After verifying, you'll be taken into the main app

---

## STEP 19 — Understanding what you see

When you first open the app you'll see:

```
┌─────────────────────────────────────────────────────────────────┐
│  ⚡ NextFlow    [Workflow Name]    [Save] [Export] [History] [Run]│  ← TOP BAR
├──────────┬──────────────────────────────────────────────────────┤
│          │                                                        │
│  📝 Text  │                                                        │
│  🖼 Image │         CANVAS AREA                                    │
│  🎬 Video │    (nodes and connections appear here)                 │
│  🧠 LLM   │    (a sample workflow is already loaded!)              │
│  ✂ Crop   │                                                   🗺  │
│  🎞 Frame │                                              (minimap)│
└──────────┴──────────────────────────────────────────────────────┘
LEFT SIDEBAR                                                BOTTOM RIGHT
```

**Left sidebar** = 6 types of nodes you can add to your workflow  
**Canvas** = the big area where you build workflows  
**Top bar** = Save, Run, see History  
**Minimap** = tiny overview of the whole canvas (bottom right)

---

## STEP 20 — Try it out with the sample workflow

A "Product Marketing Kit Generator" sample workflow is already loaded.

1. Click the **"Run"** button (top right, purple button)
2. Watch the nodes on the canvas — they'll light up with a **pulsing purple glow** as they run
3. When an LLM node finishes, you'll see the **AI's response appear right on the node** itself
4. After it finishes, click the **"History"** button (top right) — a panel slides in from the right showing the run details

> 💡 Note: The image and video upload nodes will show as "no file" since you haven't uploaded anything yet. That's fine — text and LLM nodes will still work.

---

## STEP 21 — Adding your own nodes

**To add a node:**
- Click any button in the **left sidebar** (e.g. "Text") — it appears in the center of the canvas
- OR drag a button from the sidebar and drop it anywhere on the canvas

**To connect two nodes:**
- Hover your mouse over the colored dot on the **right edge** of a node
- Click and hold that dot, then drag to a colored dot on the **left edge** of another node
- Release to create a connection (purple animated line)

**To delete a node:**
- Click the node once to select it (it gets a purple border)
- Press the `Delete` key or `Backspace` key on your keyboard

**To move nodes:**
- Click and drag a node to reposition it

**To zoom in/out:**
- Use your mouse scroll wheel on the canvas
- Or use the controls buttons (bottom left of canvas)

---

# 🆘 PART 7 — WHEN THINGS GO WRONG (Troubleshooting)

Don't panic if you see errors. Here are the most common ones and exactly how to fix them:

---

### ❌ Error: "Cannot find module" OR "Module not found"
**What it means:** A package is missing.  
**Fix:** Run this in the terminal:
```
npm install
```

---

### ❌ Error about Prisma or database (mentions "PrismaClient" or "connection refused")
**What it means:** The database connection string is wrong.  
**Fix:**
1. Open `.env.local` in VS Code
2. Find the line starting with `DATABASE_URL=`
3. Delete everything after the `=` sign
4. Go to https://neon.tech → your project → click "Connection string" → copy it
5. Paste it between quotes: `DATABASE_URL="paste-here"`
6. Save the file (Ctrl+S)
7. In the terminal, run: `npx prisma db push`

---

### ❌ Login page shows but signing in gives an error (Clerk error)
**What it means:** Your Clerk keys are wrong or missing.  
**Fix:**
1. Open `.env.local`
2. Check `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — must start with `pk_test_`
3. Check `CLERK_SECRET_KEY` — must start with `sk_test_`
4. If wrong, go to https://dashboard.clerk.com → your app → API Keys → copy them again
5. Save `.env.local`
6. In Terminal 2, press `Ctrl+C` to stop the app, then run `npm run dev` again

---

### ❌ LLM node gets stuck on "Running..." and never finishes
**What it means:** Either the Gemini API key is wrong, or the Trigger.dev worker stopped.  
**Fix:**
1. **Check Terminal 1** — is `npx trigger.dev@latest dev` still running? If it shows errors or stopped, run it again:
   ```
   npx trigger.dev@latest dev
   ```
2. **Check your Gemini key:** Open `.env.local`, make sure `GEMINI_API_KEY` has your actual key (not placeholder text)
3. Save `.env.local` and restart the app: press `Ctrl+C` in Terminal 2, then `npm run dev`

---

### ❌ File upload fails or shows an error on the image/video nodes
**What it means:** Transloadit keys are wrong.  
**Fix:**
1. Open `.env.local`
2. Check these three lines have the correct values from your Transloadit account:
   - `TRANSLOADIT_AUTH_KEY`
   - `TRANSLOADIT_AUTH_SECRET`
   - `NEXT_PUBLIC_TRANSLOADIT_AUTH_KEY` (same value as AUTH_KEY)
3. Go to https://transloadit.com/accounts/credentials if you need to copy them again

---

### ❌ "Port 3000 is already in use"
**What it means:** The app is already running somewhere.  
**Fix:**
- **Windows:** Run this in terminal: `npx kill-port 3000`
- **Mac/Linux:** Run this: `lsof -ti:3000 | xargs kill -9`
- Then run `npm run dev` again

---

### ❌ I closed VS Code. How do I start everything again?
Every time you want to use the app, you need to restart it:
1. Open VS Code → File → Open Folder → select `nextflow`
2. Open Terminal (Terminal → New Terminal)
3. Open a second terminal (click the "+" in the terminal panel)
4. **Terminal 1:** `npx trigger.dev@latest dev`
5. **Terminal 2:** `npm run dev`
6. Open browser → http://localhost:3000

---

### ❌ My changes aren't showing up in the browser
**Fix:** Hard-refresh the browser page:
- **Windows:** Press `Ctrl + Shift + R`
- **Mac:** Press `Cmd + Shift + R`

---

# 🌐 PART 8 — PUT YOUR APP ONLINE (Deploy to Vercel) — Optional

Want a real URL so anyone can use your app? Follow these steps.

---

## STEP 22 — Create a GitHub account and upload your code

1. Go to **https://github.com** → Click **Sign up** → create a free account
2. After signing in, click the **"+"** icon at the top right → **"New repository"**
3. Fill in:
   - **Repository name:** `nextflow`
   - **Visibility:** Select **Private** (important — keeps your code private)
4. Click **"Create repository"**
5. GitHub shows you some commands. Go back to VS Code terminal and run them one by one:
   ```
   git init
   git add .
   git commit -m "first commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/nextflow.git
   git push -u origin main
   ```
   (Replace `YOUR_USERNAME` with your actual GitHub username)
6. It may ask for your GitHub username and password (use a personal access token if on newer Git — GitHub will guide you)

---

## STEP 23 — Deploy on Vercel

1. Go to **https://vercel.com** → Click **Sign up** → sign up with GitHub
2. Click **"Add New..."** → **"Project"**
3. You'll see your GitHub repos listed — find `nextflow` and click **"Import"**
4. **BEFORE clicking Deploy**, scroll down to find **"Environment Variables"**
5. You need to add every key from your `.env.local` file here. Click "Add" for each one:
   - Name: `DATABASE_URL` | Value: (your Neon connection string)
   - Name: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Value: (your Clerk key)
   - Name: `CLERK_SECRET_KEY` | Value: (your Clerk secret)
   - Name: `GEMINI_API_KEY` | Value: (your Gemini key)
   - Name: `TRIGGER_SECRET_KEY` | Value: (your Trigger secret)
   - Name: `NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY` | Value: (your Trigger public key)
   - Name: `TRANSLOADIT_AUTH_KEY` | Value: (your Transloadit auth key)
   - Name: `TRANSLOADIT_AUTH_SECRET` | Value: (your Transloadit secret)
   - Name: `NEXT_PUBLIC_TRANSLOADIT_AUTH_KEY` | Value: (same as auth key)
   - Name: `NEXT_PUBLIC_APP_URL` | Value: (you'll fill this after deploy — leave blank for now)
6. Click **Deploy**
7. Wait 2–3 minutes — Vercel will build and deploy your app
8. When done, you'll see a URL like: `https://nextflow-abc123.vercel.app` — **this is your live app!**

---

## STEP 24 — Deploy Trigger.dev tasks to the cloud

Right now your background tasks only run on your local computer. To make them run in the cloud:

1. In VS Code terminal, run:
   ```
   npx trigger.dev@latest deploy
   ```
2. Follow any login prompts
3. When it finishes, your AI tasks run in Trigger.dev's cloud — not on your laptop!

---

## STEP 25 — Update Clerk with your live URL

Clerk needs to know your live Vercel URL to allow logins:

1. Go to https://dashboard.clerk.com → your NextFlow app
2. In the left sidebar, click **"Domains"**
3. Click **"Add domain"**
4. Enter your Vercel URL, e.g. `https://nextflow-abc123.vercel.app`
5. Click **Add**
6. Also go back to Vercel → your project → Settings → Environment Variables
7. Update `NEXT_PUBLIC_APP_URL` to your Vercel URL
8. Go to Vercel → your project → click **"Redeploy"**

---

# 📋 QUICK CHEAT SHEET — Commands You'll Use

Copy-paste these into your terminal whenever needed:

| What you want to do | Command |
|---|---|
| Install packages (first time setup) | `npm install` |
| **Start background worker** (needed every session) | `npx trigger.dev@latest dev` |
| **Start the web app** (needed every session) | `npm run dev` |
| Sync database after changes | `npx prisma db push` |
| Open visual database browser | `npx prisma studio` |
| Deploy tasks to cloud | `npx trigger.dev@latest deploy` |
| Build app for production | `npm run build` |

---

# 📁 What Every File Does — In Plain English

```
nextflow/
│
├── 🔑 .env.local              ← YOUR SECRET API KEYS LIVE HERE
│                                 Never share this file with anyone!
│
├── 🔑 trigger.config.ts       ← Your Trigger.dev project ID goes here
│
├── package.json               ← Shopping list of all packages the app needs
├── tsconfig.json              ← TypeScript settings (leave as-is)
├── tailwind.config.ts         ← Visual theme: dark purple colors matching Krea.ai
├── next.config.js             ← Next.js settings (leave as-is)
├── postcss.config.js          ← CSS processing (leave as-is)
│
├── prisma/
│   └── schema.prisma          ← Blueprint of your database tables
│                                 3 tables: Workflows, WorkflowRuns, NodeRuns
│
├── trigger/                   ← BACKGROUND TASKS (run on Trigger.dev servers)
│   ├── llm-task.ts            ← Sends prompts to Google Gemini AI, gets back text
│   ├── crop-image-task.ts     ← Downloads image → crops with FFmpeg → uploads result
│   └── extract-frame-task.ts ← Downloads video → grabs frame with FFmpeg → uploads it
│
└── src/
    ├── app/
    │   ├── layout.tsx         ← The outer shell of every page (wraps with Clerk auth)
    │   ├── page.tsx           ← The root URL (just redirects to /workflow or /sign-in)
    │   ├── globals.css        ← App-wide styles (dark background, purple colors, glow effects)
    │   ├── sign-in/           ← The login page (built with Clerk)
    │   ├── sign-up/           ← The sign up page (built with Clerk)
    │   ├── workflow/          ← The main canvas page (what you see after logging in)
    │   └── api/               ← Backend logic (server-side code)
    │       ├── workflows/     ← Saves/loads your workflow from the database
    │       ├── execute/       ← "Run this node" → fires a Trigger.dev background task
    │       ├── history/       ← Saves and retrieves run history from database
    │       └── upload/        ← Uploads a file via Transloadit, returns a URL
    │
    ├── components/
    │   ├── nodes/             ← The 6 draggable coloured boxes on the canvas
    │   │   ├── TextNode.tsx         ← Blue box: simple text input
    │   │   ├── ImageUploadNode.tsx  ← Green box: image file upload with preview
    │   │   ├── VideoUploadNode.tsx  ← Orange box: video file upload with player
    │   │   ├── LLMNode.tsx          ← Purple box: AI model selector, shows result inline
    │   │   ├── CropImageNode.tsx    ← Teal box: crop sliders (x/y/width/height)
    │   │   └── ExtractFrameNode.tsx ← Pink box: video frame extraction with timestamp
    │   │
    │   ├── canvas/
    │   │   ├── WorkflowEditor.tsx  ← The full page: ties left panel + canvas + right panel
    │   │   ├── WorkflowCanvas.tsx  ← The actual drag-and-drop canvas (React Flow)
    │   │   └── TopBar.tsx          ← Top navigation (logo, workflow name, Run button)
    │   │
    │   └── sidebar/
    │       ├── LeftSidebar.tsx     ← Left panel: 6 node buttons + search + drag support
    │       └── RightSidebar.tsx    ← Right panel: run history with click-to-expand details
    │
    ├── hooks/
    │   └── useWorkflowExecution.ts ← The engine: sorts nodes in dependency order,
    │                                  runs independent branches at the same time
    │
    ├── lib/
    │   ├── prisma.ts          ← Sets up database connection (reused everywhere)
    │   └── utils.ts           ← Small helpers: format time, merge CSS classes, etc.
    │
    ├── store/
    │   └── workflowStore.ts   ← Global memory: holds all nodes, edges, history in RAM
    │                             (Zustand state — persists while app is open)
    │
    ├── types/
    │   └── index.ts           ← TypeScript shapes: what data each node type holds
    │
    └── middleware.ts          ← Security guard: blocks /workflow if not logged in
```

---

# 💡 How The Whole Thing Works — Simple Explanation

```
YOU                                    CLOUD SERVICES
 │                                           │
 │  1. Drag nodes, connect them              │
 │  2. Click "Run"                           │
 │                                           │
 ├──→ App sorts nodes by dependency order    │
 │    (topological sort)                     │
 │                                           │
 ├──→ Independent branches run SIMULTANEOUSLY│
 │    (not one by one — true parallel!)      │
 │                                           │
 ├──→ Each execution node calls /api/execute │
 │                                           │
 │    /api/execute fires a Trigger.dev task ─┼──→ Trigger.dev Worker
 │                                           │         │
 │                                           │         ├──→ Google Gemini (LLM node)
 │                                           │         ├──→ FFmpeg crop (Crop node)
 │                                           │         └──→ FFmpeg extract (Frame node)
 │                                           │         │
 │    Result comes back ←────────────────────┼─────────┘
 │                                           │
 ├──→ Result shows INLINE on the node        │
 │    (no separate output panel!)            │
 │                                           │
 └──→ Everything saved to Neon database      │
      (run history, node details, timing)
```

---

*🎉 You've built a professional AI workflow builder from scratch. Amazing work!*

*Built with: Next.js 14 · TypeScript · React Flow · Clerk · Trigger.dev · Google Gemini · Transloadit · Prisma · Neon PostgreSQL · Zustand · Tailwind CSS*
