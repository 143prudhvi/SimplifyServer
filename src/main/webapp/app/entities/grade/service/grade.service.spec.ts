import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IGrade, Grade } from '../grade.model';

import { GradeService } from './grade.service';

describe('Service Tests', () => {
  describe('Grade Service', () => {
    let service: GradeService;
    let httpMock: HttpTestingController;
    let elemDefault: IGrade;
    let expectedResult: IGrade | IGrade[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(GradeService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        grade: 'AAAAAAA',
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

      it('should create a Grade', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Grade()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Grade', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            grade: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Grade', () => {
        const patchObject = Object.assign(
          {
            grade: 'BBBBBB',
          },
          new Grade()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Grade', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            grade: 'BBBBBB',
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

      it('should delete a Grade', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addGradeToCollectionIfMissing', () => {
        it('should add a Grade to an empty array', () => {
          const grade: IGrade = { id: 123 };
          expectedResult = service.addGradeToCollectionIfMissing([], grade);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(grade);
        });

        it('should not add a Grade to an array that contains it', () => {
          const grade: IGrade = { id: 123 };
          const gradeCollection: IGrade[] = [
            {
              ...grade,
            },
            { id: 456 },
          ];
          expectedResult = service.addGradeToCollectionIfMissing(gradeCollection, grade);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Grade to an array that doesn't contain it", () => {
          const grade: IGrade = { id: 123 };
          const gradeCollection: IGrade[] = [{ id: 456 }];
          expectedResult = service.addGradeToCollectionIfMissing(gradeCollection, grade);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(grade);
        });

        it('should add only unique Grade to an array', () => {
          const gradeArray: IGrade[] = [{ id: 123 }, { id: 456 }, { id: 71393 }];
          const gradeCollection: IGrade[] = [{ id: 123 }];
          expectedResult = service.addGradeToCollectionIfMissing(gradeCollection, ...gradeArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const grade: IGrade = { id: 123 };
          const grade2: IGrade = { id: 456 };
          expectedResult = service.addGradeToCollectionIfMissing([], grade, grade2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(grade);
          expect(expectedResult).toContain(grade2);
        });

        it('should accept null and undefined values', () => {
          const grade: IGrade = { id: 123 };
          expectedResult = service.addGradeToCollectionIfMissing([], null, grade, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(grade);
        });

        it('should return initial array if no Grade is added', () => {
          const gradeCollection: IGrade[] = [{ id: 123 }];
          expectedResult = service.addGradeToCollectionIfMissing(gradeCollection, undefined, null);
          expect(expectedResult).toEqual(gradeCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
