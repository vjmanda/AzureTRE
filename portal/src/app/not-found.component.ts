// this component exists solely to satisfy a
// required parameter for a route object
// It does nothing else.
import { Component } from '@angular/core';

@Component({
    selector: 'app-not-found',
    template: `<div> The page you are looking for was not found! </div>`,
})
export class NotFoundComponent { }
