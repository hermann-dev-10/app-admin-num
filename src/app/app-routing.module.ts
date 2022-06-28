import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { BillingComponent } from './components/billing/billing.component';
import { ContactComponent } from './components/contact/contact.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FolderComponent } from './components/folder/folder.component';
import { HomeComponent } from './components/home/home.component';
import { SingleFolderComponent } from './components/folder/single-folder/single-folder.component';
import { StatsComponent } from './components/stats/stats.component';
import { LoginComponent } from './components/login/login/login.component';

const routes: Routes = [
  //{ path: '', redirectTo: 'dashboard', pathMatch: 'full'}, //Adding a default route
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'folder', component: FolderComponent },
  { path: 'folder-single/:id', component: SingleFolderComponent },
  { path: 'stats', component: StatsComponent },
  { path: 'billing', component: BillingComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: '**', component: HomeComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
