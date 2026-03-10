import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environments';
import { RawgGame, RawgSearchResponse } from './games.types';

@Injectable({ providedIn: 'root' })
export class GamesApiService {
    private http = inject(HttpClient);
    private readonly baseUrl = 'https://api.rawg.io/api';

    searchGames(query: string): Observable<RawgGame[]> {
        const params = new HttpParams()
            .set('key', environment.rawgApiKey)
            .set('search', query)
            .set('language', 'de')
            .set('page_size', '20');

        return this.http
            .get<RawgSearchResponse>(`${this.baseUrl}/games`, { params })
            .pipe(map((res) => res.results ?? []));
    }

    getGameDetails(id: string): Observable<RawgGame> {
        const params = new HttpParams()
            .set('key', environment.rawgApiKey)
            .set('language', 'de');

        return this.http.get<RawgGame>(`${this.baseUrl}/games/${id}`, { params });
    }
}
