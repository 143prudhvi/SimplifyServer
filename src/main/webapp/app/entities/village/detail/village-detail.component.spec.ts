import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VillageDetailComponent } from './village-detail.component';

describe('Component Tests', () => {
  describe('Village Management Detail Component', () => {
    let comp: VillageDetailComponent;
    let fixture: ComponentFixture<VillageDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [VillageDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ village: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(VillageDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(VillageDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load village on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.village).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
