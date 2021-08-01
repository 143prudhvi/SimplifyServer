import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IVillage } from '../village.model';
import { VillageService } from '../service/village.service';
import { VillageDeleteDialogComponent } from '../delete/village-delete-dialog.component';

@Component({
  selector: 'jhi-village',
  templateUrl: './village.component.html',
})
export class VillageComponent implements OnInit {
  villages?: IVillage[];
  isLoading = false;

  constructor(protected villageService: VillageService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.villageService.query().subscribe(
      (res: HttpResponse<IVillage[]>) => {
        this.isLoading = false;
        this.villages = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IVillage): number {
    return item.id!;
  }

  delete(village: IVillage): void {
    const modalRef = this.modalService.open(VillageDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.village = village;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
