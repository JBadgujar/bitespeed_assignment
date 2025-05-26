# 📞 Contact Identifier API

A backend API built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**, designed to **identify and consolidate user contact records** (based on email or phone number) and maintain **primary-secondary relationships** between them.

---

## 🚀 Features

- Identifies contacts based on provided email or phone number.
- Consolidates duplicate user records under a single **primary** contact.
- Automatically reassigns any conflicting primary contacts as **secondary**.
- Maintains a clean and query-efficient contact linkage.

---

## 🛠️ Tech Stack

- **Node.js** + **Express.js** – Server Framework
- **TypeScript** – Type Safety
- **MongoDB** with **Mongoose** – Database + ORM
- **dotenv** – Environment Configurations
- **Postman/cURL** – API Testing

---

## 📦 Installation

### 1. Clone the Repository
- git clone https://github.com/JBadgujar/bitespeed_assignment.git
- cd bitespeed_assignement/backend

### 2. Install Dependencies
npm install

### 3. Configure Environment Variables
- PORT=3000
- MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/contactdb

### 4. Development Mode
npm run dev

### 5. API Endpoint
**POST /identify**
- Request Headers:
Content-Type: application/json

- Request Body:
{
  "email": "john@example.com",
  "phoneNumber": "1234567890"
}
