import { loggingInterceptor } from './http-logging.interceptor';
import { AuthService } from '../../services/auth.service';
import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { of } from 'rxjs';

describe('loggingInterceptor', () => {
  let authService: AuthService;
  let httpHandler: HttpHandler;

  beforeEach(() => {
    authService = { getToken: jest.fn() } as any;
    httpHandler = { handle: jest.fn(() => of({} as HttpEvent<any>)) } as any;
  });

  it('should attach the Authorization header when a token is present', () => {
    (authService.getToken as jest.Mock).mockReturnValue('mock-token');
    const request = new HttpRequest('GET', '/api/test');
    
    const clonedRequest = loggingInterceptor(request, (req) => httpHandler.handle(req));

    clonedRequest.subscribe(() => {
      expect(httpHandler.handle).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer mock-token'
          })
        })
      );
    });
  });

  it('should not attach the Authorization header when no token is present', () => {
    (authService.getToken as jest.Mock).mockReturnValue(null);
    const request = new HttpRequest('GET', '/api/test');
    
    const clonedRequest = loggingInterceptor(request, (req) => httpHandler.handle(req));

    clonedRequest.subscribe(() => {
      expect(httpHandler.handle).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.not.objectContaining({
            'Authorization': expect.any(String)
          })
        })
      );
    });
  });

  it('should log the request and response correctly', () => {
    console.log = jest.fn();
    console.error = jest.fn();
    
    (authService.getToken as jest.Mock).mockReturnValue('mock-token');
    const request = new HttpRequest('GET', '/api/test');

    const clonedRequest = loggingInterceptor(request, (req) => httpHandler.handle(req));

    clonedRequest.subscribe(() => {
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('HTTP Request: GET /api/test')
      );
      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('HTTP Response from /api/test')
      );
    });
  });
});
