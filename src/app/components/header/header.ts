import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from '../../services/auth';
import { User } from '../../models/auth';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {

  //subscribe to user changes
  //currentUser$ is an observable and emits whenever user changes.
  //Use async pipe in template to subscribe
 currentUser$!: Observable<User | null>; //delared with ! so will be set in ngOnInit

 constructor(private authService: AuthService) {}

  ngOnInit(): void {
      this.currentUser$ = this.authService.currentUser$; //set after constructor
  }

  logout(): void {
    this.authService.logout();
  }
}