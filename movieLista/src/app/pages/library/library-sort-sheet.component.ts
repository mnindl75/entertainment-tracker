import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatListModule } from '@angular/material/list';

export type SortOption =
    | 'added_desc'
    | 'title_asc'
    | 'title_desc'
    | 'year_desc'
    | 'year_asc'
    | 'rating_desc'
    | 'user_rating_desc';

export const SORT_OPTIONS: { id: SortOption; label: string }[] = [
    { id: 'added_desc', label: 'Recently added' },
    { id: 'title_asc', label: 'Title (A-Z)' },
    { id: 'title_desc', label: 'Title (Z-A)' },
    { id: 'year_desc', label: 'Year (newest first)' },
    { id: 'year_asc', label: 'Year (oldest first)' },
    { id: 'rating_desc', label: 'TMDB rating (high to low)' },
    { id: 'user_rating_desc', label: 'My rating (high to low)' },
];

@Component({
    selector: 'app-library-sort-sheet',
    standalone: true,
    imports: [CommonModule, MatListModule],
    template: `
        <h3 style="margin: 0 16px 8px">Sort by</h3>
        <mat-nav-list>
            <a
                mat-list-item
                *ngFor="let opt of options"
                (click)="select(opt.id)"
                [attr.aria-current]="opt.id === data.current ? 'true' : null"
            >
                {{ opt.label }}
            </a>
        </mat-nav-list>
    `,
})
export class LibrarySortSheetComponent {
    options = SORT_OPTIONS;

    constructor(
        private sheetRef: MatBottomSheetRef<LibrarySortSheetComponent>,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: { current: SortOption },
    ) {}

    select(option: SortOption) {
        this.sheetRef.dismiss(option);
    }
}
