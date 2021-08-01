jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SlipService } from '../service/slip.service';
import { ISlip, Slip } from '../slip.model';

import { SlipUpdateComponent } from './slip-update.component';

describe('Component Tests', () => {
  describe('Slip Management Update Component', () => {
    let comp: SlipUpdateComponent;
    let fixture: ComponentFixture<SlipUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let slipService: SlipService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SlipUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(SlipUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SlipUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      slipService = TestBed.inject(SlipService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const slip: ISlip = { id: 456 };

        activatedRoute.data = of({ slip });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(slip));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Slip>>();
        const slip = { id: 123 };
        jest.spyOn(slipService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ slip });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: slip }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(slipService.update).toHaveBeenCalledWith(slip);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Slip>>();
        const slip = new Slip();
        jest.spyOn(slipService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ slip });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: slip }));
        saveSubject.complete();

        // THEN
        expect(slipService.create).toHaveBeenCalledWith(slip);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Slip>>();
        const slip = { id: 123 };
        jest.spyOn(slipService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ slip });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(slipService.update).toHaveBeenCalledWith(slip);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
