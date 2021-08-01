import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TbgrComponent } from '../list/tbgr.component';
import { TbgrDetailComponent } from '../detail/tbgr-detail.component';
import { TbgrUpdateComponent } from '../update/tbgr-update.component';
import { TbgrRoutingResolveService } from './tbgr-routing-resolve.service';

const tbgrRoute: Routes = [
  {
    path: '',
    component: TbgrComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TbgrDetailComponent,
    resolve: {
      tbgr: TbgrRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TbgrUpdateComponent,
    resolve: {
      tbgr: TbgrRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TbgrUpdateComponent,
    resolve: {
      tbgr: TbgrRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(tbgrRoute)],
  exports: [RouterModule],
})
export class TbgrRoutingModule {}
