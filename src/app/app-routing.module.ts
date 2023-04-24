import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
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

const routes: Routes = [
  //{ path: '', redirectTo: 'dashboard', pathMatch: 'full'}, //Adding a default route
  { path: '', redirectTo: 'folder', pathMatch: 'full' },
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
  { path: 'invoices/create', component: InvoiceCreationComponent },
  { path: 'invoices/detail/:id', component: InvoiceDetailComponent },
  { path: 'invoices/:id', component: InvoiceEditionComponent },

  { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
  { path: 'contact', component: ContactComponent, canActivate: [AuthGuard] },
  { path: '**', component: DashboardComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
