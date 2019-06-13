import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnChanges {
  @Input() rate;
  @Input() edit;
  @Output() rated = new EventEmitter<number>();

  starList: any;

  ngOnChanges() {
    this.setStar(this.rate);
  }

  setStar(rate: number) {
    rate = +rate;
    this.rated.emit(rate);
    this.starList = [0, 0, 0, 0, 0];

    for (let i = 0; i < rate; i++) {
      this.starList[i] = 1;
    }

    if (!Number.isInteger(rate)) {
      this.starList[Math.floor(rate)] = 0.5;
    }
  }

}
