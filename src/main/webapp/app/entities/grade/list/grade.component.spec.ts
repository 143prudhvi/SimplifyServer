import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { GradeService } from '../service/grade.service';

import { GradeComponent } from './grade.component';

describe('Component Tests', () => {
  describe('Grade Management Component', () => {
    let comp: GradeComponent;
    let fixture: ComponentFixture<GradeComponent>;
    let service: GradeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [GradeComponent],
      })
        .overrideTemplate(GradeComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(GradeComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(GradeService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.grades?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
