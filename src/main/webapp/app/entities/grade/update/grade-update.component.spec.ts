jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { GradeService } from '../service/grade.service';
import { IGrade, Grade } from '../grade.model';

import { GradeUpdateComponent } from './grade-update.component';

describe('Component Tests', () => {
  describe('Grade Management Update Component', () => {
    let comp: GradeUpdateComponent;
    let fixture: ComponentFixture<GradeUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let gradeService: GradeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [GradeUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(GradeUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(GradeUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      gradeService = TestBed.inject(GradeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const grade: IGrade = { id: 456 };

        activatedRoute.data = of({ grade });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(grade));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Grade>>();
        const grade = { id: 123 };
        jest.spyOn(gradeService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ grade });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: grade }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(gradeService.update).toHaveBeenCalledWith(grade);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Grade>>();
        const grade = new Grade();
        jest.spyOn(gradeService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ grade });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: grade }));
        saveSubject.complete();

        // THEN
        expect(gradeService.create).toHaveBeenCalledWith(grade);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Grade>>();
        const grade = { id: 123 };
        jest.spyOn(gradeService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ grade });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(gradeService.update).toHaveBeenCalledWith(grade);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
