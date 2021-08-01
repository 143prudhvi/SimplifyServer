jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IVillage, Village } from '../village.model';
import { VillageService } from '../service/village.service';

import { VillageRoutingResolveService } from './village-routing-resolve.service';

describe('Service Tests', () => {
  describe('Village routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: VillageRoutingResolveService;
    let service: VillageService;
    let resultVillage: IVillage | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(VillageRoutingResolveService);
      service = TestBed.inject(VillageService);
      resultVillage = undefined;
    });

    describe('resolve', () => {
      it('should return IVillage returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultVillage = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultVillage).toEqual({ id: 123 });
      });

      it('should return new IVillage if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultVillage = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultVillage).toEqual(new Village());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Village })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultVillage = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultVillage).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
