import { GoogleBookVolume } from './google-books.service';

export type BookItem = {
    id: string;
    title: string;
    subtitle?: string;
    authors: string[];
    year: string;
    language: string;
    description?: string;
    categories?: string[];
    ratingAverage?: number | null;
    ratingCount?: number | null;
    coverUrl?: string | null;
    addedAt: string; // ISO date
    read: boolean;
    userRating?: number | null;
};

export function toBookItem(b: GoogleBookVolume): BookItem {
    const info = b.volumeInfo ?? {};
    const date = info.publishedDate ?? '';
    const year = date ? date.slice(0, 4) : '';

    return {
        id: b.id,
        title: info.title ?? 'Untitled',
        subtitle: info.subtitle ?? undefined,
        authors: info.authors ?? [],
        year,
        language: info.language ?? '',
        description: info.description ?? undefined,
        categories: info.categories ?? undefined,
        ratingAverage: info.averageRating ?? null,
        ratingCount: info.ratingsCount ?? null,
        coverUrl: info.imageLinks?.thumbnail ?? null,
        addedAt: new Date().toISOString(),
        read: false,
        userRating: null,
    };
}
