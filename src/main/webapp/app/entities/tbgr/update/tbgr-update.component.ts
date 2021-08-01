import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ITbgr, Tbgr } from '../tbgr.model';
import { TbgrService } from '../service/tbgr.service';

@Component({
  selector: 'jhi-tbgr-update',
  templateUrl: './tbgr-update.component.html',
})
export class TbgrUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    board: [],
    village: [],
    tbgr: [],
    name: [],
  });

  constructor(protected tbgrService: TbgrService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tbgr }) => {
      this.updateForm(tbgr);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tbgr = this.createFromForm();
    if (tbgr.id !== undefined) {
      this.subscribeToSaveResponse(this.tbgrService.update(tbgr));
    } else {
      this.subscribeToSaveResponse(this.tbgrService.create(tbgr));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITbgr>>): void {
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

  protected updateForm(tbgr: ITbgr): void {
    this.editForm.patchValue({
      id: tbgr.id,
      board: tbgr.board,
      village: tbgr.village,
      tbgr: tbgr.tbgr,
      name: tbgr.name,
    });
  }

  protected createFromForm(): ITbgr {
    return {
      ...new Tbgr(),
      id: this.editForm.get(['id'])!.value,
      board: this.editForm.get(['board'])!.value,
      village: this.editForm.get(['village'])!.value,
      tbgr: this.editForm.get(['tbgr'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }
}
