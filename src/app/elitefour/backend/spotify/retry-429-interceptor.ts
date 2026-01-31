import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, retry, timer} from 'rxjs';

@Injectable()
export class Retry429Interceptor implements HttpInterceptor {
  private readonly maxNrOfRetries = 3;

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      retry({
        count: this.maxNrOfRetries,
        delay: (error, retryCount) => {
          if (
            error instanceof HttpErrorResponse &&
            error.status === 429
          ) {
            // Spotify should return a header when we should retry. If not, we retry after 10 seconds.
            const retryAfterSeconds = Number(error.headers.get('Retry-After'));
            const waitMs = !isNaN(retryAfterSeconds)
              ? retryAfterSeconds * 1000
              : 10_000;
            return timer(waitMs);
          }

          // For non-429 errors, throw immediately
          throw error;
        }
      })
    );
  }
}
