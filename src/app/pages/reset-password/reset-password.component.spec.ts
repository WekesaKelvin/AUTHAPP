import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ResetPasswordComponent } from './reset-password.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let authServiceMock: Partial<AuthService>;
  let matSnackBarMock: Partial<MatSnackBar>;
  let routerMock: Partial<Router>;
  let activatedRouteMock: Partial<ActivatedRoute>;

  beforeEach(async () => {
    authServiceMock = {
      resetPassword: jest.fn(),
    };
    matSnackBarMock = {
      open: jest.fn(),
    };
    routerMock = {
      navigate: jest.fn(),
    };
    activatedRouteMock = {
      queryParams: of({ token: 'mockToken123' }),
      snapshot: {
        queryParams: { token: 'mockToken123' },
        url: [],
        params: {},
        fragment: null,
        data: {},
        outlet: 'primary',
        component: null,
        firstChild: null,
        children: [],
        root: {} as ActivatedRouteSnapshot,
        pathFromRoot: [],
        paramMap: {} as any,
        queryParamMap: {} as any,
        routeConfig: null,
        title: undefined,
        parent: null
      },
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [ResetPasswordComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: MatSnackBar, useValue: matSnackBarMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should extract token from URL and populate the form', () => {
    expect(component.resetPasswordForm.value.token).toBe('mockToken123');
  });

  it('should call AuthService resetPassword method on valid submission', () => {
    component.resetPasswordForm.setValue({ token: 'mockToken123', newPassword: 'newPass123' });
    (authServiceMock.resetPassword as jest.Mock).mockReturnValue(of({ message: 'Password reset successful' }));

    component.onSubmit();

    expect(authServiceMock.resetPassword).toHaveBeenCalledWith('mockToken123', 'newPass123');
    expect(matSnackBarMock.open).toHaveBeenCalledWith('Password reset successfully!', 'Close', { duration: 3000 });
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should show error message when reset password fails', () => {
    component.resetPasswordForm.setValue({ token: 'mockToken123', newPassword: 'newPass123' });
    (authServiceMock.resetPassword as jest.Mock).mockReturnValue(throwError(() => ({ error: { message: 'Invalid or expired token.' } })));

    component.onSubmit();

    expect(component.errorMessage).toBe('Invalid or expired token.');
    expect(component.isSubmitting).toBe(false);
  });
});
