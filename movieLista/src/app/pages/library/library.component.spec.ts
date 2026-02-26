import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { LibraryComponent } from './library.component';
import { LibraryStore } from '../../core/library.store';

describe('LibraryComponent', () => {
    let component: LibraryComponent;
    let fixture: ComponentFixture<LibraryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes([]), LibraryComponent],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: { paramMap: of(convertToParamMap({})) },
                },
                {
                    provide: LibraryStore,
                    useValue: {
                        items: () => [
                            {
                                imdbID: '1',
                                title: 'Rated Movie',
                                year: '2020',
                                type: 'movie',
                                poster: 'N/A',
                                addedAt: '2020-01-01T00:00:00.000Z',
                                seen: true,
                                ratingAverage: 8.1,
                                ratingCount: 987,
                            },
                        ],
                        count: () => 1,
                        remove: () => undefined,
                        toggleSeen: () => undefined,
                        clear: () => undefined,
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LibraryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render rating chip', () => {
        const compiled = fixture.nativeElement as HTMLElement;
        expect(compiled.textContent).toContain('★ 8.1');
        expect(compiled.textContent).toContain('987');
    });
});
