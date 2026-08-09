# Deployment Specification

## Purpose

The site ships as a clean production build deployed to a free Vercel subdomain. Server credentials come from the `FIREBASE_SERVICE_ACCOUNT` environment variable and never reach the client; committed Firestore rules deny all direct client access. A Spanish step-by-step guide covers Firebase and Vercel setup.

## Requirements

### Requirement: Clean production build

The project MUST build successfully in production mode with type checking and linting passing without errors.

#### Scenario: Build passes

- GIVEN the project sources are complete
- WHEN a production build is run
- THEN the build completes successfully with no type errors and no lint errors

### Requirement: Server-side credential handling

Server credentials MUST be supplied through the `FIREBASE_SERVICE_ACCOUNT` environment variable, MUST NOT be exposed to the client bundle, MUST NOT use a `NEXT_PUBLIC_` prefix, and MUST NOT be hard-coded.

#### Scenario: Credential not exposed to the client

- GIVEN the build runs with `FIREBASE_SERVICE_ACCOUNT` configured
- WHEN the client bundle is inspected
- THEN it contains no service-account credentials

### Requirement: Vercel deployment

The site MUST be deployed to a free Vercel subdomain, reachable over HTTPS, with the required environment variables configured on Vercel.

#### Scenario: Site live on Vercel

- GIVEN the deployment succeeded with environment variables configured
- WHEN a browser opens the Vercel subdomain URL
- THEN the site loads over HTTPS

### Requirement: Deny-all Firestore rules

A `firestore.rules` file MUST be committed to the repository that denies all direct client access to Firestore.

#### Scenario: Client access denied

- GIVEN the rules are committed and active
- WHEN a client attempts to read or write Firestore directly
- THEN the attempt is denied by the rules

### Requirement: Spanish setup guide

The repository MUST include in `docs/` a Spanish step-by-step guide covering Firebase project and Firestore enablement, service-account key creation, `FIREBASE_SERVICE_ACCOUNT` configuration, and Vercel deployment, sufficient for the owner to complete setup unassisted.

#### Scenario: Guide completes setup end to end

- GIVEN the owner follows the guide from fresh Firebase and Vercel accounts
- WHEN every documented step is completed
- THEN the site is deployed and serving Firestore-backed content