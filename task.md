# HMS Development Phases

## Phase 1: Foundation (Completed)
✔️ Project Setup & Dependencies
✔️ Database Layer & Mongoose Models
✔️ Zod Validation & Server Actions
✔️ Auth.js v5 Configuration
✔️ UI Shell (Sidebar)
✔️ Protected Routes Scaffold

## Phase 2: Authentication & UI Implementation (Completed)
✔️ Step 1: Install Core Shadcn Components
✔️ Step 2: Patient Registration UI
✔️ Step 3: Login Portal UI
✔️ Step 4: Admin Dashboard UI
✔️ Step 5: Patient Dashboard UI

## Phase 3: Backend Database Integration

- [ ] **Step 1: MongoDB Patient Registration**
  - Update `registerPatientAction` in `src/actions/User/index.ts`.
  - Apply `bcryptjs` hashing for user passwords.
  - Form an atomic dual-insert on both the `Users` and `Patients` Mongoose models.
  - Run `npx tsc --noEmit`.

- [ ] **Step 2: MongoDB Authentication Query**
  - Update `src/auth.ts` `authorize` callback.
  - Implement secure Mongoose matching check against the newly populated `Users` collection.
  - Run `npx tsc --noEmit`.

- [ ] **Step 3: Appointment Booking Server Actions**
  - Create the Patient appointment creation backend handlers.
  - Verify strict types and Zod payloads.
  - Run `npx tsc --noEmit`.

- [ ] **Step 4: Admin Dashboard Metrics Realtime DB Connection**
  - Update the `/dashboard/admin` server component to await native MongoDB Aggregate stats.
  - Run `npx tsc --noEmit`.

- [ ] **Step 5: Patient Dashboard Dynamic DB Connection**
  - Update the `/dashboard/patient` mock values with DB lookups matching `session.user.id`.
  - Run `npx tsc --noEmit`.
