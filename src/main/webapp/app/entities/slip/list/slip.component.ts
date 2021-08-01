import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISlip } from '../slip.model';
import { SlipService } from '../service/slip.service';
import { SlipDeleteDialogComponent } from '../delete/slip-delete-dialog.component';

@Component({
  selector: 'jhi-slip',
  templateUrl: './slip.component.html',
})
export class SlipComponent implements OnInit {
  slips?: ISlip[];
  isLoading = false;

  constructor(protected slipService: SlipService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.slipService.query().subscribe(
      (res: HttpResponse<ISlip[]>) => {
        this.isLoading = false;
        this.slips = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISlip): number {
    return item.id!;
  }

  delete(slip: ISlip): void {
    const modalRef = this.modalService.open(SlipDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.slip = slip;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
