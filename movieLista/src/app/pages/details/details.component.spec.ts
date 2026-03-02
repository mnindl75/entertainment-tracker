import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { signal } from '@angular/core';
import { convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { DetailsComponent } from './details.component';
import { TmdbApiService } from '../../core/tmdb-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LibraryStore } from '../../core/library.store';

describe('DetailsComponent', () => {
    let component: DetailsComponent;
    let fixture: ComponentFixture<DetailsComponent>;
    let libraryStoreMock: {
        itemById: ReturnType<typeof signal<Map<string, any>>>;
        setRating: (imdbId: string, rating: number) => void;
        toggleSeen: (imdbId: string) => void;
    };

    beforeEach(async () => {
        libraryStoreMock = {
            itemById: signal(
                new Map([
                    [
                        '1',
                        {
                            imdbID: '1',
                            title: 'Rated Movie',
                            year: '2024',
                            type: 'movie',
                            poster: 'N/A',
                            addedAt: '2024-01-01T00:00:00.000Z',
                            seen: true,
                            userRating: 4,
                        },
                    ],
                ]),
            ),
            setRating: () => undefined,
            toggleSeen: () => undefined,
        };

        await TestBed.configureTestingModule({
            imports: [DetailsComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        paramMap: of(convertToParamMap({ mediaType: 'movie', id: '1' })),
                    },
                },
                {
                    provide: Router,
                    useValue: { navigateByUrl: jasmine.createSpy('navigateByUrl') },
                },
                {
                    provide: TmdbApiService,
                    useValue: {
                        getMovieDetails: () =>
                            of({
                                id: 1,
                                title: 'Rated Movie',
                                original_title: 'Rated Movie',
                                overview: 'Overview',
                                release_date: '2024-01-01',
                                runtime: 120,
                                genres: [],
                                poster_path: null,
                                backdrop_path: null,
                                vote_average: 7.9,
                                vote_count: 321,
                            }),
                        getTvDetails: () => of(null),
                        getTvSeasonDetails: () => of(null),
                    },
                },
                {
                    provide: LibraryStore,
                    useValue: libraryStoreMock,
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render rating for movie', fakeAsync(() => {
        tick();
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('Rating:');
        expect(compiled.textContent).toContain('7.9');
        expect(compiled.textContent).toContain('321');
        expect(compiled.textContent).toContain('Your rating:');
        expect(compiled.textContent).toContain('4 / 5');
        expect(compiled.textContent).toContain('Status:');
        expect(compiled.textContent).toContain('seen');
    }));

    it('should disable stars when not seen', fakeAsync(() => {
        libraryStoreMock.itemById.set(
            new Map([
                [
                    '1',
                    {
                        imdbID: '1',
                        title: 'Rated Movie',
                        year: '2024',
                        type: 'movie',
                        poster: 'N/A',
                        addedAt: '2024-01-01T00:00:00.000Z',
                        seen: false,
                        userRating: null,
                    },
                ],
            ]),
        );

        tick();
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        const firstStar = compiled.querySelector(
            'button[aria-label="Rate 1 star(s)"]',
        ) as HTMLButtonElement;
        expect(firstStar.disabled).toBeTrue();
    }));
});
