import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TbgrDetailComponent } from './tbgr-detail.component';

describe('Component Tests', () => {
  describe('Tbgr Management Detail Component', () => {
    let comp: TbgrDetailComponent;
    let fixture: ComponentFixture<TbgrDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TbgrDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ tbgr: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(TbgrDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TbgrDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load tbgr on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.tbgr).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
