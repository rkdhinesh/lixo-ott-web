import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ModalService } from 'src/app/_core/service/modal.service';

@Component({
  selector: 'mp-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  @ViewChild('login') login: ElementRef;

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {

  }

  openModal(template: any, componentName: String) {
    let config = {
        animated: true,
        keyboard: true,
        backdrop: true,
        ignoreBackdropClick: true,
        class: componentName == 'location' ? 'modal-dialog-centered modal-custom' : ' modal-dialog-centered ',
    };
    this.modalService.show(template, config);
}

}
