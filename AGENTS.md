# AGENTS.md – MovieLista

## Project Overview
Angular 18 standalone-component app for tracking **movies/TV** (TMDB), **books** (Google Books), and **games** (RAWG). No NgModules – everything uses the standalone component API.

## Developer Workflows
```bash
npm start          # dev server → http://localhost:4200
npm run build      # production build → dist/
npm test           # Jasmine/Karma in ChromeHeadlessNoSandbox (watch=false)
npm run watch      # build in watch mode (development)
```
Run all commands from `movieLista/` (the Angular CLI project root), not the repo root.

## Architecture
```
src/app/
  core/          # Services, stores, types (singleton, providedIn: 'root')
  pages/         # Lazy-loaded route components (one folder per route)
  shared/        # (currently empty – reusable UI components go here)
environments/
  environments.ts  # Single env file (no prod variant) – all API keys live here
```

### Routing (`app.routes.ts`)
Default redirect → `/library`. All routes use `loadComponent` (lazy).

| Path | Component |
|------|-----------|
| `/movies-series` | `MoviesSeriesComponent` – TMDB search (auto-search via `valueChanges`) |
| `/books` | `BooksComponent` – Google Books search (manual button trigger) |
| `/games` | `GamesComponent` – RAWG search (manual button trigger) |
| `/library` | `LibraryComponent` – combined watchlist/reading list/game list |
| `/movies-series-details/:mediaType/:id` | `MoviesSeriesDetailsComponent` – movie or TV details |
| `/books/:id` | `BooksDetailsComponent` – book details |
| `/games/:id` | `GamesDetailsComponent` – game details |

## State Management Pattern
Each media domain has a **Signal Store** in `core/`:
| File | Store class | localStorage key |
|------|------------|-----------------|
| `library.store.ts` | `LibraryStore` | `movie-tracker.library.v1` |
| `books.store.ts` | `BooksStore` | `movie-tracker.books.v1` |
| `games.store.ts` | `GamesStore` | `movie-tracker.games.v1` |

All stores follow the same shape:
- Private `_items = signal<T[]>(loadFromStorage())` – writable
- Public `items`, `itemById`, `count` as `computed()` – read-only
- `effect()` in constructor auto-persists to `localStorage`
- Mutation methods (`add`, `remove`, `toggleSeen`/`toggleRead`/`togglePlayed`, `setRating`, `clear`)

Components inject stores directly and read via `store.items()` / `store.count()`.

## External API Services (`core/`)
| Service              | API                                      | Auth                                   |
|----------------------|------------------------------------------|----------------------------------------|
| `TmdbApiService`     | TMDB v3 (`https://api.themoviedb.org/3`) | Bearer token via `tmdbAuthInterceptor` |
| `GoogleBooksService` | Google Books v1                          | API key as query param                 |
| `GamesApiService`    | RAWG (`https://api.rawg.io/api`)         | API key as query param                 |

**Important:** `tmdb-auth.interceptor.ts` only injects headers for requests whose URL starts with `environment.tmdbBaseUrl`. Non-TMDB requests pass through unchanged.

TMDB searches use `language=de-DE` and `region=DE`. Google Books searches default to `langRestrict=de`.

## Key Conventions
- **Standalone components everywhere** – always add `standalone: true` and list all imports explicitly.
- **Signals for local component state** – use `signal()` / `computed()`, not `BehaviorSubject`.
- **Dependency injection mixed style** – constructor injection in older components, `inject()` in newer ones (e.g. `GamesApiService`). Both are acceptable.
- **Type mapper functions** live in `*.types.ts` files (e.g. `toLibraryItem()` in `library.types.ts`, `toBookItem()` in `books.types.ts`, `toGameItem()` in `games.types.ts`). Use these when saving API results to a store.
- **`LibraryItem.imdbID`** stores TMDB numeric IDs cast to string (`String(m.id)`).
- **Angular Material** is the sole UI component library (cards, lists, buttons, icons, chips, bottom-sheet).
- **TMDB API types** (`TmdbMovieDetails`, `TmdbTvDetails`, `TmdbSeasonDetails`, etc.) are exported directly from `tmdb-api.service.ts`, not a separate types file. `GoogleBookVolume` / `GoogleBooksResponse` are likewise exported from `google-books.service.ts`.
- **TMDB image URLs**: construct poster/backdrop URLs as `https://image.tmdb.org/t/p/w185{path}` (search cards) or `https://image.tmdb.org/t/p/w342{path}` (detail pages).
- **Detail page pattern** – all `*-details` components use `inject()`, derive `params` with `toSignal(route.paramMap.pipe(...))`, and fetch via `toSignal(toObservable(params).pipe(switchMap(...)))` from `@angular/core/rxjs-interop`. A `storeItem = computed(() => store.itemById().get(id) ?? null)` tracks whether the item is already saved.
- **`LibrarySortSheetComponent`** lives in `pages/library/library-sort-sheet.component.ts` with an inline template (no separate HTML file). It is opened via `MatBottomSheet` and returns a `SortOption` on dismiss.
- When adding a new media domain, mirror the existing store pattern and add a `localStorage` key with a `v1` suffix.

## Adding a New Route / Domain
1. Create `core/<domain>.types.ts`, `core/<domain>.store.ts`, `core/<domain>-api.service.ts`
2. Add pages under `pages/<domain>/` and `pages/<domain>-details/`
3. Register lazy routes in `app.routes.ts`
4. Inject the new store in `library.component.ts` if it should appear on the Library page

