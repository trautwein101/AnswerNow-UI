import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AdminService } from '../../services/admin';
import { AdminStats, Users } from '../../models/admin';
import { UserRoles } from '../../models/auth';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard implements OnInit {
  
  stats: AdminStats | null = null;
  users: Users[] = [];
  
  isLoadingStats = true;
  isLoadingUsers = true;
  errorMessage = '';
  
  availableRoles = [UserRoles.User, UserRoles.Moderator, UserRoles.Admin];

  constructor(
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadUsers();
  }

  loadStats(): void {
    this.isLoadingStats = true;
    this.adminService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.isLoadingStats = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Failed to load stats:', err);
        this.errorMessage = 'Failed to load statistics';
        this.isLoadingStats = false;
        this.cdr.detectChanges(); 
      }
    });
  }

  loadUsers(): void {
    this.isLoadingUsers = true;
    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoadingUsers = false;
        this.cdr.detectChanges(); 
      },
      error: (err) => {
        console.error('Failed to load users:', err);
        this.errorMessage = 'Failed to load users';
        this.isLoadingUsers = false;
        this.cdr.detectChanges(); 
      }
    });
  }

  onRoleChange(user: Users, newRole: string): void {
    this.adminService.changeUserRole(user.id, newRole).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
      },
      error: (err) => {
        console.error('Failed to change role:', err);
        this.errorMessage = `Failed to change role for ${user.displayName}`;
      }
    });
  }

  toggleBan(user: Users): void {
    const newBanStatus = !user.isBanned;
    this.adminService.setUserBanStatus(user.id, newBanStatus).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
      },
      error: (err) => {
        console.error('Failed to toggle ban:', err);
        this.errorMessage = `Failed to ${newBanStatus ? 'ban' : 'unban'} ${user.displayName}`;
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

}