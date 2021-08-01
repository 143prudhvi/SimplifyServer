import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IGrade } from '../grade.model';
import { GradeService } from '../service/grade.service';
import { GradeDeleteDialogComponent } from '../delete/grade-delete-dialog.component';

@Component({
  selector: 'jhi-grade',
  templateUrl: './grade.component.html',
})
export class GradeComponent implements OnInit {
  grades?: IGrade[];
  isLoading = false;

  constructor(protected gradeService: GradeService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.gradeService.query().subscribe(
      (res: HttpResponse<IGrade[]>) => {
        this.isLoading = false;
        this.grades = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IGrade): number {
    return item.id!;
  }

  delete(grade: IGrade): void {
    const modalRef = this.modalService.open(GradeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.grade = grade;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
