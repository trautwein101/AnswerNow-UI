import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
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
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadStats();
    this.loadUsers();
  }
  

  loadStats(): void {
    this.isLoadingStats = true;
    this.adminService.getStats().subscribe({
      next: (data) => this.zone.run(() => {
        this.stats = data;
        this.isLoadingStats = false;
        this.cdr.markForCheck();
      }),
      error: (err) => this.handleError('Failed to load statistics', err)
    });
  }

  loadUsers(): void {
    this.isLoadingUsers = true;
    this.adminService.getUsers().subscribe({
      next: (data) => this.zone.run(() => {
        this.users = data;
        this.isLoadingUsers = false;
        this.cdr.markForCheck();
      }),
      error: (err) => this.handleError('Failed to load users', err)
    });
  }

  getUserStatus(user: Users): string {
    if(user.isInActive) return 'InActive';
    if(user.isPending) return 'Pending';
    if(user.isSuspended) return 'Suspended'; 
    if(user.isBanned) return 'Banned';
    return 'Active';
  }

  getUserStatusClass(user: Users): string {
    if(user.isInActive) return 'inactive'; 
    if(user.isPending) return 'pending';
    if(user.isSuspended) return 'suspended'; 
    if(user.isBanned) return 'banned';
    return 'active';
  }

  onRoleChange(user: Users, newRole: string): void {
    this.adminService.changeUserRole(user.id, newRole).subscribe({
      next: (updatedUser) => this.applyUserUpdate(user, updatedUser),
      error: (err) => this.handleError(
        `Failed to change role for ${user.displayName}`,
        err
      )
    });
  }

  toggleActive(user: Users): void {
    const newActiveStatus = !user.isActive;
    this.adminService.setUserActiveStatus(user.id, newActiveStatus).subscribe({
      next: (updatedUser) => this.applyUserUpdate(user, updatedUser),
      error: (err) => this.handleError(
        `Failed to ${newActiveStatus ? 'activate' : 'deactivate'} ${user.displayName}`,
        err
      )
    });
  }

  togglePending(user : Users): void {
    const newPendingStatus = !user.isPending;
    this.adminService.setUserPendingStatus(user.id, newPendingStatus).subscribe({
      next: (updatedUser) => this.applyUserUpdate(user, updatedUser),
      error: (err) => this.handleError(
        `Failed to ${newPendingStatus ? 'pending' : 'unpending'} ${user.displayName}`,
        err
      )
    });
  }

  toggleSuspend(user: Users): void {
    const newSuspendStatus = !user.isSuspended;
    this.adminService.setUserSuspendStatus(user.id, newSuspendStatus).subscribe({
      next: (updatedUser) => this.applyUserUpdate(user, updatedUser),
      error: (err) => this.handleError(
        `Failed to ${newSuspendStatus ? 'suspend' : 'unsuspend'} ${user.displayName}`,
        err
      )
    });
  }

   toggleBan(user: Users): void {
    const newBanStatus = !user.isBanned;
    this.adminService.setUserBanStatus(user.id, newBanStatus).subscribe({
      next: (updatedUser) => this.applyUserUpdate(user, updatedUser),
      error: (err) => this.handleError(
        `Failed to ${newBanStatus ? 'ban' : 'unban'} ${user.displayName}`,
        err
      )
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  private applyUserUpdate(user: Users, updatedUser: Users) {
    this.zone.run(() => {
      Object.assign(user, updatedUser);
      this.cdr.markForCheck();
    });
  }

  private handleError(message: string, err: any) {
    console.error(err);
    this.zone.run(() => {
      this.errorMessage = message;
      this.cdr.markForCheck();
    });
  }

}


