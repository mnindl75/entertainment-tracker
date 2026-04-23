# MovieLista

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.21.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Local API keys (safe setup)

The tracked file `environments/environments.ts` contains only placeholders and must stay secret-free.

1. Copy `environments/environments.local.example.ts` to `environments/environments.local.ts`
2. Add your local API keys to `environments/environments.local.ts`
3. Start local development with `npm run dev` (or `npm run start:local`)

`environments/environments.local.ts` is gitignored and must never be committed.
`npm start` uses placeholder values from `environments/environments.ts`.

## Security baseline (CI)

A dedicated workflow scans every push/PR for leaked secrets:
- Workflow: `.github/workflows/secret-scan.yml`
- Scanner: Gitleaks

If the workflow fails:
1. Remove the secret from tracked files.
2. Rotate/revoke the affected key/token.
3. Push a fix commit and rerun the workflow.

## CI/CD baseline (GitHub)

Workflows:
- `.github/workflows/ci.yml` -> separate `Test` and `Build` jobs (artifact: `dist`)
- `.github/workflows/deploy.yml` -> deploys to GitHub Pages from the CI artifact

Recommended branch protection for `main`:
- Require status checks: `Test`, `Build`, `Secret Scan`
- Restrict direct pushes (PR only)

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Books (Google Books)

This project includes a simple Google Books search page for German books.

- Route: `/books`
- Search uses `langRestrict=de` and `printType=books`.
