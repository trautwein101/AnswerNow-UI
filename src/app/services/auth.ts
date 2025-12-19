import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap, catchError, throwError } from "rxjs";
import { Router } from "@angular/router";

import { LoginRequest, RegisterRequest, AuthResponse, RefreshTokenRequest, User, UserRoles, UserRole } from "../models/auth";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'https://localhost:7252/api/Auth';
    
    //Storage keys
    private readonly ACCESS_TOKEN_KEY = 'access_token';
    private readonly REFRESH_TOKEN_KEY = 'refresh_token';
    private readonly USER_KEY = 'auth_user';

    //BehaviorSubject ~ reactive state via RxJS
    //components 'subscribe' to user changes ~ auto-update UI
    private currentUserSubject = new BehaviorSubject<User | null>(null);

    //Public Observable ~ components to subscribe for updates
    //.asObservable() prevents calling .next()
    public currentUser$ = this.currentUserSubject.asObservable();

    private isRefreshing = false; //prevent multiple refresh attempts

    constructor(
        private http: HttpClient,
        private router: Router
    ){
        //initialize to see if previously logged in
        this.loadStoredUser();
    }

    //Initialize ~ Called on app startup to restore previous session
    private loadStoredUser(): void {
        const userJson = localStorage.getItem(this.USER_KEY);
        if(userJson){
            try{
                const user = JSON.parse(userJson) as User;
                this.currentUserSubject.next(user);
            }catch{
                this.clearStorage();
            }
        }
    }

    //Register a new user
    //POST /api/Auth/register
    register(request: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/register`, request)
        .pipe(
            //RxJS tap() operator will perform side-effects without changing response data
            tap(response => this.handleAuthSuccess(response))  
        );
    }

    //Login existing user
    //POST /api/Auth/login
    login(request: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request)
        .pipe(
            tap(response => this.handleAuthSuccess(response))
        );
    }

    //Refresh token
    //POST /api/Auth/refresh
    refreshToken(): Observable<AuthResponse> {
        const refreshToken = this.getRefreshToken();
        
        if (!refreshToken) {
            // No refresh token - force logout
            this.logout();
            return throwError(() => new Error('No refresh token available'));
        }

        const request: RefreshTokenRequest = { refreshToken };
        
        return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, request)
        .pipe(
            tap(response => {
                console.log('Token refreshed successfully');
                this.handleAuthSuccess(response);
            }),
            catchError(error => {
                // Refresh failed - token expired or revoked
                console.error('Token refresh failed:', error);
                this.logout();
                return throwError(() => error);
            })
        );
    }

    //Logout ~ single device
    //POST /api/Auth/logout 
    logout(): void {
        const refreshToken = this.getRefreshToken();

        if(refreshToken){
            //invalidate the refresh token on server
            this.http.post(`${this.apiUrl}/logout`, {refreshToken})
            .subscribe({
                next: () => console.log('Logged out from server'),
                error: (err) => console.error('Logout error:', err)
            });
        }

        //clear lcoal storage immediately
        this.clearStorage();
        this.currentUserSubject.next(null);
        this.router.navigate(['/login']);
    }

    //Logout everywhere ~ all devices
    logoutEverywhere(): Observable<void>{
        return this.http.post<void>(`${this.apiUrl}/logout-everywhere`, {})
        .pipe(
            tap(() => {
                this.clearStorage();
                this.currentUserSubject.next(null);
                this.router.navigate(['/']);
            })
        );
    }

    //Handle successful login/register
    private handleAuthSuccess(response: AuthResponse): void{
        //store token for API requests
        localStorage.setItem(this.ACCESS_TOKEN_KEY, response.accessToken);
        localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);

        //store user info
        const user: User = {
            userId: response.userId,
            email: response.email,
            displayName: response.displayName,
            role: response.role as UserRole
        };
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));

        //update the BehaviorSubject ~ will notify all subscribers
        this.currentUserSubject.next(user);
    }

    //Storage helpers
    private clearStorage(): void {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }

    //Getters ~ to check auth state
    //Get stored token used by HTTP Interceptor
    getAccessToken(): string | null {
        return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }

    //Get regresh token
    getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    //check if user is logged in
    isLoggedIn(): boolean {
        return !!this.getRefreshToken();
    }

    //get user synchronously
    getCurrentUser(): User | null {
        return this.currentUserSubject.value;
    }

    //Check if access token is expired
    isAccessTokenExpired(): boolean{
        const token = this.getAccessToken();
        if(!token) return true;

        try{
            //JWT structure: header.payload.signature
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiry = payload.exp * 1000; //for milliseconds

            return Date.now() >= (expiry - 10000); //added 10 second beffer
        }catch{
            return true;
        }
    }

    //Getter for refreshing state ~ used by interceptor
    get isCurrentlyRefreshing(): boolean {
        return this.isRefreshing;
    }

    set isCurrentlyRefreshing(value: boolean){
        this.isRefreshing = value;
    }


    //Role helpers
    //checks if user has a role
    hasRole(role: UserRole): boolean {
        const user = this.getCurrentUser();
        return user?.role === role;
    }

    //check if is admin
    isAdmin(): boolean {
        return this.hasRole(UserRoles.Admin);
    }

    //Check if user is Moderator or Admin
    isModerator() : boolean {
        const user = this.getCurrentUser();
        return user?.role === UserRoles.Moderator || user?.role === UserRoles.Admin;
    }

    //Get current user's role
    getUserRole(): UserRole | null {
        return this.getCurrentUser()?.role ?? null;
    }
}
