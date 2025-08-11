# Project Flow Explanation with JWT Authentication (Access & Refresh Tokens)

## 1. Overview
Our backend uses **service-based architecture** with modules.  
Currently, we have:
- **User Module** → Manages user registration, login, profile, etc.
- **Auth Module** → Handles authentication logic (JWT, refresh tokens).

We also use **Prisma** for database ORM and **Supabase PostgreSQL** as the DB.

---

## 2. Flow Summary
### **Step 1: User Registers**
- User sends **POST /auth/register** with:
  ```json
  {
    "email": "test@example.com",
    "password": "mypassword",
    "name":"Jane Doe"
  }
  ```
- The password is **hashed** (using bcrypt) before saving in DB.
- User gets stored in the `User` table.

### **Step 2: User Logs In**
- User sends **POST /auth/login** with email & password.
- Server verifies credentials.
- If valid, **two tokens are created**:
  1. **Access Token** → Short-lived (~15 min).  
     - Contains basic user info (id, email).
     - Used for accessing protected routes.
  2. **Refresh Token** → Long-lived (~7 days).  
     - Stored in the DB for that user.
     - Used to get a **new Access Token** without logging in again.

Example login response:
```json
{
  "accessToken": "eyJhbGciOi...",
  "refreshToken": "eyJhbGciOi..."
}
```

---

## 3. Access Token vs Refresh Token

| Token Type    | Lifetime | Stored in     | Purpose |
|--------------|----------|--------------|---------|
| Access Token | ~15 min  | Client memory (React state) | Access APIs |
| Refresh Token| ~7 days  | HttpOnly Cookie / DB | Get new Access Token |

---

## 4. Token Refresh Flow

1. When **Access Token expires**, client calls:
   **POST /auth/refresh** with refresh token.
2. Server checks if refresh token is valid & not expired.
3. If valid → creates a **new Access Token** and sends back.
4. If invalid → user must log in again.

---

## 5. Logout Flow

1. Client sends **POST /auth/logout** with refresh token.
2. Server deletes refresh token from DB.
3. Both tokens become invalid.

---

## 6. Folder Structure (Auth Example)
```
src/
  modules/
    auth/
      auth.controller.ts   # Receives HTTP requests
      auth.service.ts      # Handles token creation/validation
      auth.routes.ts       # API routes for auth
    user/
      user.controller.ts
      user.service.ts
      user.routes.ts
  prisma/
    schema.prisma          # DB schema
```

---

## 7. Advantages of Access + Refresh Tokens
✅ Better security (access tokens expire quickly).  
✅ Smooth user experience (no need to log in often).  
✅ Can revoke sessions instantly by deleting refresh tokens in DB.

