import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISlip, Slip } from '../slip.model';
import { SlipService } from '../service/slip.service';

@Injectable({ providedIn: 'root' })
export class SlipRoutingResolveService implements Resolve<ISlip> {
  constructor(protected service: SlipService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISlip> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((slip: HttpResponse<Slip>) => {
          if (slip.body) {
            return of(slip.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Slip());
  }
}
