import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingComponent } from './components/rating/rating.component';

import { ToastrModule } from 'ngx-toastr';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';

@NgModule({
imports: [
    CommonModule,
    ToastrModule.forRoot({positionClass: 'toast-top-right'})
],
declarations: [
    RatingComponent,
    ProgressBarComponent
],
exports: [
    RatingComponent,
    ProgressBarComponent
]
})
export class SharedModule {}
