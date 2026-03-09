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

import { GoogleBooksService, GoogleBookVolume } from '../../core/google-books.service';

@Component({
    selector: 'app-books',
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
    ],
    templateUrl: './books.component.html',
    styleUrl: './books.component.scss',
})
export class BooksComponent {
    queryCtrl = new FormControl<string>('', { nonNullable: true });

    loading = signal(false);
    error = signal<string | null>(null);
    results = signal<GoogleBookVolume[]>([]);

    constructor(private books: GoogleBooksService) {}

    search() {
        const query = this.queryCtrl.value.trim();
        if (query.length < 3) {
            this.error.set('Please type at least 3 characters.');
            this.results.set([]);
            return;
        }

        this.loading.set(true);
        this.error.set(null);

        this.books
            .searchBooks(query)
            .pipe(
                catchError((err) => {
                    const isQuota = err?.status === 429;
                    this.error.set(
                        isQuota
                            ? 'Quota exceeded. Please try again later or add an API key.'
                            : 'Failed to load results.',
                    );
                    return of({ totalItems: 0, items: [] });
                }),
            )
            .subscribe((res) => {
                this.results.set(res.items ?? []);
                if (!res.items?.length) this.error.set('No results found.');
                this.loading.set(false);
            });
    }

    coverUrl(item: GoogleBookVolume) {
        return item.volumeInfo?.imageLinks?.thumbnail ?? null;
    }

    authorsText(item: GoogleBookVolume) {
        return item.volumeInfo?.authors?.join(', ') ?? '-';
    }

    yearText(item: GoogleBookVolume) {
        const date = item.volumeInfo?.publishedDate ?? '';
        return date ? date.slice(0, 4) : '-';
    }
}
