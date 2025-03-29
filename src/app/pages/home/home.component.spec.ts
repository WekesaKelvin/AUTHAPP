import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authServiceMock: Partial<AuthService>;

  beforeEach(async () => {
    authServiceMock = {
      isLoggedIn: jest.fn().mockReturnValue(true), // Mocked function
    };

    await TestBed.configureTestingModule({
      imports: [RouterLink, MatIcon],
      declarations: [HomeComponent],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should check if user is logged in using AuthService', () => {
    expect(authServiceMock.isLoggedIn).toHaveBeenCalled();
  });
});

