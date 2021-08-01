import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ContactComponent } from '../list/contact.component';
import { ContactDetailComponent } from '../detail/contact-detail.component';
import { ContactUpdateComponent } from '../update/contact-update.component';
import { ContactRoutingResolveService } from './contact-routing-resolve.service';

const contactRoute: Routes = [
  {
    path: '',
    component: ContactComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ContactDetailComponent,
    resolve: {
      contact: ContactRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ContactUpdateComponent,
    resolve: {
      contact: ContactRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ContactUpdateComponent,
    resolve: {
      contact: ContactRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(contactRoute)],
  exports: [RouterModule],
})
export class ContactRoutingModule {}
