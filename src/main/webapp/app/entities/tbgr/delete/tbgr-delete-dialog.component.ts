import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITbgr } from '../tbgr.model';
import { TbgrService } from '../service/tbgr.service';

@Component({
  templateUrl: './tbgr-delete-dialog.component.html',
})
export class TbgrDeleteDialogComponent {
  tbgr?: ITbgr;

  constructor(protected tbgrService: TbgrService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.tbgrService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
