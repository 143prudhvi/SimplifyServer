import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TbgrComponent } from './list/tbgr.component';
import { TbgrDetailComponent } from './detail/tbgr-detail.component';
import { TbgrUpdateComponent } from './update/tbgr-update.component';
import { TbgrDeleteDialogComponent } from './delete/tbgr-delete-dialog.component';
import { TbgrRoutingModule } from './route/tbgr-routing.module';

@NgModule({
  imports: [SharedModule, TbgrRoutingModule],
  declarations: [TbgrComponent, TbgrDetailComponent, TbgrUpdateComponent, TbgrDeleteDialogComponent],
  entryComponents: [TbgrDeleteDialogComponent],
})
export class TbgrModule {}
