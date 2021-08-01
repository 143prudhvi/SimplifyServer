import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SlipDetailComponent } from './slip-detail.component';

describe('Component Tests', () => {
  describe('Slip Management Detail Component', () => {
    let comp: SlipDetailComponent;
    let fixture: ComponentFixture<SlipDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SlipDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ slip: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(SlipDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SlipDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load slip on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.slip).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
