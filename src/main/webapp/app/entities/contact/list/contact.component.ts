import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IContact } from '../contact.model';
import { ContactService } from '../service/contact.service';
import { ContactDeleteDialogComponent } from '../delete/contact-delete-dialog.component';

@Component({
  selector: 'jhi-contact',
  templateUrl: './contact.component.html',
})
export class ContactComponent implements OnInit {
  contacts?: IContact[];
  isLoading = false;

  constructor(protected contactService: ContactService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.contactService.query().subscribe(
      (res: HttpResponse<IContact[]>) => {
        this.isLoading = false;
        this.contacts = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IContact): number {
    return item.id!;
  }

  delete(contact: IContact): void {
    const modalRef = this.modalService.open(ContactDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.contact = contact;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
