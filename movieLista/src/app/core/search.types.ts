export type SearchItem = {
    id: number;
    mediaType: 'movie' | 'tv';
    title: string; // hier kommt der deutsche Titel (language=de-DE)
    originalTitle?: string; // optional
    year?: string; // "1999"
    posterPath?: string | null;
    ratingAverage?: number | null;
    ratingCount?: number | null;
};
