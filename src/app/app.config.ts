import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

import dayjs from 'dayjs';
import 'dayjs/locale/pl';
dayjs.locale('pl');

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
};
