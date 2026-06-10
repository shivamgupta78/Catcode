# 🐱 CatCode - A High-Performance Full-Stack Judge Platform

CatCode is an industry-standard, fully responsive full-stack competitive programming and judge application designed to replicate the robust core architectural functionalities of platforms like LeetCode. It features a complete runtime environment connection, secure dual-tier identity access management, asynchronous state updates, and an interactive workspace for developers to test, compile, and track code submissions seamlessly.

🚀 **Live Production Deployment:** [catcode-app.vercel.app]

---

## 📸 Core UI Visuals & Dashboard Preview

### 1. Unified Identity Gateway (Secure Login / Signup Portal)
![Authentication Interface](https://raw.githubusercontent.com/shivamgupta78/catcode-app/frontend/public/screenshots/signup.png)
(https://raw.githubusercontent.com/shivamgupta78/catcode-app/frontend/public/screenshots/login.png)
*An intelligent routing checkpoint that strictly forces validation tokens before exposing backend database models or core user dashboard interfaces.*

### 2. Analytical Workspace & Problem Repository
![Platform Dashboard](https://raw.githubusercontent.com/shivamgupta78/catcode-app/frontend/public/screenshots/dashboard.png)
*An dynamic multi-attribute list rendering indexed algorithms, structured categorized sorting, and real-time complexity metadata tags.*

### 3. Asynchronous Execution Console & Interactive Code Terminal
![Monaco Editor Code Workspace](https://raw.githubusercontent.com/shivamgupta78/catcode-app/frontend/public/screenshots/editor.png)
*A state-of-the-art developer code editor layout designed with multi-language parsing, persistent memory caches, and terminal streaming blocks.*

---

## ✨ Comprehensive Architectural Features

### 🔐 1. Hardened Cryptographic Authentication & Token Lifecycle
* **State-of-the-Art Cryptography:** Integrated **BCrypt.js** micro-services to enforce one-way asynchronous password hashing with `10 salt rounds` prior to committing individual object profiles inside the MongoDB schemas.
* **Secure Session Handshakes:** Implemented decoupled multi-tiered session tracking powered by stateless **JSON Web Tokens (JWT)** distributed dynamically through secured server-response channels.
* **Dual-Tier Layer Security Framework:** Embedded strict automated Cross-Origin Resource Sharing (**CORS**) custom configurations combined with strict `HttpOnly`, `Secure`, and `SameSite: 'None'` cookie headers to shield user active identity layers against Cross-Site Scripting (XSS) and CSRF attacks.

### 💻 2. Interactive Enterprise Coding Workspace (Monaco Integration)
* **Monaco Engine Configuration:** Leveraged Microsoft's robust **Monaco Code Editor Core Layout** inside the client engine, embedding full capabilities such as advanced auto-completion, synchronous multi-language syntax highlighting, syntax linting, and line-error pointers.
* **Isolated Compilation Flow:** Engineered a structured abstract runtime pipeline capable of structuring complex client source scripts, transforming raw text arrays into multi-platform structural code configurations for remote container pipelines.

### 📊 3. Asynchronous Code Execution & Submission Tracking System
* **Historical State Archival:** Formulated historical schema connections linking active user state metrics with an internal **Mongoose Submissions Collection**, capturing data logs including code syntax snippets, compiler metadata, memory overheads, and millisecond runtime evaluations.
* **Live Submission Stream:** Implemented transactional retrieval endpoints sorted sequentially by chronological order (`createdAt: -1`) mapping exact test case execution ratios (e.g., `testCasesPassed / testCasesTotal`) to feed active frontend visual trackers instantly.

### 🛠️ 4. Enterprise Problem Management System (Administrative Admin CRUD)
* **Strict Access Control Enforcements:** Created custom enterprise route middleware configurations specifically tracking structural identity role claims (`role: "admin"` vs `role: "user"`) to safeguard sensitive back-end modification points.
* **Full Model Mutation Orchestration:** Admin controllers are loaded with seamless mutations to programmatically Create (`POST`), Update (`PUT`), and Delete (`DELETE`) multi-layered computational schemas directly from the client interface—manipulating test case models without requiring direct database access.

---

## 🏗️ Core Distributed Technology Stack

| Architecture Layer | Core Frameworks / Services Used | Purpose & System Role |
| :--- | :--- | :--- |
| **Frontend UI/UX** | React.js (v18+), Tailwind CSS Architecture, React Router DOM | High-fidelity component rendering, dynamic single page state machine. |
| **Backend Core** | Node.js Runtime environment, Express.js Server Framework | Distributed RESTful routing API layer, middleware validation pipelines. |
| **Identity Cache** | Redis Global Caching Protocol Serverless Client | Handles active blocklists, token verification limits, and high-speed memory lookups. |
| **Database System** | MongoDB Atlas distributed system (Mongoose ODM layer) | Document-oriented archival system storing hashed profiles and test case arrays. |
| **Infrastructure** | Vercel Serverless Computing Architecture Platform | Continuous deployment grid hosting highly scalable backend lambda nodes and frontend assets. |

---

## ⚙️ Detailed Production & Local Setup Manual

Follow these extensive configurations closely to initialize a fully operational server instances across both local machines and distributed development workflows:

### 📥 Step 1: Clone Repository and Establish Work Directories
Download the structured codebase package locally and isolate the decoupled frontend and backend clusters using your terminal terminal:
```bash
git clone [https://github.com/shivamgupta78/catcode-app.git](https://github.com/shivamgupta78/catcode-app.git)
cd catcode-app
```

Markdown
# ⚙️ Step 2: Configure and Boot Node.js Application Server (Backend)

1. Route directly into the server cluster root path:
```bash
   cd backend
```
1 . Install the necessary development dependencies and micro-service binaries locked inside the package manager manifest:

```Bash
npm install
```

# 2. Establish a standard configuration file named .env inside the backend directory root and fulfill the variables precisely:

```bash
Code snippet
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/catcode?retryWrites=true&w=majority
JWT_SECRET=your_ultra_secure_long_signature_cryptographic_key_phrase
REDIS_URL=redis://default:<password>@your-redis-endpoint-domain.cloud.redislabs.com:12345
NODE_ENV=development
```



3. Fire up the local monitoring server module to observe request streams via active logging:

```bash
npm start
```

# 🎨 Step 3: Configure and Initialize Client Interface Engine (Frontend)
1. **Open up a secondary split console panel and position yourself directly inside the user interface cluster directory**

```bash
cd frontend
```

2. Unpack and resolve all visual nodes and core system node modules:

```Bash
npm install
```

3. Initialize the environment blueprint by defining a local variable sheet named .env.local to point towards your active server cluster endpoint:
```bash
Code snippet
VITE_BACKEND_API_URL=http://localhost:5000
```

4. Fire up the high-speed local build server engine to run and test the complete application client:

```bash
npm run dev
```