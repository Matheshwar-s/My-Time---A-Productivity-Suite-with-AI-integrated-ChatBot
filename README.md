# My-Time---A-Productivity-Suite-with-AI-integrated-ChatBot

# 💻 Full-Stack Chat & Task Manager App

An all-in-one web application combining:

- 💬 AI Chatbot with session history
- 💡 Code Playground with multi-language execution
- 🎤 Communication practice with speech evaluation
- ✅ Task Manager with calendar & filters

---

## 🔥 Features

### 🤖 Chatbot
- Gemini-powered chat with markdown, code blocks & copy-to-clipboard
- Session saving, renaming & deletion
- Persistent message history

### 💻 Code Playground
- Languages supported: Python, Java, C++, JavaScript
- Monaco Editor integration
- Run & view output instantly

### 🗣️ Communication Tester
- Record audio, send to AssemblyAI for transcription
- Gemini evaluates your speaking performance
- Practice or test mode with detailed feedback

### 📋 Task Manager
- Add/edit/delete tasks with priority, category, and due date
- Filter by status, date, category
- Visual calendar view (month/week/day/agenda)
- Animations, status badges, and strikethrough for done tasks

---

## 🚀 Technologies Used

### Frontend
- React (with Tailwind CSS & React Router)
- Monaco Editor
- React Markdown + Prism
- React Big Calendar
- Axios

### Backend
- Spring Boot
- Gemini API (Google AI)
- AssemblyAI (speech-to-text)
- Java (REST APIs with Spring MVC)
- MongoDB / MySQL (choose based on your config)

---

## 📸 Screenshots

| Chatbot | Code Playground | Task Manager | Communication |
|--------|-----------------|--------------|---------------|
| ![Chatbot](./screenshots/chatbot.png) | ![Code](./screenshots/code.png) | ![Tasks](./screenshots/tasks.png) | ![Comm](./screenshots/comm.png) |

---

## 🛠️ Setup & Run Locally

```bash
# Backend
cd backend
./mvnw spring-boot:run

# Frontend
cd frontend
npm install
npm run dev
