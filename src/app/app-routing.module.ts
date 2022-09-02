import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { BillingComponent } from './components/billing/billing.component';
import { ContactComponent } from './components/contact/contact.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FolderComponent } from './components/folder/folder.component';
import { SingleFolderComponent } from './components/folder/single-folder/single-folder.component';
import { StatsComponent } from './components/stats/stats.component';
import { LoginComponent } from './components/login/login/login.component';
import { UserComponent } from './components/user/user.component';
import { AuthGuard } from './shared/guard/auth.guard';
import { ProfilComponent } from './components/profil/profil.component';
import { TestFormArrayComponent } from './components/test-form-array/test-form-array.component';

const routes: Routes = [
  //{ path: '', redirectTo: 'dashboard', pathMatch: 'full'}, //Adding a default route
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'folder', component: FolderComponent, canActivate: [AuthGuard] },
  { path: 'folder-single/:id', component: SingleFolderComponent, canActivate: [AuthGuard] },
  { path: 'test-form-array', component: TestFormArrayComponent, canActivate: [AuthGuard] },
  { path: 'profil', component: ProfilComponent, canActivate: [AuthGuard] },
  { path: 'stats', component: StatsComponent, canActivate: [AuthGuard] },
  { path: 'billing', component: BillingComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent, canActivate: [AuthGuard] },
  { path: 'contact', component: ContactComponent, canActivate: [AuthGuard] },
  { path: '**', component: DashboardComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
