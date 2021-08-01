import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GradeComponent } from '../list/grade.component';
import { GradeDetailComponent } from '../detail/grade-detail.component';
import { GradeUpdateComponent } from '../update/grade-update.component';
import { GradeRoutingResolveService } from './grade-routing-resolve.service';

const gradeRoute: Routes = [
  {
    path: '',
    component: GradeComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GradeDetailComponent,
    resolve: {
      grade: GradeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GradeUpdateComponent,
    resolve: {
      grade: GradeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GradeUpdateComponent,
    resolve: {
      grade: GradeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(gradeRoute)],
  exports: [RouterModule],
})
export class GradeRoutingModule {}
