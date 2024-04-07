import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { WalletRoutingModule } from "./wallet-routing.module";
import { WalletComponent } from './wallet.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [WalletComponent],
  imports: [
    CommonModule,
    FormsModule,      
    ReactiveFormsModule,
    WalletRoutingModule
  ],
  exports: [WalletComponent]
})
export class WalletModule { }
