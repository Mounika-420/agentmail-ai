# AgentMail AI

An advanced, intelligent email campaign workspace and predictive marketing platform. AgentMail AI empowers businesses and marketers to create, optimize, schedule, and analyze automated email sequences using cutting-edge generative artificial intelligence and predictive CRM segmenting.

---

## 🚀 Key Features

* **Intelligent Campaign Planner:** Map out and configure advanced drip sequences and automated dispatch paths.
* **Generative Copywriter & Subject Line Optimizer:** Generate high-converting email drafts and catchy subject lines tailored to specific target audiences.
* **Smart Spam Risk Analysis:** Evaluate email copy for potential spam triggers, and receive automated readability and deliverability feedback.
* **Demographic Customer Segmentation:** Group your audience base dynamically using interactive customer databases.
* **Predictive Dispatch Scheduler:** Automatically predict optimal delivery windows based on targeted customer engagement patterns.
* **Interactive AI Chat Assistant:** Consult a context-aware AI assistant to brainstorm strategies, write email drafts, and refine audience targeting.

---

## 🛠️ Tech Stack

- **Frontend:** React 18 with high-speed Vite bundler and Tailwind CSS for a gorgeous, responsive dark workspace.
- **Backend:** Node.js + Express.js API proxy server bundled into a self-contained runtime.
- **AI Engine:** Gemini API integration for advanced generative marketing features.

---

## ⚙️ Quick Start (Run Locally)

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### 1. Install Dependencies
Clone the repository, navigate into the project folder, and install the package dependencies:
```bash
npm install
```

### 2. Configure Environment Variables
Create a file named `.env` in the root of the project (you can copy `.env.example` as a starting point) and populate your credentials:
```env
# Your private Gemini API key from Google AI Studio / Google Cloud Developer Console
GEMINI_API_KEY="your-gemini-api-key-here"

# The hosted URL (or localhost for development)
APP_URL="http://localhost:3000"
```

### 3. Build & Compile
Compile the client-side single-page app and bundle the server backend:
```bash
npm run build
```

### 4. Run the Server
Launch the production-ready full-stack application:
```bash
npm start
```
Open your browser and navigate to **`http://localhost:3000`** to start using AgentMail AI.

---

## 🌐 Production Deployment

Since the repository is fully self-contained, you can deploy it to any cloud provider of your choice in seconds.

### Deploying to Render, Railway, or Heroku
1. Connect your GitHub repository (`Mounika-420/agentmail-ai`) to the platform.
2. Configure the following deployment settings:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
3. Add your environment variables in the provider's settings console:
   - Set `GEMINI_API_KEY` to your secure API key.
   - Set `NODE_ENV` to `production`.

---

## 📤 How to Push these Changes to Your GitHub Repository

To update your GitHub page and completely replace the "AI Studio" banner with this custom presentation, run these commands in your local computer's terminal (inside the `agentmail-ai` folder):

```powershell
# 1. Fetch latest changes from the remote server
git pull origin main

# 2. Stage the modified files and our new custom README
git add .

# 3. Commit your changes
git commit -m "docs: replace AI Studio banner with custom professional README and remove mentions"

# 4. Push to your repository
git push origin main
```
