import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { convertToParamMap } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { BooksDetailsComponent } from './books-details.component';
import { GoogleBooksService } from '../../core/google-books.service';
import { BooksStore } from '../../core/books.store';
import { Router, ActivatedRoute } from '@angular/router';

describe('BooksDetailsComponent', () => {
    let component: BooksDetailsComponent;
    let fixture: ComponentFixture<BooksDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NoopAnimationsModule, BooksDetailsComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        paramMap: of(convertToParamMap({ id: 'book-1' })),
                    },
                },
                {
                    provide: Router,
                    useValue: { navigateByUrl: jasmine.createSpy('navigateByUrl') },
                },
                {
                    provide: GoogleBooksService,
                    useValue: {
                        getVolume: () =>
                            of({
                                id: 'book-1',
                                volumeInfo: {
                                    title: 'Test Book',
                                    authors: ['Author'],
                                    publishedDate: '2020-01-01',
                                },
                            }),
                    },
                },
                {
                    provide: BooksStore,
                    useValue: {
                        itemById: () =>
                            new Map([
                                [
                                    'book-1',
                                    {
                                        id: 'book-1',
                                        title: 'Test Book',
                                        authors: ['Author'],
                                        year: '2020',
                                        language: 'de',
                                        addedAt: '2020-01-01T00:00:00.000Z',
                                        read: false,
                                    },
                                ],
                            ]),
                        add: () => undefined,
                        remove: () => undefined,
                        toggleRead: () => undefined,
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(BooksDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
