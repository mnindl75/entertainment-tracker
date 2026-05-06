import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

import { BooksComponent } from './books.component';
import { GoogleBooksService } from '../../core/google-books.service';
import { BooksStore } from '../../core/books.store';

describe('BooksComponent', () => {
    let component: BooksComponent;
    let fixture: ComponentFixture<BooksComponent>;
    let booksServiceMock: { searchBooks: jasmine.Spy };

    beforeEach(async () => {
        booksServiceMock = {
            searchBooks: jasmine.createSpy('searchBooks').and.returnValue(
                of({ totalItems: 0, items: [] }),
            ),
        };

        await TestBed.configureTestingModule({
            imports: [NoopAnimationsModule, BooksComponent],
            providers: [
                provideRouter([]),
                {
                    provide: GoogleBooksService,
                    useValue: booksServiceMock,
                },
                {
                    provide: BooksStore,
                    useValue: {
                        add: () => undefined,
                        toggleRead: () => undefined,
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

    it('should validate short query and skip API search', () => {
        component.queryCtrl.setValue('ab');

        component.search();

        expect(component.error()).toBe('Please type at least 3 characters.');
        expect(component.results()).toEqual([]);
        expect(booksServiceMock.searchBooks).not.toHaveBeenCalled();
    });
});
