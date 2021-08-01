import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'slip',
        data: { pageTitle: 'Slips' },
        loadChildren: () => import('./slip/slip.module').then(m => m.SlipModule),
      },
      {
        path: 'tbgr',
        data: { pageTitle: 'Tbgrs' },
        loadChildren: () => import('./tbgr/tbgr.module').then(m => m.TbgrModule),
      },
      {
        path: 'board',
        data: { pageTitle: 'Boards' },
        loadChildren: () => import('./board/board.module').then(m => m.BoardModule),
      },
      {
        path: 'contact',
        data: { pageTitle: 'Contacts' },
        loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule),
      },
      {
        path: 'grade',
        data: { pageTitle: 'Grades' },
        loadChildren: () => import('./grade/grade.module').then(m => m.GradeModule),
      },
      {
        path: 'village',
        data: { pageTitle: 'Villages' },
        loadChildren: () => import('./village/village.module').then(m => m.VillageModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
