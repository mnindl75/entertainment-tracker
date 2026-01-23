import { Injectable, computed, effect, signal } from '@angular/core';
import { LibraryItem } from './library.types';

const STORAGE_KEY = 'movie-tracker.library.v1';

function loadFromStorage(): LibraryItem[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as LibraryItem[]) : [];
    } catch {
        return [];
    }
}

@Injectable({ providedIn: 'root' })
export class LibraryStore {
    private readonly _items = signal<LibraryItem[]>(loadFromStorage());

    // read-only “public” view
    readonly items = computed(() => this._items());

    readonly count = computed(() => this._items().length);

    constructor() {
        // Persist automatically when items change
        effect(() => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this._items()));
        });
    }

    add(item: LibraryItem) {
        const items = this._items();
        const exists = items.some((x) => x.imdbID === item.imdbID);
        if (exists) return;

        this._items.set([item, ...items]);
    }

    remove(imdbID: string) {
        this._items.set(this._items().filter((x) => x.imdbID !== imdbID));
    }

    toggleSeen(imdbID: string) {
        this._items.set(
            this._items().map((x) => (x.imdbID === imdbID ? { ...x, seen: !x.seen } : x)),
        );
    }

    clear() {
        this._items.set([]);
    }
}
