import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { DetailsComponent } from './details.component';
import { TmdbApiService } from '../../core/tmdb-api.service';
import { ActivatedRoute, Router } from '@angular/router';

describe('DetailsComponent', () => {
    let component: DetailsComponent;
    let fixture: ComponentFixture<DetailsComponent>;

    beforeEach(async () => {
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
    }));
});
