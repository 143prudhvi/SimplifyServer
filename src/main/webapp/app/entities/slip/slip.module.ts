import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SlipComponent } from './list/slip.component';
import { SlipDetailComponent } from './detail/slip-detail.component';
import { SlipUpdateComponent } from './update/slip-update.component';
import { SlipDeleteDialogComponent } from './delete/slip-delete-dialog.component';
import { SlipRoutingModule } from './route/slip-routing.module';

@NgModule({
  imports: [SharedModule, SlipRoutingModule],
  declarations: [SlipComponent, SlipDetailComponent, SlipUpdateComponent, SlipDeleteDialogComponent],
  entryComponents: [SlipDeleteDialogComponent],
})
export class SlipModule {}
