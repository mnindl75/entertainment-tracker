import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryStore } from '../../core/library.store';
import { BooksStore } from '../../core/books.store';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { RouterLink } from '@angular/router';
import { LibrarySortSheetComponent, SortOption } from './library-sort-sheet.component';

@Component({
    selector: 'app-library',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatListModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatBottomSheetModule,
        RouterLink,
    ],
    templateUrl: './library.component.html',
    styleUrl: './library.component.scss',
})
export class LibraryComponent {
    sortOption = signal<SortOption>('added_desc');

    constructor(
        public library: LibraryStore,
        public books: BooksStore,
        private bottomSheet: MatBottomSheet,
    ) {}

    sortedItems = computed(() => {
        const items = [...this.library.items()];
        const option = this.sortOption();

        const byTitle = (a: string, b: string) => a.localeCompare(b, 'en');
        const byNumber = (a: number, b: number) => a - b;

        switch (option) {
            case 'title_asc':
                return items.sort((a, b) => byTitle(a.title, b.title));
            case 'title_desc':
                return items.sort((a, b) => byTitle(b.title, a.title));
            case 'year_desc':
                return items.sort((a, b) => byNumber(Number(b.year || 0), Number(a.year || 0)));
            case 'year_asc':
                return items.sort((a, b) => byNumber(Number(a.year || 0), Number(b.year || 0)));
            case 'rating_desc':
                return items.sort((a, b) => byNumber(b.ratingAverage ?? 0, a.ratingAverage ?? 0));
            case 'user_rating_desc':
                return items.sort((a, b) => byNumber(b.userRating ?? 0, a.userRating ?? 0));
            case 'added_desc':
            default:
                return items.sort((a, b) => byNumber(Date.parse(b.addedAt), Date.parse(a.addedAt)));
        }
    });

    openSortSheet() {
        const ref = this.bottomSheet.open(LibrarySortSheetComponent, {
            data: { current: this.sortOption() },
        });

        ref.afterDismissed().subscribe((result: SortOption | undefined) => {
            if (result) this.sortOption.set(result);
        });
    }

    starText(rating: number | null | undefined, max = 5) {
        if (!rating || rating < 1) return '';
        const full = Math.min(max, Math.max(1, Math.round(rating)));
        return '★'.repeat(full) + '☆'.repeat(Math.max(0, max - full));
    }

    remove(imdbID: string) {
        this.library.remove(imdbID);
    }

    toggleSeen(imdbID: string) {
        this.library.toggleSeen(imdbID);
    }

    clear() {
        this.library.clear();
    }

    removeBook(id: string) {
        this.books.remove(id);
    }

    clearBooks() {
        this.books.clear();
    }

    bookAuthorsText(authors: string[]) {
        return authors.length ? authors.join(', ') : '-';
    }

    bookYearText(year: string) {
        return year || '-';
    }

    bookRatingText(avg: number | null | undefined, count: number | null | undefined) {
        if (avg == null) return '-';
        return count ? `${avg} (${count})` : String(avg);
    }
}
