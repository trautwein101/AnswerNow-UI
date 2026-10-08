import { DemoDataService } from './demo-data';
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, map, throwError } from "rxjs";
import { environment } from '../../environments/environment';
import { AdminStats, Users } from "../models/admin";

@Injectable({
  providedIn: 'root',
})
export class AdminService {

  private readonly apiUrl = `${environment.apiBaseUrl}/Admin`;

    constructor(
        private http: HttpClient, private demo: DemoDataService){}

    //GET /api/Admin/stats
    getStats(): Observable<AdminStats> {
        if (environment.demoMode) return this.demo.load().pipe(map(data => data.stats));
        return this.http.get<AdminStats>(`${this.apiUrl}/stats`);
    }

    //GET /api/Admin/users
    getUsers(): Observable<Users[]>{
        if (environment.demoMode) return this.demo.load().pipe(map(data => data.users));
        return this.http.get<Users[]>(`${this.apiUrl}/users`);
    }

    //POST /api/Admin/{userId}/role?newRole=Admin
    changeUserRole(userId: number, newRole: string): Observable<Users>{
        if (environment.demoMode) return throwError(() => new Error('Account management is paused in portfolio demo mode.'));
        const params = new HttpParams().set("newRole", newRole);
        return this.http.post<Users>(`${this.apiUrl}/${userId}/role`, {}, { params });
    }

    //POST /api/Admin/{userId}/activated?isActive=true 
    setUserActiveStatus(userId: number, isActive: boolean): Observable<Users>{
        return this.postWithBoolParam(userId, "activated", "isActive", isActive);
    }

    //POST /api/Admin/{userId}/pending?isPending=true 
    setUserPendingStatus(userId: number, isPending: boolean): Observable<Users>{
        return this.postWithBoolParam(userId, "pending", "isPending", isPending);
    }

    //POST /api/Admin/{userId}/suspended?isSuspended=true
    setUserSuspendStatus(userId: number, isSuspended: boolean): Observable<Users>{
        return this.postWithBoolParam(userId, "suspended", "isSuspended", isSuspended);
    }

    //POST /api/Admin/{userId}/banned?isBanned=true
    setUserBanStatus(userId: number, isBanned: boolean): Observable<Users>{
        return this.postWithBoolParam(userId, "banned", "isBanned", isBanned);
    }

    private postWithBoolParam(
        userId: number,
        route: string,
        paramName: string,
        value: boolean
    ): Observable<Users> {
        if (environment.demoMode) return throwError(() => new Error('Account management is paused in portfolio demo mode.'));
        const params = new HttpParams().set(paramName, String(value));
        return this.http.post<Users>(`${this.apiUrl}/${userId}/${route}`, {}, { params } );
       
    }

}    
