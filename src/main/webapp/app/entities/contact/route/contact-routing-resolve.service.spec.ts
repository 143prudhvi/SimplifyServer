jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IContact, Contact } from '../contact.model';
import { ContactService } from '../service/contact.service';

import { ContactRoutingResolveService } from './contact-routing-resolve.service';

describe('Service Tests', () => {
  describe('Contact routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ContactRoutingResolveService;
    let service: ContactService;
    let resultContact: IContact | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ContactRoutingResolveService);
      service = TestBed.inject(ContactService);
      resultContact = undefined;
    });

    describe('resolve', () => {
      it('should return IContact returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultContact = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultContact).toEqual({ id: 123 });
      });

      it('should return new IContact if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultContact = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultContact).toEqual(new Contact());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Contact })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultContact = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultContact).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
