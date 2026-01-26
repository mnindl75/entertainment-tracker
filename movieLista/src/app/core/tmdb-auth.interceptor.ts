import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environments';

export const tmdbAuthInterceptor: HttpInterceptorFn = (req, next) => {
    // Nur für TMDB-Requests Header setzen
    if (!req.url.startsWith(environment.tmdbBaseUrl)) {
        return next(req);
    }

    return next(
        req.clone({
            setHeaders: {
                Authorization: `Bearer ${environment.tmdbToken}`,
                accept: 'application/json',
            },
        }),
    );
};
