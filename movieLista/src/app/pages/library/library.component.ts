import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryStore } from '../../core/library.store';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';

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
        RouterLink,
    ],
    templateUrl: './library.component.html',
    styleUrl: './library.component.scss',
})
export class LibraryComponent {
    constructor(public library: LibraryStore) {}

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
}
