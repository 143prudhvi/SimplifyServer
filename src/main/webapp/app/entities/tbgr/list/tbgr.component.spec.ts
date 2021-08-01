import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TbgrService } from '../service/tbgr.service';

import { TbgrComponent } from './tbgr.component';

describe('Component Tests', () => {
  describe('Tbgr Management Component', () => {
    let comp: TbgrComponent;
    let fixture: ComponentFixture<TbgrComponent>;
    let service: TbgrService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TbgrComponent],
      })
        .overrideTemplate(TbgrComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TbgrComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(TbgrService);

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
      expect(comp.tbgrs?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
