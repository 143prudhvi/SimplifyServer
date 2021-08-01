import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITbgr, getTbgrIdentifier } from '../tbgr.model';

export type EntityResponseType = HttpResponse<ITbgr>;
export type EntityArrayResponseType = HttpResponse<ITbgr[]>;

@Injectable({ providedIn: 'root' })
export class TbgrService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/tbgrs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(tbgr: ITbgr): Observable<EntityResponseType> {
    return this.http.post<ITbgr>(this.resourceUrl, tbgr, { observe: 'response' });
  }

  update(tbgr: ITbgr): Observable<EntityResponseType> {
    return this.http.put<ITbgr>(`${this.resourceUrl}/${getTbgrIdentifier(tbgr) as number}`, tbgr, { observe: 'response' });
  }

  partialUpdate(tbgr: ITbgr): Observable<EntityResponseType> {
    return this.http.patch<ITbgr>(`${this.resourceUrl}/${getTbgrIdentifier(tbgr) as number}`, tbgr, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ITbgr>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITbgr[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTbgrToCollectionIfMissing(tbgrCollection: ITbgr[], ...tbgrsToCheck: (ITbgr | null | undefined)[]): ITbgr[] {
    const tbgrs: ITbgr[] = tbgrsToCheck.filter(isPresent);
    if (tbgrs.length > 0) {
      const tbgrCollectionIdentifiers = tbgrCollection.map(tbgrItem => getTbgrIdentifier(tbgrItem)!);
      const tbgrsToAdd = tbgrs.filter(tbgrItem => {
        const tbgrIdentifier = getTbgrIdentifier(tbgrItem);
        if (tbgrIdentifier == null || tbgrCollectionIdentifiers.includes(tbgrIdentifier)) {
          return false;
        }
        tbgrCollectionIdentifiers.push(tbgrIdentifier);
        return true;
      });
      return [...tbgrsToAdd, ...tbgrCollection];
    }
    return tbgrCollection;
  }
}
