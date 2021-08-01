import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISlip, Slip } from '../slip.model';

import { SlipService } from './slip.service';

describe('Service Tests', () => {
  describe('Slip Service', () => {
    let service: SlipService;
    let httpMock: HttpTestingController;
    let elemDefault: ISlip;
    let expectedResult: ISlip | ISlip[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(SlipService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        date: currentDate,
        tbgr: 0,
        grade: 'AAAAAAA',
        lotno: 0,
        weight: 0,
        price: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            date: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Slip', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            date: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.create(new Slip()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Slip', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            date: currentDate.format(DATE_TIME_FORMAT),
            tbgr: 1,
            grade: 'BBBBBB',
            lotno: 1,
            weight: 1,
            price: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Slip', () => {
        const patchObject = Object.assign(
          {
            tbgr: 1,
            weight: 1,
            price: 1,
          },
          new Slip()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Slip', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            date: currentDate.format(DATE_TIME_FORMAT),
            tbgr: 1,
            grade: 'BBBBBB',
            lotno: 1,
            weight: 1,
            price: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Slip', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addSlipToCollectionIfMissing', () => {
        it('should add a Slip to an empty array', () => {
          const slip: ISlip = { id: 123 };
          expectedResult = service.addSlipToCollectionIfMissing([], slip);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(slip);
        });

        it('should not add a Slip to an array that contains it', () => {
          const slip: ISlip = { id: 123 };
          const slipCollection: ISlip[] = [
            {
              ...slip,
            },
            { id: 456 },
          ];
          expectedResult = service.addSlipToCollectionIfMissing(slipCollection, slip);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Slip to an array that doesn't contain it", () => {
          const slip: ISlip = { id: 123 };
          const slipCollection: ISlip[] = [{ id: 456 }];
          expectedResult = service.addSlipToCollectionIfMissing(slipCollection, slip);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(slip);
        });

        it('should add only unique Slip to an array', () => {
          const slipArray: ISlip[] = [{ id: 123 }, { id: 456 }, { id: 10812 }];
          const slipCollection: ISlip[] = [{ id: 123 }];
          expectedResult = service.addSlipToCollectionIfMissing(slipCollection, ...slipArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const slip: ISlip = { id: 123 };
          const slip2: ISlip = { id: 456 };
          expectedResult = service.addSlipToCollectionIfMissing([], slip, slip2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(slip);
          expect(expectedResult).toContain(slip2);
        });

        it('should accept null and undefined values', () => {
          const slip: ISlip = { id: 123 };
          expectedResult = service.addSlipToCollectionIfMissing([], null, slip, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(slip);
        });

        it('should return initial array if no Slip is added', () => {
          const slipCollection: ISlip[] = [{ id: 123 }];
          expectedResult = service.addSlipToCollectionIfMissing(slipCollection, undefined, null);
          expect(expectedResult).toEqual(slipCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
