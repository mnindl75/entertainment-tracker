import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GamesDetailsComponent } from './games-details.component';
import { GamesApiService } from '../../core/games-api.service';
import { GamesStore } from '../../core/games.store';

describe('GamesDetailsComponent', () => {
    let component: GamesDetailsComponent;
    let fixture: ComponentFixture<GamesDetailsComponent>;

    const gamesApiMock = {
        getGameDetails: jasmine.createSpy('getGameDetails').and.returnValue(of(null)),
    };

    const gamesStoreMock = {
        itemById: jasmine.createSpy('itemById').and.returnValue(new Map()),
        add: jasmine.createSpy('add'),
        remove: jasmine.createSpy('remove'),
        togglePlayed: jasmine.createSpy('togglePlayed'),
        setRating: jasmine.createSpy('setRating'),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GamesDetailsComponent],
            providers: [
                { provide: GamesApiService, useValue: gamesApiMock },
                { provide: GamesStore, useValue: gamesStoreMock },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        paramMap: of({
                            get: (key: string) => (key === 'id' ? '1' : null),
                        }),
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GamesDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
