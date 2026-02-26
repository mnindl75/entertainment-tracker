import { OmdbSearchItem } from './movie-api.service';
import { SearchItem } from './search.types';

export type LibraryItem = {
    imdbID: string;
    title: string;
    year: string;
    type: 'movie' | 'series' | 'episode';
    poster: string;
    addedAt: string; // ISO date
    seen: boolean;
    ratingAverage?: number | null;
    ratingCount?: number | null;
};

export function toLibraryItem(m: SearchItem): LibraryItem {
    return {
        imdbID: String(m.id), // TMDB numeric id -> string
        title: m.title,
        year: m.year ?? '',
        type: m.mediaType === 'tv' ? 'series' : 'movie',
        poster: m.posterPath ?? 'N/A',
        addedAt: new Date().toISOString(),
        seen: true,
        ratingAverage: m.ratingAverage ?? null,
        ratingCount: m.ratingCount ?? null,
    };
}
