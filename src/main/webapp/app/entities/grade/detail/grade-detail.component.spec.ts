import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GradeDetailComponent } from './grade-detail.component';

describe('Component Tests', () => {
  describe('Grade Management Detail Component', () => {
    let comp: GradeDetailComponent;
    let fixture: ComponentFixture<GradeDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [GradeDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ grade: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(GradeDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(GradeDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load grade on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.grade).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
