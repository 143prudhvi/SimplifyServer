import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGrade, Grade } from '../grade.model';
import { GradeService } from '../service/grade.service';

@Injectable({ providedIn: 'root' })
export class GradeRoutingResolveService implements Resolve<IGrade> {
  constructor(protected service: GradeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGrade> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((grade: HttpResponse<Grade>) => {
          if (grade.body) {
            return of(grade.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Grade());
  }
}
