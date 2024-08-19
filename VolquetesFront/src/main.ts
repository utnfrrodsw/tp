import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import {routes} from './app/app.routes.js';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';


bootstrapApplication(AppComponent, 
  {
    providers: [
      provideRouter(routes),
      { provide: appConfig, useValue: appConfig },
      provideAnimationsAsync(),
      // Other providers here
    ],
  })
  .catch((err) => console.error(err));
