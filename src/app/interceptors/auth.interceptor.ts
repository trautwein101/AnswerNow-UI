import { HttpInterceptorFn, HttpErrorResponse } from "@angular/common/http";  
import { inject } from "@angular/core";
import { catchError, switchMap, throwError } from "rxjs";
import { AuthService } from "../services/auth";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    //inject to get service
    const authService = inject(AuthService);

    //skip auth header for auth endpoints ~ login, register, refresh
    if(req.url.includes('/Auth/')){
        return next(req);
    }

    if(authService.isAccessTokenExpired() && authService.getRefreshToken()){
        //token is expired but we have a refresh token ~ refresh first
        return authService.refreshToken().pipe(
            switchMap(() => {
                //refresh succeeded ~ retry original request with new token
                const newToken = authService.getAccessToken();
                const clonedRequest = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${newToken}`
                    }
                });
                return next(clonedRequest);
            }),
            catchError(error => {
                //Refresh failed ~ user will be logged out by AuthService
                return throwError(() => error);
            })
        );
    }

    //Get token from AuthService
    const token = authService.getAccessToken();

    if(token){
        //If token then clone the request and add header
        //request cloning is immutable so clone and mdify, not modify directly
        //auth header formate is "Bearer <token>"
        const clonedRequest = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

     // Handle 401 responses (token rejected by server)
        return next(clonedRequest).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401 && !authService.isCurrentlyRefreshing) {
                    // Access token was rejected - try to refresh
                    authService.isCurrentlyRefreshing = true;
                    
                    return authService.refreshToken().pipe(
                        switchMap(() => {
                            authService.isCurrentlyRefreshing = false;
                            // Retry with new token
                            const newToken = authService.getAccessToken();
                            const retryRequest = req.clone({
                                setHeaders: {
                                    Authorization: `Bearer ${newToken}`
                                }
                            });
                            return next(retryRequest);
                        }),
                        catchError(refreshError => {
                            authService.isCurrentlyRefreshing = false;
                            return throwError(() => refreshError);
                        })
                    );
                }
                return throwError(() => error);
            })
        );
    }   

    //no token so send request as is
    return next(req);
}