# Virudhunagar AI Innovation Platform

A full-stack platform for student projects, regional datasets, events, and industry collaboration in Virudhunagar district.

## Structure

```text
virudhunagar-platform/
|-- client/   React + Vite + Tailwind CSS
`-- server/   Node.js + Express + MongoDB
```

## Local Run

### Backend

```powershell
cd server
copy .env.example .env
npm install
npm run dev
```

Required backend environment variables:

- `MONGO_URI`
- `JWT_SECRET`
- `CLIENT_URLS`

### Frontend

```powershell
cd client
npm install
npm run dev
```

Optional frontend environment variable:

- `VITE_API_URL`

For local development, you can leave `VITE_API_URL` unset and use the Vite proxy.

## Deployment

### Frontend on Vercel

1. Push this repository to GitHub.
2. In Vercel, create a new project and set the root directory to `client`.
3. Add the environment variable:

```text
VITE_API_URL=https://your-backend-url.onrender.com
```

4. Deploy.

If you want a custom domain, add it in the Vercel project settings after the first deployment.

### Backend on Render

1. Create a new Web Service in Render.
2. Point it to this repository and set the root directory to `server`.
3. Use:

```text
Build Command: npm install
Start Command: npm start
```

4. Add these environment variables:

```text
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret
CLIENT_URLS=https://your-frontend-url.vercel.app
PORT=10000
```

You can also use the included `render.yaml` blueprint.

### Suggested public URLs

- Frontend: `https://virudhunagar-ai.vercel.app`
- Backend: `https://virudhunagar-api.onrender.com`
- Custom domain example: `https://virudhunagar-ai.in`

## API Modules

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects/:id/rate`
- `POST /api/projects/:id/comment`
- `POST /api/projects/:id/bookmark`
- `GET /api/datasets`
- `POST /api/datasets`
- `GET /api/datasets/:id/download`
- `GET /api/events`
- `POST /api/events`
- `GET /api/leaderboard`

## Roles

- `student` - upload projects, receive ratings and comments
- `faculty` - upload projects and post events
- `institution` - post events
- `company` - browse, comment, and bookmark

## Score Formula

```text
Score = (Projects uploaded x 5) + (Ratings received x 2) + (Comments received x 1)
```
