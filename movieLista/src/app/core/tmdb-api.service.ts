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

export type TmdbGenre = { id: number; name: string };

export type TmdbMovieDetails = {
    id: number;
    title: string;
    original_title: string;
    overview: string;
    release_date: string;
    runtime: number | null;
    genres: TmdbGenre[];
    poster_path: string | null;
    backdrop_path: string | null;
};

export type TmdbTvSeason = {
    season_number: number;
    name: string;
    episode_count: number;
};

export type TmdbTvDetails = {
    id: number;
    name: string;
    original_name: string;
    overview: string;
    first_air_date: string;
    number_of_seasons: number;
    number_of_episodes: number;
    genres: TmdbGenre[];
    seasons: TmdbTvSeason[];
    poster_path: string | null;
    backdrop_path: string | null;
};

export type TmdbEpisode = {
    episode_number: number;
    name: string;
    overview: string;
    air_date: string | null;
    runtime: number | null;
};

export type TmdbSeasonDetails = {
    id: number;
    name: string;
    season_number: number;
    overview: string;
    episodes: TmdbEpisode[];
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

    // --- methods ---
    getMovieDetails(id: number, language = 'de-DE') {
        return this.http.get<TmdbMovieDetails>(`${environment.tmdbBaseUrl}/movie/${id}`, {
            params: { language },
        });
    }

    getTvDetails(id: number, language = 'de-DE') {
        return this.http.get<TmdbTvDetails>(`${environment.tmdbBaseUrl}/tv/${id}`, {
            params: { language },
        });
    }

    getTvSeasonDetails(tvId: number, seasonNumber: number, language = 'de-DE') {
        return this.http.get<TmdbSeasonDetails>(
            `${environment.tmdbBaseUrl}/tv/${tvId}/season/${seasonNumber}`,
            { params: { language } },
        );
    }
}
