import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IVillage, Village } from '../village.model';
import { VillageService } from '../service/village.service';

@Component({
  selector: 'jhi-village-update',
  templateUrl: './village-update.component.html',
})
export class VillageUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    board: [],
    village: [],
  });

  constructor(protected villageService: VillageService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ village }) => {
      this.updateForm(village);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const village = this.createFromForm();
    if (village.id !== undefined) {
      this.subscribeToSaveResponse(this.villageService.update(village));
    } else {
      this.subscribeToSaveResponse(this.villageService.create(village));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVillage>>): void {
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

  protected updateForm(village: IVillage): void {
    this.editForm.patchValue({
      id: village.id,
      board: village.board,
      village: village.village,
    });
  }

  protected createFromForm(): IVillage {
    return {
      ...new Village(),
      id: this.editForm.get(['id'])!.value,
      board: this.editForm.get(['board'])!.value,
      village: this.editForm.get(['village'])!.value,
    };
  }
}
