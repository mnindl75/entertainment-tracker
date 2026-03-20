import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, filter, of, switchMap, tap } from 'rxjs';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

import { TmdbApiService } from '../../core/tmdb-api.service';
import { SearchItem } from '../../core/search.types';
import { LibraryStore } from '../../core/library.store';
import { toLibraryItem } from '../../core/library.types';

@Component({
    selector: 'app-movies-series',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        MatProgressSpinnerModule,
        MatButtonModule,
    ],
    templateUrl: './movies-series.component.html',
    styleUrl: './movies-series.component.scss',
})
export class MoviesSeriesComponent {
    titleCtrl = new FormControl<string>('', { nonNullable: true });

    loading = signal(false);
    error = signal<string | null>(null);
    results = signal<SearchItem[]>([]);
    selected = signal<SearchItem | null>(null);

    constructor(
        private tmdb: TmdbApiService,
        private library: LibraryStore,
    ) {
        this.titleCtrl.valueChanges
            .pipe(
                debounceTime(250),
                distinctUntilChanged(),
                tap(() => this.error.set(null)),
                tap((v) => {
                    if (v.trim().length < 3) this.results.set([]);
                }),
                filter((v) => v.trim().length >= 3),
                tap(() => this.loading.set(true)),
                switchMap((v) =>
                    this.tmdb.searchMulti(v.trim(), 'de-DE', 'DE').pipe(
                        catchError(() =>
                            of({
                                page: 1,
                                results: [],
                                total_pages: 1,
                                total_results: 0,
                            }),
                        ),
                    ),
                ),
                tap(() => this.loading.set(false)),
            )
            .subscribe((res) => {
                const items = res.results
                    .map((r: any) => {
                        if (r.media_type !== 'movie' && r.media_type !== 'tv') return null;

                        const isMovie = r.media_type === 'movie';
                        const title = isMovie ? (r.title ?? '') : (r.name ?? '');
                        if (!title) return null;

                        const originalTitle = isMovie ? r.original_title : r.original_name;
                        const date = isMovie ? r.release_date : r.first_air_date;
                        const year = date ? String(date).slice(0, 4) : undefined;
                        const ratingAverage =
                            typeof r.vote_average === 'number' ? r.vote_average : null;
                        const ratingCount = typeof r.vote_count === 'number' ? r.vote_count : null;

                        return {
                            id: r.id,
                            mediaType: r.media_type,
                            title,
                            originalTitle: originalTitle || undefined,
                            year,
                            posterPath: r.poster_path ?? null,
                            ratingAverage,
                            ratingCount,
                        } satisfies SearchItem;
                    })
                    .filter((x: SearchItem | null) => x !== null) as SearchItem[];
                this.results.set(items);

                this.error.set(items.length ? null : 'No results found');
            });
    }

    displayItem = (m: SearchItem) => (m ? `${m.title}${m.year ? ` (${m.year})` : ''}` : '');

    onSelected(item: SearchItem) {
        this.selected.set(item);
        this.titleCtrl.setValue('');
        this.results.set([]);
    }

    addToLibrary(item: SearchItem) {
        this.library.add(toLibraryItem(item));
        this.selected.set(null);
    }

    clearSearch() {
        this.titleCtrl.setValue('');
        this.results.set([]);
        this.error.set(null);
        this.loading.set(false);
        this.selected.set(null);
    }

    posterUrl(path?: string | null) {
        return path ? `https://image.tmdb.org/t/p/w185${path}` : null;
    }
}

