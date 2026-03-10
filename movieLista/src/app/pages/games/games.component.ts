import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { catchError, of } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';

import { GamesApiService } from '../../core/games-api.service';
import { GamesStore } from '../../core/games.store';
import { RawgGame, toGameItem } from '../../core/games.types';

@Component({
    selector: 'app-games',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatListModule,
        RouterLink,
    ],
    templateUrl: './games.component.html',
    styleUrl: './games.component.scss',
})
export class GamesComponent {
    queryCtrl = new FormControl<string>('', { nonNullable: true });

    loading = signal(false);
    error = signal<string | null>(null);
    results = signal<RawgGame[]>([]);
    selected = signal<RawgGame | null>(null);

    constructor(
        private gamesApi: GamesApiService,
        private gamesStore: GamesStore,
    ) {}

    search() {
        const query = this.queryCtrl.value.trim();
        if (query.length < 2) {
            this.error.set('Please type at least 2 characters.');
            this.results.set([]);
            return;
        }

        this.loading.set(true);
        this.error.set(null);
        this.selected.set(null);

        this.gamesApi
            .searchGames(query)
            .pipe(
                catchError(() => {
                    this.error.set('Failed to load results.');
                    return of([] as RawgGame[]);
                }),
            )
            .subscribe((res) => {
                this.results.set(res);
                if (!res.length) this.error.set('No results found.');
                this.loading.set(false);
            });
    }

    onSelected(item: RawgGame) {
        this.selected.set(item);
        this.queryCtrl.setValue('');
        this.results.set([]);
    }

    clearSelection() {
        this.selected.set(null);
    }

    addToLibrary(item: RawgGame) {
        this.gamesStore.add(toGameItem(item));
        this.selected.set(null);
    }

    releaseYear(item: RawgGame) {
        return item.released ? item.released.slice(0, 4) : '-';
    }

    genresText(item: RawgGame) {
        return (item.genres ?? []).map((g) => g.name).filter(Boolean).join(', ') || '-';
    }

    platformsText(item: RawgGame) {
        return (
            (item.platforms ?? []).map((p) => p.platform?.name ?? '').filter(Boolean).join(', ') || '-'
        );
    }
}
