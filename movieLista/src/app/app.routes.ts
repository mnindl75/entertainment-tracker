import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'library', pathMatch: 'full' },
    {
        path: 'movies-series',
        loadComponent: () =>
            import('./pages/movies-series/movies-series.component').then(
                (m) => m.MoviesSeriesComponent,
            ),
    },
    {
        path: 'library',
        loadComponent: () =>
            import('./pages/library/library.component').then((m) => m.LibraryComponent),
    },
    {
        path: 'movies-series-details/:mediaType/:id',
        loadComponent: () =>
            import('./pages/movies-series-details/movies-series-details.component').then(
                (m) => m.MoviesSeriesDetailsComponent,
            ),
    },
    {
        path: 'books/:id',
        loadComponent: () =>
            import('./pages/books-details/books-details.component').then(
                (m) => m.BooksDetailsComponent,
            ),
    },
    {
        path: 'books',
        loadComponent: () => import('./pages/books/books.component').then((m) => m.BooksComponent),
    },
    {
        path: 'games/:id',
        loadComponent: () =>
            import('./pages/games-details/games-details.component').then(
                (m) => m.GamesDetailsComponent,
            ),
    },
    {
        path: 'games',
        loadComponent: () => import('./pages/games/games.component').then((m) => m.GamesComponent),
    },
];
