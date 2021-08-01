import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IGrade } from '../grade.model';
import { GradeService } from '../service/grade.service';

@Component({
  templateUrl: './grade-delete-dialog.component.html',
})
export class GradeDeleteDialogComponent {
  grade?: IGrade;

  constructor(protected gradeService: GradeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.gradeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
