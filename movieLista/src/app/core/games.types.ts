export type GameItem = {
    id: string;
    title: string;
    released: string;
    year: string;
    genres: string[];
    platforms: string[];
    ratingAverage?: number | null;
    ratingCount?: number | null;
    description?: string;
    backgroundImage?: string | null;
    website?: string;
    addedAt: string; // ISO date
    played: boolean;
    userRating?: number | null;
};

export type RawgSearchResponse = {
    results?: RawgGame[];
};

export type RawgGame = {
    id: number;
    name: string;
    released?: string;
    rating?: number;
    ratings_count?: number;
    background_image?: string;
    genres?: Array<{ name: string }>;
    platforms?: Array<{ platform?: { name?: string } }>;
    description_raw?: string;
    website?: string;
};

export function toGameItem(g: RawgGame): GameItem {
    const released = g.released ?? '';
    const year = released ? released.slice(0, 4) : '';

    return {
        id: String(g.id),
        title: g.name ?? 'Untitled',
        released,
        year,
        genres: (g.genres ?? []).map((x) => x.name).filter(Boolean),
        platforms: (g.platforms ?? []).map((x) => x.platform?.name ?? '').filter(Boolean),
        ratingAverage: g.rating ?? null,
        ratingCount: g.ratings_count ?? null,
        description: g.description_raw ?? undefined,
        backgroundImage: g.background_image ?? null,
        website: g.website ?? undefined,
        addedAt: new Date().toISOString(),
        played: false,
        userRating: null,
    };
}
