# Affordmed Campus Hiring Evaluation — Full Stack

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

curl http://localhost:8000/health


curl http://localhost:8000/api/notifications


curl http://localhost:8000/api/notifications/priority?n=10
```


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

