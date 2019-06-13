import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProgressBarService {
  progress = new Subject<boolean>();

  constructor() { }

  show() {
    this.progress.next(true);
  }

  hide() {
    this.progress.next(false);
  }
}
