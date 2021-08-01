import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { VillageService } from '../service/village.service';

import { VillageComponent } from './village.component';

describe('Component Tests', () => {
  describe('Village Management Component', () => {
    let comp: VillageComponent;
    let fixture: ComponentFixture<VillageComponent>;
    let service: VillageService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [VillageComponent],
      })
        .overrideTemplate(VillageComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(VillageComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(VillageService);

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
      expect(comp.villages?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
