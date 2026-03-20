import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { MoviesSeriesComponent } from './movies-series.component';
import { TmdbApiService } from '../../core/tmdb-api.service';

describe('MoviesSeriesComponent', () => {
    let component: MoviesSeriesComponent;
    let fixture: ComponentFixture<MoviesSeriesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [NoopAnimationsModule, MoviesSeriesComponent],
            providers: [
                {
                    provide: TmdbApiService,
                    useValue: {
                        searchMulti: () =>
                            of({ page: 1, results: [], total_pages: 1, total_results: 0 }),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(MoviesSeriesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render rating in selected card', () => {
        component.selected.set({
            id: 1,
            mediaType: 'movie',
            title: 'Test Movie',
            year: '2024',
            posterPath: null,
            ratingAverage: 7.3,
            ratingCount: 1234,
        });
        fixture.detectChanges();

        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('★ 7.3');
        expect(compiled.textContent).toContain('1,234');
    });
});

