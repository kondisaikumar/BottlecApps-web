import { Component, OnInit } from '@angular/core';
import { ProgressBarService } from '../../services/progress-bar.service';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {

  inProgress: boolean;
  constructor(private progressBarService: ProgressBarService) {
    this.progressBarService.progress.subscribe(data => {
      this.inProgress = data;
    });
  }

  ngOnInit() {
    this.inProgress = false;
  }

}
