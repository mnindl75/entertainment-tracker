import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { BooksComponent } from './books.component';
import { GoogleBooksService } from '../../core/google-books.service';
import { BooksStore } from '../../core/books.store';

describe('BooksComponent', () => {
    let component: BooksComponent;
    let fixture: ComponentFixture<BooksComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NoopAnimationsModule, BooksComponent],
            providers: [
                {
                    provide: GoogleBooksService,
                    useValue: {
                        searchBooks: () => of({ totalItems: 0, items: [] }),
                    },
                },
                {
                    provide: BooksStore,
                    useValue: {
                        add: () => undefined,
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(BooksComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
