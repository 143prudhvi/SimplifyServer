import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVillage } from '../village.model';

@Component({
  selector: 'jhi-village-detail',
  templateUrl: './village-detail.component.html',
})
export class VillageDetailComponent implements OnInit {
  village: IVillage | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ village }) => {
      this.village = village;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
