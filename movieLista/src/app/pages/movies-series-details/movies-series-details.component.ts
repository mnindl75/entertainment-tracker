import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import {
    TmdbApiService,
    TmdbMovieDetails,
    TmdbSeasonDetails,
    TmdbTvDetails,
} from '../../core/tmdb-api.service';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LibraryStore } from '../../core/library.store';

type MediaType = 'movie' | 'tv';
type Details =
    | { mediaType: 'movie'; data: TmdbMovieDetails }
    | { mediaType: 'tv'; data: TmdbTvDetails };

@Component({
    selector: 'app-movies-series-details',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatChipsModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        MatSelectModule,
        MatListModule,
        MatExpansionModule,
        MatIconModule,
        MatButtonModule,
    ],
    templateUrl: './movies-series-details.component.html',
    styleUrl: './movies-series-details.component.scss',
})
export class MoviesSeriesDetailsComponent {
    private route = inject(ActivatedRoute);
    private tmdb = inject(TmdbApiService);
    private library = inject(LibraryStore);

    loading = signal(false);
    error = signal<string | null>(null);
    private router = inject(Router);

    readonly stars = [1, 2, 3, 4, 5] as const;

    params = toSignal(
        this.route.paramMap.pipe(
            map((pm) => {
                const mediaType = (pm.get('mediaType') as MediaType) ?? 'movie';
                const id = Number(pm.get('id') ?? '0');
                return { mediaType, id };
            }),
        ),
        { initialValue: { mediaType: 'movie' as MediaType, id: 0 } },
    );

    details = toSignal(
        toObservable(this.params).pipe(
            tap(() => {
                this.loading.set(true);
                this.error.set(null);
            }),
            switchMap(({ mediaType, id }) => {
                if (!id) return of(null);

                if (mediaType === 'tv') {
                    return this.tmdb
                        .getTvDetails(id)
                        .pipe(map((data) => ({ mediaType: 'tv' as const, data })));
                }

                return this.tmdb
                    .getMovieDetails(id)
                    .pipe(map((data) => ({ mediaType: 'movie' as const, data })));
            }),
            catchError(() => {
                this.error.set('Failed to load details');
                return of(null);
            }),
            tap(() => this.loading.set(false)),
        ),
        { initialValue: null as Details | null },
    );

    selectedSeason = signal<number>(1);

    tvDetails = computed<TmdbTvDetails | null>(() => {
        const d = this.details();
        return d?.mediaType === 'tv' ? d.data : null;
    });

    seasons = computed(() => this.tvDetails()?.seasons ?? []);

    tvId = computed(() => this.tvDetails()?.id ?? 0);

    libraryItem = computed(() => {
        const id = this.params().id;
        if (!id) return null;
        return this.library.itemById().get(String(id)) ?? null;
    });

    canRate = computed(() => {
        const item = this.libraryItem();
        return !!item && item.seen;
    });

    private lastTvId = 0;

    constructor() {
        effect(() => {
            const currentTvId = this.tvId();
            if (currentTvId && currentTvId !== this.lastTvId) {
                this.lastTvId = currentTvId;
                this.selectedSeason.set(1);
            }
        });
    }

    seasonDetails = toSignal(
        toObservable(this.selectedSeason).pipe(
            switchMap((season) => {
                const tvId = this.tvId();
                if (!tvId) return of(null);
                return this.tmdb.getTvSeasonDetails(tvId, season).pipe(catchError(() => of(null)));
            }),
        ),
        { initialValue: null as TmdbSeasonDetails | null },
    );

    posterUrl(path?: string | null) {
        return path ? `https://image.tmdb.org/t/p/w342${path}` : null;
    }

    setUserRating(rating: number) {
        if (!this.canRate()) return;
        const id = this.params().id;
        if (!id) return;
        this.library.setRating(String(id), rating);
    }

    toggleSeen() {
        const item = this.libraryItem();
        if (!item) return;
        this.library.toggleSeen(item.imdbID);
    }

    titleText = computed(() => {
        const d = this.details();
        if (!d) return '';
        return d.mediaType === 'tv' ? d.data.name : d.data.title;
    });

    close() {
        void this.router.navigateByUrl('/library');
    }
}

