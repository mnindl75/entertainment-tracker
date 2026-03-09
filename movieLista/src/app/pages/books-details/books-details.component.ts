import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { GoogleBooksService, GoogleBookVolume } from '../../core/google-books.service';
import { BooksStore } from '../../core/books.store';
import { toBookItem } from '../../core/books.types';

@Component({
    selector: 'app-books-details',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
    templateUrl: './books-details.component.html',
    styleUrl: './books-details.component.scss',
})
export class BooksDetailsComponent {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private booksApi = inject(GoogleBooksService);
    private booksStore = inject(BooksStore);

    loading = signal(false);
    error = signal<string | null>(null);

    params = toSignal(
        this.route.paramMap.pipe(map((pm) => ({ id: pm.get('id') ?? '' }))),
        { initialValue: { id: '' } },
    );

    storeItem = computed(() => {
        const id = this.params().id;
        if (!id) return null;
        return this.booksStore.itemById().get(id) ?? null;
    });

    details = toSignal(
        toObservable(this.params).pipe(
            tap(() => {
                this.loading.set(true);
                this.error.set(null);
            }),
            switchMap(({ id }) => {
                if (!id) return of(null);
                return this.booksApi.getVolume(id).pipe(catchError(() => of(null)));
            }),
            tap(() => this.loading.set(false)),
        ),
        { initialValue: null as GoogleBookVolume | null },
    );

    titleText = computed(() => {
        const d = this.details();
        const s = this.storeItem();
        return d?.volumeInfo?.title || s?.title || 'Book';
    });

    addToLibrary() {
        const d = this.details();
        if (!d) return;
        this.booksStore.add(toBookItem(d));
    }

    removeFromLibrary() {
        const s = this.storeItem();
        if (!s) return;
        this.booksStore.remove(s.id);
    }

    close() {
        this.router.navigateByUrl('/library');
    }

    coverUrl(item?: GoogleBookVolume | null) {
        return item?.volumeInfo?.imageLinks?.thumbnail ?? null;
    }

    authorsText(item?: GoogleBookVolume | null) {
        return item?.volumeInfo?.authors?.join(', ') ?? '-';
    }

    yearText(item?: GoogleBookVolume | null) {
        const date = item?.volumeInfo?.publishedDate ?? '';
        return date ? date.slice(0, 4) : '-';
    }

    categoriesText(item?: GoogleBookVolume | null) {
        return item?.volumeInfo?.categories?.join(', ') ?? '-';
    }

    ratingText(item?: GoogleBookVolume | null) {
        const avg = item?.volumeInfo?.averageRating;
        if (avg == null) return '-';
        const count = item?.volumeInfo?.ratingsCount;
        return count ? `${avg} (${count})` : String(avg);
    }

    identifiersText(item?: GoogleBookVolume | null) {
        const ids = item?.volumeInfo?.industryIdentifiers;
        if (!ids?.length) return '-';
        return ids.map((x) => `${x.type}: ${x.identifier}`).join(', ');
    }

    linksText(item?: GoogleBookVolume | null) {
        return (
            item?.volumeInfo?.canonicalVolumeLink ||
            item?.volumeInfo?.infoLink ||
            item?.volumeInfo?.previewLink ||
            ''
        );
    }
}
