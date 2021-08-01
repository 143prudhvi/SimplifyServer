import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IVillage, Village } from '../village.model';

import { VillageService } from './village.service';

describe('Service Tests', () => {
  describe('Village Service', () => {
    let service: VillageService;
    let httpMock: HttpTestingController;
    let elemDefault: IVillage;
    let expectedResult: IVillage | IVillage[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(VillageService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        board: 'AAAAAAA',
        village: 'AAAAAAA',
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

      it('should create a Village', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Village()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Village', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            board: 'BBBBBB',
            village: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Village', () => {
        const patchObject = Object.assign({}, new Village());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Village', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            board: 'BBBBBB',
            village: 'BBBBBB',
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

      it('should delete a Village', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addVillageToCollectionIfMissing', () => {
        it('should add a Village to an empty array', () => {
          const village: IVillage = { id: 123 };
          expectedResult = service.addVillageToCollectionIfMissing([], village);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(village);
        });

        it('should not add a Village to an array that contains it', () => {
          const village: IVillage = { id: 123 };
          const villageCollection: IVillage[] = [
            {
              ...village,
            },
            { id: 456 },
          ];
          expectedResult = service.addVillageToCollectionIfMissing(villageCollection, village);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Village to an array that doesn't contain it", () => {
          const village: IVillage = { id: 123 };
          const villageCollection: IVillage[] = [{ id: 456 }];
          expectedResult = service.addVillageToCollectionIfMissing(villageCollection, village);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(village);
        });

        it('should add only unique Village to an array', () => {
          const villageArray: IVillage[] = [{ id: 123 }, { id: 456 }, { id: 65947 }];
          const villageCollection: IVillage[] = [{ id: 123 }];
          expectedResult = service.addVillageToCollectionIfMissing(villageCollection, ...villageArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const village: IVillage = { id: 123 };
          const village2: IVillage = { id: 456 };
          expectedResult = service.addVillageToCollectionIfMissing([], village, village2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(village);
          expect(expectedResult).toContain(village2);
        });

        it('should accept null and undefined values', () => {
          const village: IVillage = { id: 123 };
          expectedResult = service.addVillageToCollectionIfMissing([], null, village, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(village);
        });

        it('should return initial array if no Village is added', () => {
          const villageCollection: IVillage[] = [{ id: 123 }];
          expectedResult = service.addVillageToCollectionIfMissing(villageCollection, undefined, null);
          expect(expectedResult).toEqual(villageCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
