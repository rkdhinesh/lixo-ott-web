import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SeatLayoutComponent } from "../booking/seat-layout/seat-layout.component";
import { SummaryComponent } from "./summary/summary.component";
import { ConfirmationComponent } from "./confirmation/confirmation.component";
import { FailureComponent } from './failure/failure.component';

const routes: Routes = [
  {
    path: "",
    component: SeatLayoutComponent,
  },
  {
    path: "summary",
    component: SummaryComponent,
  },
  {
    path: "ticketconfirmation",
    component: ConfirmationComponent,
  },
  {
    path: "transactionfailure",
    component: FailureComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingRoutingModule { }
