import { OmdbSearchItem } from './movie-api.service';

export type LibraryItem = {
    imdbID: string;
    title: string;
    year: string;
    type: 'movie' | 'series' | 'episode';
    poster: string;
    addedAt: string; // ISO date
    seen: boolean;
};

export function toLibraryItem(m: OmdbSearchItem): LibraryItem {
    return {
        imdbID: m.imdbID,
        title: m.Title,
        year: m.Year,
        type: m.Type,
        poster: m.Poster,
        addedAt: new Date().toISOString(),
        seen: true,
    };
}
