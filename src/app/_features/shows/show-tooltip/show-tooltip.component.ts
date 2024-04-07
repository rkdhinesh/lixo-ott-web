import { Component, OnInit, Input } from '@angular/core';



@Component({
  selector: 'mp-show-tooltip',
  templateUrl: './show-tooltip.component.html',
  styleUrls: ['./show-tooltip.component.scss']
})
export class ShowTooltipComponent implements OnInit {

  @Input() classes: any;
  @Input() legend: any;
  @Input() boxOfficeOnlyFlag:boolean;
  percentage = [];
  color = []
  statusMessage: string;
  statusColor: any;

  constructor() { }

  ngOnInit(): void {
    for (let legend of this.legend.legends) {
      this.percentage.push(legend.ceilPercentage)
      this.color.push(legend.legendName);
    }
      this.classes.forEach(element => {
      let total = (element.availableSeats / element.totalSeats) * 100;
    
      if
       (total >= this.percentage[2].replace("%", "")) {
        element.statusMessage = "Available"
        element.statusColor = this.color[1];
      }
      else if (total >= this.percentage[0].replace("%", "") && total <= this.percentage[2].replace("%", "")) {
        element.statusMessage = "Fill Fast"
        element.statusColor = this.color[2];
      }
      else if (total <= this.percentage[3].replace("%", "")) {
        element.statusMessage = "Sold Out"
        element.statusColor = this.color[3];
      }
      else if (total <= this.percentage[0].replace("%", "")) {
        element.statusMessage = "Fill Fast"
        element.statusColor = this.color[0];
      }
      
    if (this.boxOfficeOnlyFlag) {
        element.statusMessage = "Box Office Only"
        element.statusColor = this.color[3];
      }  
     
    }
    );;
  }

}


