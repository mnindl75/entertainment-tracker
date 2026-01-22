import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';

export type OmdbSearchItem = {
    Title: string;
    Year: string;
    imdbID: string;
    Type: 'movie' | 'series' | 'episode';
    Poster: string;
};

type OmdbSearchResponse =
    | { Search: OmdbSearchItem[]; totalResults: string; Response: 'True' }
    | { Response: 'False'; Error: string };

@Injectable({ providedIn: 'root' })
export class MovieApiService {
    constructor(private http: HttpClient) {}

    search(title: string) {
        const url =
            `${environment.omdbBaseUrl}/?apikey=${environment.omdbApiKey}` +
            `&s=${encodeURIComponent(title)}`;

        return this.http.get<OmdbSearchResponse>(url);
    }
}
