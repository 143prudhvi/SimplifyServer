import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VillageComponent } from '../list/village.component';
import { VillageDetailComponent } from '../detail/village-detail.component';
import { VillageUpdateComponent } from '../update/village-update.component';
import { VillageRoutingResolveService } from './village-routing-resolve.service';

const villageRoute: Routes = [
  {
    path: '',
    component: VillageComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VillageDetailComponent,
    resolve: {
      village: VillageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VillageUpdateComponent,
    resolve: {
      village: VillageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VillageUpdateComponent,
    resolve: {
      village: VillageRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(villageRoute)],
  exports: [RouterModule],
})
export class VillageRoutingModule {}
