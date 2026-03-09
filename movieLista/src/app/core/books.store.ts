import { Injectable, computed, effect, signal } from '@angular/core';
import { BookItem } from './books.types';

const STORAGE_KEY = 'movie-tracker.books.v1';

function loadFromStorage(): BookItem[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as BookItem[]) : [];
    } catch {
        return [];
    }
}

@Injectable({ providedIn: 'root' })
export class BooksStore {
    private readonly _items = signal<BookItem[]>(loadFromStorage());

    readonly items = computed(() => this._items());
    readonly itemById = computed(() => new Map(this._items().map((item) => [item.id, item])));
    readonly count = computed(() => this._items().length);

    constructor() {
        effect(() => {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this._items()));
        });
    }

    add(item: BookItem) {
        const items = this._items();
        const exists = items.some((x) => x.id === item.id);
        if (exists) return;
        this._items.set([item, ...items]);
    }

    remove(id: string) {
        this._items.set(this._items().filter((x) => x.id !== id));
    }

    toggleRead(id: string) {
        this._items.set(this._items().map((x) => (x.id === id ? { ...x, read: !x.read } : x)));
    }

    clear() {
        this._items.set([]);
    }
}
