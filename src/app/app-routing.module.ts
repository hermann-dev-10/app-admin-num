import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvoiceFormComponent } from './components/invoice/invoice-form/invoice-form.component';
import { ContactComponent } from './components/contact/contact.component';
import { AdminFolderComponent } from './components/admin-folder/admin-folder.component';
import { FolderComponent } from './components/folder/folder.component';
import { SingleFolderComponent } from './components/folder/single-folder/single-folder.component';
import { StatsComponent } from './components/stats/stats.component';
import { LoginComponent } from './components/login/login/login.component';
import { UserComponent } from './components/user/user.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { ProfilComponent } from './components/profil/profil.component';
import { TestFormArrayComponent } from './components/test-form-array/test-form-array.component';
import { SocialComponent } from './components/social/social.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SingleSocialComponent } from './components/social/single-social/single-social.component';
import { InvoicesListComponent } from './components/invoice/invoice-list/invoices-list.component';
import { InvoiceCreationComponent } from './components/invoice/invoice-creation/invoice-creation.component';
import { InvoiceDetailComponent } from './components/invoice/invoice-detail/invoice-detail.component';
import { InvoiceEditionComponent } from './components/invoice/invoice-edition/invoice-edition.component';
import { ClasseursListComponent } from './components/classeur/classeurs-list/classeurs-list.component';
import { ClasseurCreationComponent } from './components/classeur/classeur-creation/classeur-creation.component';
import { ClasseurDetailComponent } from './components/classeur/classeur-detail/classeur-detail.component';
import { ClasseurEditionComponent } from './components/classeur/classeur-edition/invoice-edition.component';
import { LeaveRequestComponent } from './components/leave-request/leave-request.component';
import { RequestListComponent } from './components/leave-request/request-list/request-list.component';
import { RequestCreationComponent } from './components/leave-request/request-creation/request-creation.component';
import { RequestDetailComponent } from './components/leave-request/request-detail/request-detail.component';
import { RequestEditionComponent } from './components/leave-request/request-edition/request-edition.component';
import { DemandeCongeComponent } from './components/demande-conge/demande-conge.component';
import { DemandeCongeSingleComponent } from './components/demande-conge/demande-conge-single/demande-conge-single.component';
import { DemandeCongeCreationComponent } from './components/demande-conge/demande-conge-creation/demande-conge-creation.component';
import { EditDemandeCongeComponent } from './components/demande-conge/edit-demande-conge/edit-demande-conge.component';
import { InvoiceTestComponent } from './components/invoice/invoice-test/invoice-test.component';

const routes: Routes = [
  //{ path: '', redirectTo: 'dashboard', pathMatch: 'full'}, //Adding a default route
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'admin-folder',
    component: AdminFolderComponent,
    canActivate: [AuthGuard],
  },
  { path: 'social', component: SocialComponent, canActivate: [AuthGuard] },
  {
    path: 'social-single',
    component: SingleSocialComponent,
    canActivate: [AuthGuard],
  },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'folder', component: FolderComponent, canActivate: [AuthGuard] },
  {
    path: 'folder-single/:id',
    component: SingleFolderComponent,
    canActivate: [AuthGuard],
  },
  { path: 'profil', component: ProfilComponent, canActivate: [AuthGuard] },
  { path: 'stats', component: StatsComponent, canActivate: [AuthGuard] },
  {
    path: 'invoices',
    component: InvoicesListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'invoices/create',
    component: InvoiceCreationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'invoices/detail/:id',
    component: InvoiceDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'invoices/:id',
    component: InvoiceEditionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'invoices-test/:id',
    component: InvoiceTestComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'classeurs',
    component: ClasseursListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'classeurs/create',
    component: ClasseurCreationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'classeurs/detail/:id',
    component: ClasseurDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'classeurs/:id',
    component: ClasseurEditionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'mesures',
    component: DemandeCongeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'mesure/create',
    component: DemandeCongeCreationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'mesure/:id',
    component: DemandeCongeSingleComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'mesure-edit/:id',
    component: EditDemandeCongeComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'leave-requests',
    component: RequestListComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'leave-requests/create',
    component: RequestCreationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'leave-requests/detail/:id',
    component: ClasseurDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'leave-requests/:id',
    component: RequestEditionComponent,
    canActivate: [AuthGuard],
  },

  { path: 'contact', component: ContactComponent, canActivate: [AuthGuard] },
  { path: '**', component: DashboardComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
