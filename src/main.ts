import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes'; 
import { loggingInterceptor } from './app/components/interceptor/http-logging.interceptor';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    provideRouter(routes), 
    provideHttpClient(withInterceptors([loggingInterceptor])) ,
    provideAnimations(),
  ]
})
  .then(() => console.log('Application started'))
  .catch((err) => console.error(err));
