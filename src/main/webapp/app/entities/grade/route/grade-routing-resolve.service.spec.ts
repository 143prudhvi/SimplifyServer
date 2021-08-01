jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IGrade, Grade } from '../grade.model';
import { GradeService } from '../service/grade.service';

import { GradeRoutingResolveService } from './grade-routing-resolve.service';

describe('Service Tests', () => {
  describe('Grade routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: GradeRoutingResolveService;
    let service: GradeService;
    let resultGrade: IGrade | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(GradeRoutingResolveService);
      service = TestBed.inject(GradeService);
      resultGrade = undefined;
    });

    describe('resolve', () => {
      it('should return IGrade returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultGrade = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultGrade).toEqual({ id: 123 });
      });

      it('should return new IGrade if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultGrade = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultGrade).toEqual(new Grade());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Grade })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultGrade = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultGrade).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
