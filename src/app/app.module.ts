import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import * as fr from '@angular/common/locales/fr';
// Firebase
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import {
  AngularFireAuthGuard,
  hasCustomClaim,
} from '@angular/fire/compat/auth-guard';
import { environment } from '../environments/environment.prod';
//Angular Material
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';

//import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCheckboxModule } from '@angular/material/checkbox';
//Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { AdminFolderComponent } from './components/admin-folder/admin-folder.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { FolderComponent } from './components/folder/folder.component';
import { SingleFolderComponent } from './components/folder/single-folder/single-folder.component';
import { StatsComponent } from './components/stats/stats.component';
import { NgChartsModule } from 'ng2-charts';
import { LoginComponent } from './components/login/login/login.component';
import { UserComponent } from './components/user/user.component';
import { ModalUserComponent } from './components/modal-user/modal-user.component';
import { ProfilComponent } from './components/profil/profil.component';
import { MessagesComponent } from './components/messages/messages.component';
import { TestFormArrayComponent } from './components/test-form-array/test-form-array.component';
import { AdminDialogComponent } from './components/admin-folder/admin-dialog/admin-dialog.component';
import { NewEntryComponent } from './components/new-entry/new-entry.component';
import { SocialComponent } from './components/social/social.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DialogSocialComponent } from './components/social/dialog-social/dialog-social.component';
import { SingleSocialComponent } from './components/social/single-social/single-social.component';
import { AlertDialogComponent } from './components/dialog/alert-dialog/alert-dialog.component';
import { InvoiceCreationComponent } from './components/invoice/invoice-creation/invoice-creation.component';
import { InvoiceDetailComponent } from './components/invoice/invoice-detail/invoice-detail.component';
import { InvoiceEditionComponent } from './components/invoice/invoice-edition/invoice-edition.component';
import { InvoiceFormComponent } from './components/invoice/invoice-form/invoice-form.component';
import { InvoicesListComponent } from './components/invoice/invoice-list/invoices-list.component';
import { InvoiceFormGeneralComponent } from './components/invoice/invoice-form/invoice-form-general.components';
import { InvoiceFormDetailsComponent } from './components/invoice/invoice-form/invoice-form-details.component';
import { InvoiceService } from './shared/services/invoice.service';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AdminFolderComponent,
    SidenavComponent,
    DialogComponent,
    AboutComponent,
    ContactComponent,
    FolderComponent,
    SingleFolderComponent,
    StatsComponent,
    LoginComponent,
    UserComponent,
    ModalUserComponent,
    ProfilComponent,
    MessagesComponent,
    TestFormArrayComponent,
    AdminDialogComponent,
    NewEntryComponent,
    SocialComponent,
    DashboardComponent,
    DialogSocialComponent,
    SingleSocialComponent,
    AlertDialogComponent,
    InvoiceCreationComponent,
    InvoiceDetailComponent,
    InvoiceEditionComponent,
    InvoiceFormComponent,
    InvoicesListComponent,
    InvoiceFormGeneralComponent,
    InvoiceFormDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,

    // * MATERIAL IMPORTS
    MatSidenavModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatGridListModule,
    MatCheckboxModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgChartsModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'fr-FR' }, InvoiceService],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor() {
    registerLocaleData(fr.default);
  }
}
