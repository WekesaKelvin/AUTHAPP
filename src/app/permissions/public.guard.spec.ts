import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { PublicGuard } from './public.guard';
import { AuthService } from '../services/auth.service';

describe('PublicGuard', () => {
  let publicGuard: PublicGuard;
  let authServiceMock: jest.Mocked<AuthService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    authServiceMock = {
      isLoggedIn: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    routerMock = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      providers: [
        PublicGuard,
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    publicGuard = TestBed.inject(PublicGuard);
  });

  it('should prevent access and redirect to home when user is logged in', () => {
    authServiceMock.isLoggedIn.mockReturnValue(true);

    const result = publicGuard.canActivate();

    expect(result).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should allow access when user is not logged in', () => {
    authServiceMock.isLoggedIn.mockReturnValue(false);

    const result = publicGuard.canActivate();

    expect(result).toBe(true);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });
});
