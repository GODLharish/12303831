# Affordmed Campus Hiring Evaluation — Full Stack

## 📁 Repository Structure

```
<your-roll-number>/                    ← GitHub repo name = your roll number
├── logging_middleware/                ← Reusable logging package (TypeScript)
│   ├── src/index.ts
│   ├── package.json
│   └── tsconfig.json
├── notification_app_be/               ← Backend (Express + TypeScript)
│   ├── src/
│   │   ├── config/auth.ts
│   │   ├── controller/notificationController.ts
│   │   ├── domain/notification.ts
│   │   ├── middleware/errorHandler.ts
│   │   ├── route/notificationRoutes.ts
│   │   ├── service/notificationService.ts
│   │   ├── service/priorityService.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── notification_app_fe/               ← Frontend (Next.js + Material UI)
│   ├── src/
│   │   ├── api/notificationApi.ts
│   │   ├── component/NotificationCard.tsx
│   │   ├── pages/index.tsx
│   │   ├── pages/_app.tsx
│   │   ├── state/useNotifications.ts
│   │   └── styles/global.css
│   ├── package.json
│   └── tsconfig.json
├── notification_system_design.md      ← Stages 1–6 written answers
└── .gitignore
```

---

## ✅ STEP-BY-STEP SETUP GUIDE

---

### STEP 1 — Create GitHub Repository

1. Go to github.com → New Repository
2. **Repository Name = Your Roll Number** (e.g. `21BCS1042`)
3. Set to **Public**
4. Do NOT include your name or "Affordmed" anywhere in repo name, README, or commits
5. Clone it locally:
```bash
git clone https://github.com/<your-username>/<your-roll-number>.git
cd <your-roll-number>
```

---

### STEP 2 — Register with Test Server

Use Postman or curl to call the Registration API **once**:

```
POST http://4.224.186.213/evaluation-service/register
Content-Type: application/json
```

```json
{
  "email": "your_email@college.edu",
  "name": "Your Full Name",
  "mobileNo": "9999999999",
  "githubUsername": "your-github-username",
  "rollNo": "your-roll-number",
  "accessCode": "the-code-from-your-email"
}
```

**⚠️ SAVE the response — you cannot get clientID and clientSecret again:**
```json
{
  "clientID": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "clientSecret": "xxxxxxxxxxxxxxxxxxxxxx"
}
```

---

### STEP 3 — Get Auth Token (to test APIs)

```
POST http://4.224.186.213/evaluation-service/auth
Content-Type: application/json
```

```json
{
  "email": "your_email@college.edu",
  "name": "Your Full Name",
  "rollNo": "your-roll-number",
  "accessCode": "your-access-code",
  "clientID": "your-client-id",
  "clientSecret": "your-client-secret"
}
```

Save the `access_token` from the response.

---

### STEP 4 — Copy Project Files into Repo

Copy all files from this project into your cloned repo:

```
logging_middleware/
notification_app_be/
notification_app_fe/
notification_system_design.md
.gitignore
```

---

### STEP 5 — Set Up Logging Middleware

```bash
cd logging_middleware
npm install
npm run build
```

---

### STEP 6 — Set Up Backend

```bash
cd notification_app_be
npm install

# Create .env file from example
cp .env.example .env
```

Edit `.env` and fill in your real values:
```
PORT=8000
TEST_SERVER_URL=http://4.224.186.213/evaluation-service
CLIENT_ID=your_client_id
CLIENT_SECRET=your_client_secret
ACCESS_CODE=your_access_code
EMAIL=your_email@college.edu
NAME=Your Full Name
ROLL_NO=your_roll_number
```

Run the backend:
```bash
npm run dev
```

Test it:
```bash
# Health check
curl http://localhost:8000/health

# All notifications
curl http://localhost:8000/api/notifications

# Priority notifications (top 10)
curl http://localhost:8000/api/notifications/priority?n=10
```

Take **screenshots** showing request body, response body, and status 200.

---

### STEP 7 — Set Up Frontend

```bash
cd notification_app_fe
npm install

# Create .env.local from example
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:
```
NEXT_PUBLIC_EMAIL=your_email@college.edu
NEXT_PUBLIC_NAME=Your Full Name
NEXT_PUBLIC_ROLL_NO=your_roll_number
NEXT_PUBLIC_ACCESS_CODE=your_access_code
NEXT_PUBLIC_CLIENT_ID=your_client_id
NEXT_PUBLIC_CLIENT_SECRET=your_client_secret
```

Run the frontend:
```bash
npm run dev
```

Open http://localhost:3000 in your browser.

Take **screenshots** of:
- All Notifications page (desktop view)
- All Notifications page (mobile view — use Chrome DevTools)
- Priority Inbox page
- Filter working (e.g. "Placement" only)
- New notification badge

---

### STEP 8 — Push to GitHub

```bash
# From the root of your repo
git add .
git commit -m "Complete full stack notification platform"
git push origin main
```

Make sure `.env` and `.env.local` files are NOT committed (they are in .gitignore).

---

### STEP 9 — Record a Video (Stage 7 requirement)

Record a short screen recording showing:
1. The All Notifications page loading
2. Switching filters (Placement / Result / Event)
3. Clicking a notification to mark it as read
4. Switching to Priority Inbox, changing N value
5. Mobile view

Upload the video to your GitHub repo or as a YouTube unlisted link, referenced in your README.

---

## 📸 Screenshot Checklist (for Postman)

For each API call, capture:
- ✅ Request URL + method
- ✅ Request body (JSON)
- ✅ Response body (JSON)
- ✅ Status code (200)
- ✅ Response time

APIs to screenshot:
1. `POST /register`
2. `POST /auth`
3. `POST /logs` (logging middleware call)
4. `GET /notifications`
5. `GET /notifications/priority`

---

## 🧠 Stage Answers Summary

| Stage | What you submit |
|-------|----------------|
| 1 | REST API design in `notification_system_design.md` |
| 2 | DB schema + SQL queries in same `.md` file |
| 3 | Query analysis + fix + index advice in same `.md` |
| 4 | Caching strategy in same `.md` |
| 5 | Redesigned bulk notify pseudocode in same `.md` |
| 6 | Priority algorithm code in `priorityService.ts` + explanation in `.md` |
| 7 | React/Next.js frontend in `notification_app_fe/` |

# 12303831
