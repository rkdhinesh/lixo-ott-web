import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * Handled loading the external library ondemand into our app
 */
function _window(): any {
    // return the global native browser window object
    return window;
  }
@Injectable({providedIn: 'root'})
export class ExternalLibraryService {
    constructor(@Inject(PLATFORM_ID) private platformId: object) { }


get nativeWindow(): any {
  if (isPlatformBrowser(this.platformId)) {
    return _window();
  }
}
 
}
