import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { CoreAppModule } from './app/app.module';
import { environment } from './environments/environment';
import { Configuration } from '../../../src/app/models/configuration';




getConfig()
  .then(config => {
    if (environment.production) {
      enableProdMode();
    }

    // Load AppModule with config
    platformBrowserDynamic([{ provide: Configuration, useValue: config }])
      .bootstrapModule(CoreAppModule)
      .catch(err => console.error(err));
  });

// Loads default and runtime config, returns a promise containing both
// Inspired by https://timdeschryver.dev/blog/angular-build-once-deploy-to-multiple-environments
function getConfig() {
  // Load default config
  return fetch('/assets/config.default.json')
    .then(defaultResponse => defaultResponse.json())
    .then(config => {
      // Try to load generated configuration file (overrides from env)
      return fetch('/assets/config.json')
        .then(response => response.json())
        .then(configOverride => {
          return {...config, ...configOverride};
        })
        .catch(() => config);
    });
}
