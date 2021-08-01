import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SlipService } from '../service/slip.service';

import { SlipComponent } from './slip.component';

describe('Component Tests', () => {
  describe('Slip Management Component', () => {
    let comp: SlipComponent;
    let fixture: ComponentFixture<SlipComponent>;
    let service: SlipService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SlipComponent],
      })
        .overrideTemplate(SlipComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SlipComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(SlipService);

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
      expect(comp.slips?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
