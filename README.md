# Expense Manager API

A REST API for managing personal expenses with user authentication.

## Tech Stack

- Node.js / Express
- TypeScript
- MongoDB (Mongoose)
- JWT for authentication

## Setup

### Prerequisites

- Node.js (v18+)
- MongoDB

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/expense_manager
JWT_SECRET=your-secret-key
```

### Run

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

Server runs on `http://localhost:3000` by default.

---

## API Reference

### Base URL

```
http://localhost:3000
```

### Authentication

All `/expenses` endpoints require a JWT token. After login, include the token in the `Authorization` header:

```
Authorization: Bearer <token>
```

---

## API Endpoints

### 1. Root / Health Check

```bash
curl -X GET http://localhost:3000/
```

**Response:**
```json
{
  "message": "This is an expense-manager app"
}
```

---

### 2. Register User

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

### 3. Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

Use the `token` value for all expense API requests.

---

### 4. Get All Expenses

Results are paginated and sorted by date (latest first).

```bash
curl -X GET "http://localhost:3000/expenses?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Query Parameters:**
| Param | Type   | Default | Description              |
|-------|--------|---------|--------------------------|
| page  | number | 1       | Page number (1-based)     |
| limit | number | 20      | Items per page (max 100)  |

**Response (200):**
```json
{
  "msg": "This are all the expenses",
  "expenses": [
    {
      "id": "uuid",
      "userId": "user-uuid",
      "name": "Groceries",
      "amount": 50.25,
      "date": "2025-02-26T00:00:00.000Z",
      "category": "Food",
      "notes": "Weekly shopping",
      "createdAt": "2025-02-26T10:00:00.000Z",
      "updatedAt": "2025-02-26T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "totalPages": 3,
    "hasMore": true
  }
}
```

---

### 5. Get Single Expense

```bash
curl -X GET http://localhost:3000/expenses/EXPENSE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200):**
```json
{
  "msg": "Expense fetched successfully",
  "expense": {
    "id": "uuid",
    "userId": "user-uuid",
    "name": "Groceries",
    "amount": 50.25,
    "date": "2025-02-26T00:00:00.000Z",
    "notes": "Weekly shopping",
    "createdAt": "2025-02-26T10:00:00.000Z",
    "updatedAt": "2025-02-26T10:00:00.000Z"
  }
}
```

---

### 6. Get User Categories

Returns all unique categories the user has used in their expenses. Use these to populate a category dropdown when creating/editing expenses.

```bash
curl -X GET http://localhost:3000/expenses/categories \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200):**
```json
{
  "msg": "User categories",
  "categories": ["Food", "Groceries", "Transport"]
}
```

---

### 7. Create Expense

```bash
curl -X POST http://localhost:3000/expenses \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Coffee",
    "amount": 5.99,
    "date": "2025-02-26",
    "category": "Food",
    "notes": "Morning coffee"
  }'
```

**Request Body:**
| Field    | Type   | Required |
|----------|--------|----------|
| name     | string | Yes      |
| amount   | number | Yes      |
| date     | string | Yes (ISO date) |
| category | string | No       |
| notes    | string | No       |

**Response (201):**
```json
{
  "msg": "Expense created successfully",
  "expense": {
    "id": "uuid",
    "userId": "user-uuid",
    "name": "Coffee",
    "amount": 5.99,
    "date": "2025-02-26T00:00:00.000Z",
    "notes": "Morning coffee",
    "createdAt": "2025-02-26T10:00:00.000Z",
    "updatedAt": "2025-02-26T10:00:00.000Z"
  }
}
```

---

### 8. Update Expense

```bash
curl -X PUT http://localhost:3000/expenses/EXPENSE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Coffee & Pastry",
    "amount": 8.50
  }'
```

**Request Body (all fields optional):**
| Field  | Type   | Description                 |
|--------|--------|-----------------------------|
| name   | string | Expense name                |
| amount | number | Amount                      |
| date   | string | Date (ISO format)          |
| notes  | string | Optional notes              |

**Response (200):**
```json
{
  "msg": "Expense updated successfully",
  "expense": {
    "id": "uuid",
    "userId": "user-uuid",
    "name": "Coffee & Pastry",
    "amount": 8.5,
    "date": "2025-02-26T00:00:00.000Z",
    "notes": "Morning coffee",
    "createdAt": "2025-02-26T10:00:00.000Z",
    "updatedAt": "2025-02-26T11:00:00.000Z"
  }
}
```

---

### 9. Delete Expense

```bash
curl -X DELETE http://localhost:3000/expenses/EXPENSE_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response (200):**
```json
{
  "msg": "Expense deleted successfully",
  "expense": {
    "id": "uuid",
    "userId": "user-uuid",
    "name": "Coffee",
    "amount": 5.99,
    "date": "2025-02-26T00:00:00.000Z",
    "notes": "Morning coffee",
    "createdAt": "2025-02-26T10:00:00.000Z",
    "updatedAt": "2025-02-26T10:00:00.000Z"
  }
}
```

---

## Error Responses

| Status | Description                    |
|--------|--------------------------------|
| 400    | Bad request (missing/invalid data) |
| 401    | Unauthorized (no/invalid token)   |
| 404    | Resource not found                |
| 409    | Conflict (e.g., email already exists) |
| 500    | Server error                      |
