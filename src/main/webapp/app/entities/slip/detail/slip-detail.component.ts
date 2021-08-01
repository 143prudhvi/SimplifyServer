import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISlip } from '../slip.model';

@Component({
  selector: 'jhi-slip-detail',
  templateUrl: './slip-detail.component.html',
})
export class SlipDetailComponent implements OnInit {
  slip: ISlip | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ slip }) => {
      this.slip = slip;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
