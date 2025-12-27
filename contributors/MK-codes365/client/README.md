# SubSentry Client Authentication Module 🛡️

![Next.js](https://img.shields.io/badge/Next.js_14-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk&logoColor=white)

## 📌 Overview

This project implements a robust, industry-standard authentication flow for **SubSentry** using **Next.js App Router** and **Clerk**. It ensures that sensitive routes are protected, users can securely sign up/in, and authentication state is managed efficiently across the application.

My contribution focuses on setting up the frontend foundation with secure route guards and a clean, responsive UI.

---

## 🚀 Key Features

### 🔒 Secure Authentication

- **Complete Auth Flow**: Sign In, Sign Up, and Sign Out functionality fully integrated.
- **Social Logins**: Supports Google, GitHub, and Email/Password authentication out of the box (via Clerk).
- **Session Management**: handled automatically with secure cookies.

### 🛡️ Middleware Protection

- **Route Guarding**: Implementation of `middleware.ts` to intercept requests.
- **Protected Routes**: The `/dashboard` route and its sub-routes are inaccessible to unauthenticated users.
- **Public Routes**: The Home page (`/`) and auth pages (`/sign-in`, `/sign-up`) remain publicly accessible.

### 🎨 Modern UI/UX

- **Responsive Design**: Built with Tailwind CSS for mobile-first responsiveness.
- **Dark Mode Support**: Application structure supports dark mode theming.
- **Custom 404 Page**: Added a custom `not-found.tsx` for better user experience.

---

## 🛠️ Project Structure

```bash
contributors/Your_Username/client/
├── src/
│   ├── app/
│   │   ├── dashboard/      # 🔒 Protected Route
│   │   │   └── page.tsx    # Dashboard UI
│   │   ├── sign-in/        # 🔓 Public Auth Route
│   │   ├── sign-up/        # 🔓 Public Auth Route
│   │   ├── layout.tsx      # Wrapped with <ClerkProvider>
│   │   ├── page.tsx        # Landing Page
│   │   └── not-found.tsx   # Custom 404 handler
│   ├── middleware.ts       # 🛡️ Auth Logic & Route Matching
│   └── globals.css         # Global Styles & Tailwind Directives
├── .env.local              # Enviroment Secrets (Not committed)
├── next.config.ts          # Next.js Configuration
└── package.json            # Dependencies
```

---

## ⚡ Getting Started

Follow these steps to set up the project locally.

### 1. Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### 2. Installation

Navigate to the client directory and install dependencies:

```bash
cd contributors/MK-codes365/client
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root of the `client` folder and add your Clerk keys:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🧠 Implementation Details

### Middleware Strategy

We utilize `clerkMiddleware` combined with `createRouteMatcher` to secure specific paths.

```typescript
// middleware.ts
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
});
```

This ensures that any attempt to access `/dashboard` without a valid session automatically redirects the user to the Sign-In page.

### Root Layout

The entire application is wrapped in `<ClerkProvider>` to provide authentication context to all child components.

```typescript
// app/layout.tsx
<ClerkProvider>
  <html lang="en">
    <body>{children}</body>
  </html>
</ClerkProvider>
```

---

## 🤝 Contribution

This module serves as the foundational auth layer for future SubSentry features. Future contributors can easily extend this by adding new protected routes to the `createRouteMatcher` array in `middleware.ts`.

---

_Built with ❤️ for SubSentry OpenCode'25_
