import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { BillingComponent } from './components/billing/billing.component';
import { ContactComponent } from './components/contact/contact.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FolderComponent } from './components/folder/folder.component';
import { HomeComponent } from './components/home/home.component';
import { MonitoringSheetComponent } from './components/monitoring-sheet/monitoring-sheet.component';
import { SingleSheetComponent } from './components/monitoring-sheet/single-sheet/single-sheet.component';
import { SingleFolderComponent } from './components/folder/single-folder/single-folder.component';
import { NumeriseurComponent } from './components/numeriseur/numeriseur.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'folder', component: FolderComponent },
  { path: 'folder-single/:id', component: SingleFolderComponent },
  { path: 'monitoring-sheet', component: MonitoringSheetComponent },
  { path: 'sheet-single/:id', component: SingleSheetComponent },
  { path: 'numeriseur', component: NumeriseurComponent },
  { path: 'billing', component: BillingComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
