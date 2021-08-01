import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { GradeComponent } from './list/grade.component';
import { GradeDetailComponent } from './detail/grade-detail.component';
import { GradeUpdateComponent } from './update/grade-update.component';
import { GradeDeleteDialogComponent } from './delete/grade-delete-dialog.component';
import { GradeRoutingModule } from './route/grade-routing.module';

@NgModule({
  imports: [SharedModule, GradeRoutingModule],
  declarations: [GradeComponent, GradeDetailComponent, GradeUpdateComponent, GradeDeleteDialogComponent],
  entryComponents: [GradeDeleteDialogComponent],
})
export class GradeModule {}
