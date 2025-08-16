# 🥭 Mango Desk – AI Summariser Assignment

This project was built as part of the **Mango Desk Assignment**.  
It is a full-stack web application that allows users to **summarise text using AI models**.  

The backend integrates with **Groq AI API** for text summarisation, while the frontend is built using **Vite + React** for a fast and modern user experience.

---

## 🚀 Deployment

🔗 Live Link: [Mango Desk AI Summariser](https://mango-desk-assignment.vercel.app/)

---

## ✨ Features

- 📝 Input any text and get a **concise AI-generated summary**.  
- ⚡ Fast API calls powered by **Groq models**.  
- 🔄 Real-time updates (thanks to `nodemon` during dev).  
- 🔐 API keys managed via `.env` for security.  
- 🌐 Deployed & production-ready.  

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- TailwindCSS (if you used it, otherwise remove)
- Fetch API / Axios

### Backend
- Node.js
- Express.js
- Groq API (AI models)
- dotenv (for environment variables)

---

## ⚙️ Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Vaibhaviitian/mango_desk_assignment.git
cd mango_desk_assignment
```
### 2. Install Dependencies

# For backend:
cd Backend
npm install

# For frontend:
cd ../ai summariser
npm install
```

3. Setup Environment Variables

Create a `.env` file inside your `Backend/` folder:
```env
PORT=3000
GROQ_API_KEY=your_api_key_here
```

4. Run the Project

Start backend (with nodemon):
```bash
npm run dev
```

Start frontend:
```bash
npm run dev
```

---

## 📌 API Endpoint

**POST** `/api/response`
**POST** `/api/sendemail`

Request:
```json
{
  "text": "Your text to summarise here"
}
```

Response:
```json
{
  "success": true,
  "summary": "AI generated summary here"
}
```