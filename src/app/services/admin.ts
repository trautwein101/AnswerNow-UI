import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../src/environments/environment";
import { AdminStats, Users } from "../models/admin";

@Injectable({
  providedIn: 'root',
})
export class AdminService {

  private readonly apiUrl = `${environment.apiBaseUrl}/Admin`;

    constructor(
        private http: HttpClient){}

    //GET /api/Admin/stats
    getStats(): Observable<AdminStats> {
        return this.http.get<AdminStats>(`${this.apiUrl}/stats`);
    }

    //GET /api/Admin/users
    getUsers(): Observable<Users[]>{
        return this.http.get<Users[]>(`${this.apiUrl}/users`);
    }

    //POST /api/Admin/{userId}/role?newRole=Admin
    changeUserRole(userId: number, newRole: string): Observable<Users>{
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
        const params = new HttpParams().set(paramName, String(value));
        return this.http.post<Users>(`${this.apiUrl}/${userId}/${route}`, {}, { params } );
       
    }

}    
