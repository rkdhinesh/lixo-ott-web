import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";

@Component({
  selector: "mp-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.scss"],
})
export class CardComponent implements OnInit {
  constructor() { }
  @Input()
  movie: any;
  @Input()
   index: number;
  @Output()
  movieSelect = new EventEmitter();

  ngOnInit(): void { }

  onCardSelect(movie: any) {
    this.movieSelect.emit(movie);
  }
  
}
