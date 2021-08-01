jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { VillageService } from '../service/village.service';
import { IVillage, Village } from '../village.model';

import { VillageUpdateComponent } from './village-update.component';

describe('Component Tests', () => {
  describe('Village Management Update Component', () => {
    let comp: VillageUpdateComponent;
    let fixture: ComponentFixture<VillageUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let villageService: VillageService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [VillageUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(VillageUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(VillageUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      villageService = TestBed.inject(VillageService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const village: IVillage = { id: 456 };

        activatedRoute.data = of({ village });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(village));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Village>>();
        const village = { id: 123 };
        jest.spyOn(villageService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ village });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: village }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(villageService.update).toHaveBeenCalledWith(village);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Village>>();
        const village = new Village();
        jest.spyOn(villageService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ village });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: village }));
        saveSubject.complete();

        // THEN
        expect(villageService.create).toHaveBeenCalledWith(village);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Village>>();
        const village = { id: 123 };
        jest.spyOn(villageService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ village });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(villageService.update).toHaveBeenCalledWith(village);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
