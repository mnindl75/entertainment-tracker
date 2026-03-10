import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { GamesComponent } from './games.component';
import { GamesApiService } from '../../core/games-api.service';
import { GamesStore } from '../../core/games.store';

describe('GamesComponent', () => {
    let component: GamesComponent;
    let fixture: ComponentFixture<GamesComponent>;

    const gamesApiMock = {
        searchGames: jasmine.createSpy('searchGames').and.returnValue(of([])),
    };

    const gamesStoreMock = {
        add: jasmine.createSpy('add'),
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GamesComponent, NoopAnimationsModule],
            providers: [
                { provide: GamesApiService, useValue: gamesApiMock },
                { provide: GamesStore, useValue: gamesStoreMock },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(GamesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
