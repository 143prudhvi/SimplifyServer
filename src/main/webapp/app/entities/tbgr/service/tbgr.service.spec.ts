import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITbgr, Tbgr } from '../tbgr.model';

import { TbgrService } from './tbgr.service';

describe('Service Tests', () => {
  describe('Tbgr Service', () => {
    let service: TbgrService;
    let httpMock: HttpTestingController;
    let elemDefault: ITbgr;
    let expectedResult: ITbgr | ITbgr[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(TbgrService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        board: 'AAAAAAA',
        village: 'AAAAAAA',
        tbgr: 0,
        name: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Tbgr', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Tbgr()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Tbgr', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            board: 'BBBBBB',
            village: 'BBBBBB',
            tbgr: 1,
            name: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Tbgr', () => {
        const patchObject = Object.assign(
          {
            board: 'BBBBBB',
            village: 'BBBBBB',
          },
          new Tbgr()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Tbgr', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            board: 'BBBBBB',
            village: 'BBBBBB',
            tbgr: 1,
            name: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Tbgr', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addTbgrToCollectionIfMissing', () => {
        it('should add a Tbgr to an empty array', () => {
          const tbgr: ITbgr = { id: 123 };
          expectedResult = service.addTbgrToCollectionIfMissing([], tbgr);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(tbgr);
        });

        it('should not add a Tbgr to an array that contains it', () => {
          const tbgr: ITbgr = { id: 123 };
          const tbgrCollection: ITbgr[] = [
            {
              ...tbgr,
            },
            { id: 456 },
          ];
          expectedResult = service.addTbgrToCollectionIfMissing(tbgrCollection, tbgr);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Tbgr to an array that doesn't contain it", () => {
          const tbgr: ITbgr = { id: 123 };
          const tbgrCollection: ITbgr[] = [{ id: 456 }];
          expectedResult = service.addTbgrToCollectionIfMissing(tbgrCollection, tbgr);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(tbgr);
        });

        it('should add only unique Tbgr to an array', () => {
          const tbgrArray: ITbgr[] = [{ id: 123 }, { id: 456 }, { id: 4214 }];
          const tbgrCollection: ITbgr[] = [{ id: 123 }];
          expectedResult = service.addTbgrToCollectionIfMissing(tbgrCollection, ...tbgrArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const tbgr: ITbgr = { id: 123 };
          const tbgr2: ITbgr = { id: 456 };
          expectedResult = service.addTbgrToCollectionIfMissing([], tbgr, tbgr2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(tbgr);
          expect(expectedResult).toContain(tbgr2);
        });

        it('should accept null and undefined values', () => {
          const tbgr: ITbgr = { id: 123 };
          expectedResult = service.addTbgrToCollectionIfMissing([], null, tbgr, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(tbgr);
        });

        it('should return initial array if no Tbgr is added', () => {
          const tbgrCollection: ITbgr[] = [{ id: 123 }];
          expectedResult = service.addTbgrToCollectionIfMissing(tbgrCollection, undefined, null);
          expect(expectedResult).toEqual(tbgrCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
