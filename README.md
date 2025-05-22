# GitHub Trending Repos

## Features

- **Trending Repos:** Fetches and displays the most popular repositories on GitHub.
- **Best Practices:** Follows SOLID and DRY principles.
- **Modular Structure:** Uses `core`, `features`, and `shared` modules for clean architecture.
- **Unit Testing:** Uses Jasmine/Karma for unit tests.
- **End-to-End Testing:** Uses Cypress for E2E tests.

## Project Structure

- `core/` – Core services, models, and utilities.
- `features/` – Feature modules (e.g., repo list).
- `shared/` – Shared components.

## Testing

- **Unit Tests:** Run with Jasmine.
- **E2E Tests:** Run with Cypress.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.12.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
npm run test:e2e
```
