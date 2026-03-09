import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';

export type GoogleBookVolume = {
    id: string;
    volumeInfo?: {
        title?: string;
        subtitle?: string;
        authors?: string[];
        publisher?: string;
        publishedDate?: string;
        description?: string;
        industryIdentifiers?: { type: string; identifier: string }[];
        pageCount?: number;
        categories?: string[];
        averageRating?: number;
        ratingsCount?: number;
        maturityRating?: string;
        language?: string;
        previewLink?: string;
        infoLink?: string;
        canonicalVolumeLink?: string;
        printType?: string;
        imageLinks?: {
            thumbnail?: string;
            smallThumbnail?: string;
        };
    };
};

export type GoogleBooksResponse = {
    totalItems: number;
    items?: GoogleBookVolume[];
};

@Injectable({ providedIn: 'root' })
export class GoogleBooksService {
    private readonly baseUrl = 'https://www.googleapis.com/books/v1/volumes';

    constructor(private http: HttpClient) {}

    searchBooks(query: string, maxResults = 20, language = 'de') {
        const params: Record<string, string> = {
            q: query,
            maxResults: String(maxResults),
            printType: 'books',
            langRestrict: language,
        };

        if (environment.googleBooksApiKey) {
            params['key'] = environment.googleBooksApiKey;
        }

        return this.http.get<GoogleBooksResponse>(this.baseUrl, { params });
    }
}
