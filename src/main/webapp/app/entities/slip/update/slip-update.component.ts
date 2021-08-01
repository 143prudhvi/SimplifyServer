import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ISlip, Slip } from '../slip.model';
import { SlipService } from '../service/slip.service';

@Component({
  selector: 'jhi-slip-update',
  templateUrl: './slip-update.component.html',
})
export class SlipUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    date: [],
    tbgr: [],
    grade: [],
    lotno: [],
    weight: [],
    price: [],
  });

  constructor(protected slipService: SlipService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ slip }) => {
      if (slip.id === undefined) {
        const today = dayjs().startOf('day');
        slip.date = today;
      }

      this.updateForm(slip);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const slip = this.createFromForm();
    if (slip.id !== undefined) {
      this.subscribeToSaveResponse(this.slipService.update(slip));
    } else {
      this.subscribeToSaveResponse(this.slipService.create(slip));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISlip>>): void {
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

  protected updateForm(slip: ISlip): void {
    this.editForm.patchValue({
      id: slip.id,
      date: slip.date ? slip.date.format(DATE_TIME_FORMAT) : null,
      tbgr: slip.tbgr,
      grade: slip.grade,
      lotno: slip.lotno,
      weight: slip.weight,
      price: slip.price,
    });
  }

  protected createFromForm(): ISlip {
    return {
      ...new Slip(),
      id: this.editForm.get(['id'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      tbgr: this.editForm.get(['tbgr'])!.value,
      grade: this.editForm.get(['grade'])!.value,
      lotno: this.editForm.get(['lotno'])!.value,
      weight: this.editForm.get(['weight'])!.value,
      price: this.editForm.get(['price'])!.value,
    };
  }
}
