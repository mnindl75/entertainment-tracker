import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { GamesApiService } from '../../core/games-api.service';
import { GamesStore } from '../../core/games.store';
import { RawgGame, toGameItem } from '../../core/games.types';

@Component({
    selector: 'app-games-details',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
    ],
    templateUrl: './games-details.component.html',
    styleUrl: './games-details.component.scss',
})
export class GamesDetailsComponent {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private gamesApi = inject(GamesApiService);
    private gamesStore = inject(GamesStore);

    loading = signal(false);
    error = signal<string | null>(null);

    params = toSignal(this.route.paramMap.pipe(map((pm) => ({ id: pm.get('id') ?? '' }))), {
        initialValue: { id: '' },
    });

    storeItem = computed(() => {
        const id = this.params().id;
        if (!id) return null;
        return this.gamesStore.itemById().get(id) ?? null;
    });

    details = toSignal(
        toObservable(this.params).pipe(
            tap(() => {
                this.loading.set(true);
                this.error.set(null);
            }),
            switchMap(({ id }) => {
                if (!id) return of(null);
                return this.gamesApi.getGameDetails(id).pipe(catchError(() => of(null)));
            }),
            tap(() => this.loading.set(false)),
        ),
        { initialValue: null as RawgGame | null },
    );

    titleText = computed(() => {
        const d = this.details();
        const s = this.storeItem();
        return d?.name || s?.title || 'Game';
    });

    addToLibrary() {
        const d = this.details();
        if (!d) return;
        this.gamesStore.add(toGameItem(d));
    }

    removeFromLibrary() {
        const s = this.storeItem();
        if (!s) return;
        this.gamesStore.remove(s.id);
    }

    togglePlayed() {
        const s = this.storeItem();
        if (!s) return;
        this.gamesStore.togglePlayed(s.id);
    }

    setRating(stars: number) {
        const s = this.storeItem();
        if (!s || !s.played) return;
        if (s.userRating === stars) {
            this.gamesStore.setRating(s.id, null);
            return;
        }
        this.gamesStore.setRating(s.id, stars);
    }

    close() {
        void this.router.navigateByUrl('/library');
    }

    releaseYear(item?: RawgGame | null) {
        return item?.released ? item.released.slice(0, 4) : '-';
    }

    genresText(item?: RawgGame | null) {
        return (item?.genres ?? []).map((x) => x.name).filter(Boolean).join(', ') || '-';
    }

    platformsText(item?: RawgGame | null) {
        return (
            (item?.platforms ?? []).map((x) => x.platform?.name ?? '').filter(Boolean).join(', ') ||
            '-'
        );
    }

    starText(rating: number | null | undefined, max = 5) {
        if (!rating || rating < 1) return '';
        const full = Math.min(max, Math.max(1, Math.round(rating)));
        return '★'.repeat(full) + '☆'.repeat(Math.max(0, max - full));
    }
}
