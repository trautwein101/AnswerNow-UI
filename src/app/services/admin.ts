import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { AdminStats, Users } from "../models/admin";

@Injectable({
  providedIn: 'root',
})
export class AdminService {

    private apiUrl = 'https://localhost:7252/api/Admin';

    constructor(
        private http: HttpClient){}

    //GET /api/admin/stats
    getStats(): Observable<AdminStats> {
        return this.http.get<AdminStats>(`${this.apiUrl}/stats`);
    }

    //GET /api/admin/users
    getUsers(): Observable<Users[]>{
        return this.http.get<Users[]>(`${this.apiUrl}/users`);
    }

    //POST /api/admin/{userId}/role?newRole=Admin
    changeUserRole(userId: number, newRole: string): Observable<Users>{
        return this.http.post<Users>(`${this.apiUrl}/${userId}/role?newRole=${newRole}`,
        {});
    }

    //POST /api/admin/{userId}/banned?isBanned=true
    setUserBanStatus(userId: number, isBanned: boolean): Observable<Users>{
        return this.http.post<Users>(`${this.apiUrl}/${userId}/banned?isBanned=${isBanned}`,
        {});
    }
    
}    
