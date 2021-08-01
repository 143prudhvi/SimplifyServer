import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITbgr } from '../tbgr.model';

@Component({
  selector: 'jhi-tbgr-detail',
  templateUrl: './tbgr-detail.component.html',
})
export class TbgrDetailComponent implements OnInit {
  tbgr: ITbgr | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tbgr }) => {
      this.tbgr = tbgr;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
