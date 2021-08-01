import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITbgr, Tbgr } from '../tbgr.model';
import { TbgrService } from '../service/tbgr.service';

@Injectable({ providedIn: 'root' })
export class TbgrRoutingResolveService implements Resolve<ITbgr> {
  constructor(protected service: TbgrService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITbgr> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((tbgr: HttpResponse<Tbgr>) => {
          if (tbgr.body) {
            return of(tbgr.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Tbgr());
  }
}
