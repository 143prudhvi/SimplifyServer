import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IContact, getContactIdentifier } from '../contact.model';

export type EntityResponseType = HttpResponse<IContact>;
export type EntityArrayResponseType = HttpResponse<IContact[]>;

@Injectable({ providedIn: 'root' })
export class ContactService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/contacts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(contact: IContact): Observable<EntityResponseType> {
    return this.http.post<IContact>(this.resourceUrl, contact, { observe: 'response' });
  }

  update(contact: IContact): Observable<EntityResponseType> {
    return this.http.put<IContact>(`${this.resourceUrl}/${getContactIdentifier(contact) as number}`, contact, { observe: 'response' });
  }

  partialUpdate(contact: IContact): Observable<EntityResponseType> {
    return this.http.patch<IContact>(`${this.resourceUrl}/${getContactIdentifier(contact) as number}`, contact, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IContact>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IContact[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addContactToCollectionIfMissing(contactCollection: IContact[], ...contactsToCheck: (IContact | null | undefined)[]): IContact[] {
    const contacts: IContact[] = contactsToCheck.filter(isPresent);
    if (contacts.length > 0) {
      const contactCollectionIdentifiers = contactCollection.map(contactItem => getContactIdentifier(contactItem)!);
      const contactsToAdd = contacts.filter(contactItem => {
        const contactIdentifier = getContactIdentifier(contactItem);
        if (contactIdentifier == null || contactCollectionIdentifiers.includes(contactIdentifier)) {
          return false;
        }
        contactCollectionIdentifiers.push(contactIdentifier);
        return true;
      });
      return [...contactsToAdd, ...contactCollection];
    }
    return contactCollection;
  }
}
