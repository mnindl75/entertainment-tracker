import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryStore } from '../../core/library.store';

import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

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
    ],
    templateUrl: './library.component.html',
    styleUrl: './library.component.scss',
})
export class LibraryComponent {
    constructor(public library: LibraryStore) {}

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
