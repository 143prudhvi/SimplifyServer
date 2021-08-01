import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISlip } from '../slip.model';
import { SlipService } from '../service/slip.service';

@Component({
  templateUrl: './slip-delete-dialog.component.html',
})
export class SlipDeleteDialogComponent {
  slip?: ISlip;

  constructor(protected slipService: SlipService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.slipService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
