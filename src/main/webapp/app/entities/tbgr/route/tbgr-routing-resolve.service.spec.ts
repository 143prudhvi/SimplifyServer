jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ITbgr, Tbgr } from '../tbgr.model';
import { TbgrService } from '../service/tbgr.service';

import { TbgrRoutingResolveService } from './tbgr-routing-resolve.service';

describe('Service Tests', () => {
  describe('Tbgr routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: TbgrRoutingResolveService;
    let service: TbgrService;
    let resultTbgr: ITbgr | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(TbgrRoutingResolveService);
      service = TestBed.inject(TbgrService);
      resultTbgr = undefined;
    });

    describe('resolve', () => {
      it('should return ITbgr returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTbgr = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTbgr).toEqual({ id: 123 });
      });

      it('should return new ITbgr if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTbgr = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultTbgr).toEqual(new Tbgr());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Tbgr })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTbgr = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultTbgr).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
