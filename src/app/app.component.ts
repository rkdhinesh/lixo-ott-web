import { Component, TemplateRef } from "@angular/core";
import { ModalService } from "./_core/service/modal.service";

@Component({
  selector: "mp-app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "movie-reservation-web";

  constructor(private modalService: ModalService) {

  }

  widthCondition: boolean = false;
  openNav() {
    this.widthCondition = true;
  }
  closeNav() {
    this.widthCondition = false;
  }

  openModal(template: TemplateRef<any>, componentName: String) {
    let config = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        class: componentName == 'location' ? 'modal-dialog-centered modal-custom' : 'modal-xl modal-cus',
    };
    this.modalService.show(template, config);
}
}
