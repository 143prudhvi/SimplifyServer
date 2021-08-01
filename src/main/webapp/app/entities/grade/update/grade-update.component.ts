import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IGrade, Grade } from '../grade.model';
import { GradeService } from '../service/grade.service';

@Component({
  selector: 'jhi-grade-update',
  templateUrl: './grade-update.component.html',
})
export class GradeUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    grade: [],
  });

  constructor(protected gradeService: GradeService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ grade }) => {
      this.updateForm(grade);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const grade = this.createFromForm();
    if (grade.id !== undefined) {
      this.subscribeToSaveResponse(this.gradeService.update(grade));
    } else {
      this.subscribeToSaveResponse(this.gradeService.create(grade));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGrade>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(grade: IGrade): void {
    this.editForm.patchValue({
      id: grade.id,
      grade: grade.grade,
    });
  }

  protected createFromForm(): IGrade {
    return {
      ...new Grade(),
      id: this.editForm.get(['id'])!.value,
      grade: this.editForm.get(['grade'])!.value,
    };
  }
}
