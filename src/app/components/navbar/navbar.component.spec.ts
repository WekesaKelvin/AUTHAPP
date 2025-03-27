import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';



jest.mock('../../services/auth.service');
jest.mock('@angular/material/snack-bar');
jest.mock('@angular/router');

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authServiceMock: jest.Mocked<AuthService>;
  let matSnackBarMock: jest.Mocked<MatSnackBar>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(async () => {
    authServiceMock = {
      isLoggedIn: jest.fn().mockReturnValue(true),
      logout: jest.fn(),
      currentUser$: of(null),
      getToken: jest.fn(),
      getUserDetail: jest.fn(),
      login: jest.fn(),
      register: jest.fn(),
      updateProfile: jest.fn(),
      getCurrentUser: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    matSnackBarMock = {
      open: jest.fn(),
    } as unknown as jest.Mocked<MatSnackBar>;

    routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    await TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        CommonModule,
      ],
      declarations: [NavbarComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: MatSnackBar, useValue: matSnackBarMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the NavbarComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should return true if the user is logged in', () => {
    expect(component.isLoggedIn()).toBe(true);
    expect(authServiceMock.isLoggedIn).toHaveBeenCalled();
  });

  it('should call logout on AuthService and navigate to login on logout', () => {
    component.logout();

    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(matSnackBarMock.open).toHaveBeenCalledWith(
      'Logout success',
      'Close',
      expect.objectContaining({ duration: 5000, horizontalPosition: 'center' })
    );
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});
