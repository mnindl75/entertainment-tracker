import { Component, DestroyRef, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, filter, of, switchMap, tap } from 'rxjs';

import { MovieApiService, OmdbSearchItem } from '../../core/movie-api.service';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-search',
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
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss',
})
export class SearchComponent {
    titleCtrl = new FormControl<string>('', { nonNullable: true });

    loading = signal(false);
    error = signal<string | null>(null);
    results = signal<OmdbSearchItem[]>([]);
    private destroyRef = inject(DestroyRef);

    constructor(private api: MovieApiService) {
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
                    this.api
                        .search(v.trim())
                        .pipe(
                            catchError(() =>
                                of({ Response: 'False' as const, Error: 'Network/API error' }),
                            ),
                        ),
                ),
                tap(() => this.loading.set(false)),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((res) => {
                if (res.Response === 'True') {
                    this.results.set(res.Search);
                    this.error.set(null);
                } else {
                    this.results.set([]);
                    this.error.set(res.Error);
                }
            });
    }

    displayMovie = (m: OmdbSearchItem) => (m ? `${m.Title} (${m.Year})` : '');

    onSelected(item: OmdbSearchItem) {
        this.selected.set(item);

        // Input leeren + Vorschläge weg
        this.titleCtrl.setValue('');
        this.results.set([]);
    }
    selected = signal<OmdbSearchItem | null>(null);

    clearSearch() {
        this.titleCtrl.setValue('');
        this.results.set([]);
        this.error.set(null);
        this.loading.set(false);
    }
    addToLibrary(item: OmdbSearchItem) {
        console.log('Add to library:', item);
        // Phase 3: in Library-State speichern + localStorage
        this.selected.set(null);
    }
}
