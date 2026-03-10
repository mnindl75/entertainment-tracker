import { Injectable, computed, effect, signal } from '@angular/core';
import { GameItem } from './games.types';

const STORAGE_KEY = 'movie-tracker.games.v1';

function loadFromStorage(): GameItem[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as GameItem[]) : [];
    } catch {
        return [];
    }
}

@Injectable({ providedIn: 'root' })
export class GamesStore {
    private readonly _items = signal<GameItem[]>(loadFromStorage());

    readonly items = computed(() => this._items());
    readonly itemById = computed(() => new Map(this._items().map((item) => [item.id, item])));
    readonly count = computed(() => this._items().length);

    constructor() {
        effect(() => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this._items()));
        });
    }

    add(item: GameItem) {
        const items = this._items();
        const exists = items.some((x) => x.id === item.id);
        if (exists) return;
        this._items.set([item, ...items]);
    }

    remove(id: string) {
        this._items.set(this._items().filter((x) => x.id !== id));
    }

    togglePlayed(id: string) {
        this._items.set(this._items().map((x) => (x.id === id ? { ...x, played: !x.played } : x)));
    }

    setRating(id: string, rating: number | null) {
        const normalized = rating == null ? null : Math.min(5, Math.max(1, Math.round(rating)));
        this._items.set(
            this._items().map((x) =>
                x.id === id ? { ...x, userRating: normalized, played: normalized ? true : x.played } : x,
            ),
        );
    }

    clear() {
        this._items.set([]);
    }
}
