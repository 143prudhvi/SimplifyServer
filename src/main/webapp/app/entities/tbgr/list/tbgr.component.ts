import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITbgr } from '../tbgr.model';
import { TbgrService } from '../service/tbgr.service';
import { TbgrDeleteDialogComponent } from '../delete/tbgr-delete-dialog.component';

@Component({
  selector: 'jhi-tbgr',
  templateUrl: './tbgr.component.html',
})
export class TbgrComponent implements OnInit {
  tbgrs?: ITbgr[];
  isLoading = false;

  constructor(protected tbgrService: TbgrService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.tbgrService.query().subscribe(
      (res: HttpResponse<ITbgr[]>) => {
        this.isLoading = false;
        this.tbgrs = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ITbgr): number {
    return item.id!;
  }

  delete(tbgr: ITbgr): void {
    const modalRef = this.modalService.open(TbgrDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.tbgr = tbgr;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
