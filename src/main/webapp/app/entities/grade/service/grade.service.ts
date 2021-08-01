import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGrade, getGradeIdentifier } from '../grade.model';

export type EntityResponseType = HttpResponse<IGrade>;
export type EntityArrayResponseType = HttpResponse<IGrade[]>;

@Injectable({ providedIn: 'root' })
export class GradeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/grades');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(grade: IGrade): Observable<EntityResponseType> {
    return this.http.post<IGrade>(this.resourceUrl, grade, { observe: 'response' });
  }

  update(grade: IGrade): Observable<EntityResponseType> {
    return this.http.put<IGrade>(`${this.resourceUrl}/${getGradeIdentifier(grade) as number}`, grade, { observe: 'response' });
  }

  partialUpdate(grade: IGrade): Observable<EntityResponseType> {
    return this.http.patch<IGrade>(`${this.resourceUrl}/${getGradeIdentifier(grade) as number}`, grade, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGrade>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGrade[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addGradeToCollectionIfMissing(gradeCollection: IGrade[], ...gradesToCheck: (IGrade | null | undefined)[]): IGrade[] {
    const grades: IGrade[] = gradesToCheck.filter(isPresent);
    if (grades.length > 0) {
      const gradeCollectionIdentifiers = gradeCollection.map(gradeItem => getGradeIdentifier(gradeItem)!);
      const gradesToAdd = grades.filter(gradeItem => {
        const gradeIdentifier = getGradeIdentifier(gradeItem);
        if (gradeIdentifier == null || gradeCollectionIdentifiers.includes(gradeIdentifier)) {
          return false;
        }
        gradeCollectionIdentifiers.push(gradeIdentifier);
        return true;
      });
      return [...gradesToAdd, ...gradeCollection];
    }
    return gradeCollection;
  }
}
