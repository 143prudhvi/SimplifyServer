jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ISlip, Slip } from '../slip.model';
import { SlipService } from '../service/slip.service';

import { SlipRoutingResolveService } from './slip-routing-resolve.service';

describe('Service Tests', () => {
  describe('Slip routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: SlipRoutingResolveService;
    let service: SlipService;
    let resultSlip: ISlip | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(SlipRoutingResolveService);
      service = TestBed.inject(SlipService);
      resultSlip = undefined;
    });

    describe('resolve', () => {
      it('should return ISlip returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSlip = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultSlip).toEqual({ id: 123 });
      });

      it('should return new ISlip if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSlip = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultSlip).toEqual(new Slip());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Slip })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSlip = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultSlip).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
