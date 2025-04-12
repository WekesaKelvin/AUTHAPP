import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatButtonModule, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'client';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.authStatus$.subscribe((isLoggedIn) => {
      if (!isLoggedIn) {
        console.log("User is logged out, redirecting...");
        this.router.navigate(['/loginhttp://localhost:49314/login']);
      }
    });
  }
}
