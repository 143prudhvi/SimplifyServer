import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVillage } from '../village.model';
import { VillageService } from '../service/village.service';

@Component({
  templateUrl: './village-delete-dialog.component.html',
})
export class VillageDeleteDialogComponent {
  village?: IVillage;

  constructor(protected villageService: VillageService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.villageService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
