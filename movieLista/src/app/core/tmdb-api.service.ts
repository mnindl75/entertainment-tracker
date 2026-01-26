import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';

type TmdbMultiResult = {
    id: number;
    media_type: 'movie' | 'tv' | 'person';

    title?: string;
    original_title?: string;
    release_date?: string;

    name?: string;
    original_name?: string;
    first_air_date?: string;

    poster_path?: string | null;
};

type TmdbSearchMultiResponse = {
    page: number;
    results: TmdbMultiResult[];
    total_pages: number;
    total_results: number;
};

@Injectable({ providedIn: 'root' })
export class TmdbApiService {
    constructor(private http: HttpClient) {}

    searchMulti(query: string, language = 'de-DE', region = 'DE') {
        return this.http.get<TmdbSearchMultiResponse>(`${environment.tmdbBaseUrl}/search/multi`, {
            params: {
                query,
                language,
                region,
                include_adult: 'false',
                page: '1',
            },
        });
    }
}
