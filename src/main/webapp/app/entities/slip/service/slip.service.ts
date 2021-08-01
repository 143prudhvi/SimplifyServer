import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISlip, getSlipIdentifier } from '../slip.model';

export type EntityResponseType = HttpResponse<ISlip>;
export type EntityArrayResponseType = HttpResponse<ISlip[]>;

@Injectable({ providedIn: 'root' })
export class SlipService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/slips');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(slip: ISlip): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(slip);
    return this.http
      .post<ISlip>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(slip: ISlip): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(slip);
    return this.http
      .put<ISlip>(`${this.resourceUrl}/${getSlipIdentifier(slip) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(slip: ISlip): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(slip);
    return this.http
      .patch<ISlip>(`${this.resourceUrl}/${getSlipIdentifier(slip) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ISlip>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ISlip[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSlipToCollectionIfMissing(slipCollection: ISlip[], ...slipsToCheck: (ISlip | null | undefined)[]): ISlip[] {
    const slips: ISlip[] = slipsToCheck.filter(isPresent);
    if (slips.length > 0) {
      const slipCollectionIdentifiers = slipCollection.map(slipItem => getSlipIdentifier(slipItem)!);
      const slipsToAdd = slips.filter(slipItem => {
        const slipIdentifier = getSlipIdentifier(slipItem);
        if (slipIdentifier == null || slipCollectionIdentifiers.includes(slipIdentifier)) {
          return false;
        }
        slipCollectionIdentifiers.push(slipIdentifier);
        return true;
      });
      return [...slipsToAdd, ...slipCollection];
    }
    return slipCollection;
  }

  protected convertDateFromClient(slip: ISlip): ISlip {
    return Object.assign({}, slip, {
      date: slip.date?.isValid() ? slip.date.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((slip: ISlip) => {
        slip.date = slip.date ? dayjs(slip.date) : undefined;
      });
    }
    return res;
  }
}
