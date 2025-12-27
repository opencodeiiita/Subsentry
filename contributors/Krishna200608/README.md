## Issue #12 – Clerk Authentication Setup

Implemented a Next.js client application using the App Router with Clerk authentication.

### Features
- ClerkProvider integration
- Sign-in and Sign-up routes using catch-all routing
- Route protection implemented via Next.js proxy middleware
- Protected dashboard route

### Folder Structure
contributors/Krishna200608/
├── client/   # Next.js + Clerk authentication
├── server/   # Reserved for future backend tasks

### How to Run Locally
cd contributors/Krishna200608/client
npm install
npm run dev

### Notes
- Authentication is handled at the proxy level
- No auth logic is placed inside React components
