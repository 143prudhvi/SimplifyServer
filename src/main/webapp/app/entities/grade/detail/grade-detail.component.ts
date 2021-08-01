import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGrade } from '../grade.model';

@Component({
  selector: 'jhi-grade-detail',
  templateUrl: './grade-detail.component.html',
})
export class GradeDetailComponent implements OnInit {
  grade: IGrade | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ grade }) => {
      this.grade = grade;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
