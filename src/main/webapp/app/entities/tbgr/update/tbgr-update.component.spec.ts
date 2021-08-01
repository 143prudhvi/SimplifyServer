jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TbgrService } from '../service/tbgr.service';
import { ITbgr, Tbgr } from '../tbgr.model';

import { TbgrUpdateComponent } from './tbgr-update.component';

describe('Component Tests', () => {
  describe('Tbgr Management Update Component', () => {
    let comp: TbgrUpdateComponent;
    let fixture: ComponentFixture<TbgrUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let tbgrService: TbgrService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TbgrUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(TbgrUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TbgrUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      tbgrService = TestBed.inject(TbgrService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const tbgr: ITbgr = { id: 456 };

        activatedRoute.data = of({ tbgr });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(tbgr));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Tbgr>>();
        const tbgr = { id: 123 };
        jest.spyOn(tbgrService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ tbgr });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: tbgr }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(tbgrService.update).toHaveBeenCalledWith(tbgr);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Tbgr>>();
        const tbgr = new Tbgr();
        jest.spyOn(tbgrService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ tbgr });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: tbgr }));
        saveSubject.complete();

        // THEN
        expect(tbgrService.create).toHaveBeenCalledWith(tbgr);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Tbgr>>();
        const tbgr = { id: 123 };
        jest.spyOn(tbgrService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ tbgr });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(tbgrService.update).toHaveBeenCalledWith(tbgr);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
