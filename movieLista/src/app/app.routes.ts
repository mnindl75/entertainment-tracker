import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'library', pathMatch: 'full' },
    {
        path: 'search',
        loadComponent: () =>
            import('./pages/search/search.component').then((m) => m.SearchComponent),
    },
    {
        path: 'library',
        loadComponent: () =>
            import('./pages/library/library.component').then((m) => m.LibraryComponent),
    },
    {
        path: 'details/:mediaType/:id',
        loadComponent: () =>
            import('./pages/details/details.component').then((m) => m.DetailsComponent),
    },
    {
        path: 'books',
        loadComponent: () => import('./pages/books/books.component').then((m) => m.BooksComponent),
    },
];
