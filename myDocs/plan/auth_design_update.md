# Implementation Plan: Authentication Pages Design Update

This plan outlines the steps to align the Login and Register pages/forms with the "Clinical White" design system defined in `src/app/globals.css`.

## Objective
Update the visual styling of the authentication layout and forms to use CSS variables for colors, ensuring consistency with the overall brand identity.

## Proposed Changes

### 1. `src/components/auth/AuthLayout.tsx`
- **Backgrounds**: 
    - Main container: Change `bg-white` to `bg-background`.
    - Sidebar inner container: Change `bg-zinc-50` and `border-zinc-100` to `bg-secondary` and `border-border`.
- **Branding**:
    - HMS Logo box: Change `bg-zinc-900` to `bg-primary`.
- **Typography**:
    - Title (`title` prop): Change `text-zinc-900` to `text-foreground`.
    - Subtitle (`subtitle` prop): Change `text-zinc-600` to `text-muted-foreground`.
    - Quote text and author: Change `text-zinc-500` and `text-zinc-400` to `text-muted-foreground`.
    - Copyright text: Change `text-zinc-300` to `text-muted-foreground` (with reduced opacity if needed).

### 2. `src/components/forms/LoginForm.tsx`
- **Typography**:
    - Main heading: Change `text-zinc-900` to `text-foreground`.
    - Description text: Change `text-zinc-500` to `text-muted-foreground`.
    - Field labels: Change `text-zinc-800` to `text-foreground`.
- **Inputs**:
    - Background: Change `bg-zinc-50` to `bg-muted`.
    - Focus ring: Change `focus:ring-zinc-200` to `focus:ring-ring`.
- **Primary Actions**:
    - Submit Button: Change `bg-zinc-900` to `bg-primary` and add `hover:bg-primary/90`.
- **Navigation**:
    - Link text ("Sign Up"): Change `text-zinc-900` to `text-primary`.

### 3. `src/components/forms/PatientRegistrationForm.tsx`
- **Typography**:
    - Main heading: Change `text-zinc-900` to `text-foreground`.
    - Description text: Change `text-zinc-500` to `text-muted-foreground`.
    - Field labels: Change `text-zinc-800` to `text-foreground`.
- **Inputs & Selects**:
    - Background: Change `bg-zinc-50` to `bg-muted`.
    - Focus ring: Change `focus:ring-zinc-200` to `focus:ring-ring`.
    - Select Trigger: Same changes as Input.
- **Primary Actions**:
    - Submit Button: Change `bg-zinc-900` to `bg-primary` and add `hover:bg-primary/90`.
- **Navigation**:
    - Link text ("Sign In"): Change `text-zinc-900` to `text-primary`.

## Environment Variables
- **Assumed**: No new environment variables are required for these design changes. 
- **Context**: The existing `NEXTAUTH_URL` or other authentication-related variables are assumed to be correctly configured in the environment but will not be accessed during this task.

## Verification Cycle
1. **TypeScript**: Run `npx tsc --noEmit` to ensure no type regressions.
2. **Lint**: Run `npm run lint` to catch any styling or code quality issues.
3. **Build**: Run `npm run build` to verify the production bundle integrity.
