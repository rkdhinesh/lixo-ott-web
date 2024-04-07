import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationRoutingModule } from './location-routing.module';
import { ViewLocationsComponent } from './view-locations/view-locations.component';
import { SearchPipe } from '../search.pipe';
import { FormsModule } from '@angular/forms';
import { SearchComponent } from 'src/app/_shared/search/search.component';


@NgModule({
    declarations: [ViewLocationsComponent, SearchComponent, SearchPipe],
    imports: [CommonModule, FormsModule, LocationRoutingModule,],
    exports: [ViewLocationsComponent, SearchComponent, SearchPipe],
})
export class LocationModule { }
