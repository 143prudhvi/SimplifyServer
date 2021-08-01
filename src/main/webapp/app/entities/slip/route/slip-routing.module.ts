import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SlipComponent } from '../list/slip.component';
import { SlipDetailComponent } from '../detail/slip-detail.component';
import { SlipUpdateComponent } from '../update/slip-update.component';
import { SlipRoutingResolveService } from './slip-routing-resolve.service';

const slipRoute: Routes = [
  {
    path: '',
    component: SlipComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SlipDetailComponent,
    resolve: {
      slip: SlipRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SlipUpdateComponent,
    resolve: {
      slip: SlipRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SlipUpdateComponent,
    resolve: {
      slip: SlipRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(slipRoute)],
  exports: [RouterModule],
})
export class SlipRoutingModule {}
