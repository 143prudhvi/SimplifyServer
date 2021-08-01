import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IContact } from '../contact.model';
import { ContactService } from '../service/contact.service';

@Component({
  templateUrl: './contact-delete-dialog.component.html',
})
export class ContactDeleteDialogComponent {
  contact?: IContact;

  constructor(protected contactService: ContactService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.contactService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
