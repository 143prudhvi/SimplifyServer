import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVillage, getVillageIdentifier } from '../village.model';

export type EntityResponseType = HttpResponse<IVillage>;
export type EntityArrayResponseType = HttpResponse<IVillage[]>;

@Injectable({ providedIn: 'root' })
export class VillageService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/villages');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(village: IVillage): Observable<EntityResponseType> {
    return this.http.post<IVillage>(this.resourceUrl, village, { observe: 'response' });
  }

  update(village: IVillage): Observable<EntityResponseType> {
    return this.http.put<IVillage>(`${this.resourceUrl}/${getVillageIdentifier(village) as number}`, village, { observe: 'response' });
  }

  partialUpdate(village: IVillage): Observable<EntityResponseType> {
    return this.http.patch<IVillage>(`${this.resourceUrl}/${getVillageIdentifier(village) as number}`, village, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IVillage>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVillage[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addVillageToCollectionIfMissing(villageCollection: IVillage[], ...villagesToCheck: (IVillage | null | undefined)[]): IVillage[] {
    const villages: IVillage[] = villagesToCheck.filter(isPresent);
    if (villages.length > 0) {
      const villageCollectionIdentifiers = villageCollection.map(villageItem => getVillageIdentifier(villageItem)!);
      const villagesToAdd = villages.filter(villageItem => {
        const villageIdentifier = getVillageIdentifier(villageItem);
        if (villageIdentifier == null || villageCollectionIdentifiers.includes(villageIdentifier)) {
          return false;
        }
        villageCollectionIdentifiers.push(villageIdentifier);
        return true;
      });
      return [...villagesToAdd, ...villageCollection];
    }
    return villageCollection;
  }
}
