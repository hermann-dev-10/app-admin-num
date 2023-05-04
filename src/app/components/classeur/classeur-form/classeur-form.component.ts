import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Classeur } from '../classeur';
import { ClasseurFormType } from './classeur-form-type';
import { ClasseurService } from 'src/app/shared/services/classeur.service';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-classeur-form',
  template: `
    <mat-drawer-container>
      <mat-drawer mode="side" [opened]="sideBarOpen">
        <!-- <mat-drawer mode="side" opened="true"> -->
        <app-sidenav></app-sidenav>
      </mat-drawer>
      <mat-drawer-content>
        <app-header (toggleSidebarForMe)="sideBarToggler()"></app-header>
        <div class="container-fluid page">
          <div class="d-flex page__box p-3 mt-2">Classeur</div>
          <div class="page__content shadow p-3 position-relative">
            <div class="text-center">
              <form [formGroup]="classeurForm" (submit)="onSubmit()">
                <app-classeur-form-general
                  [parent]="classeurForm"
                ></app-classeur-form-general>

                <hr />

                <app-classeur-form-details
                  [parent]="classeurForm"
                  (add-detail)="onAddDetail()"
                  (remove-detail)="onRemoveDetail($event)"
                ></app-classeur-form-details>

                <hr />

                <div class="text-center">
                  <div class="d-flex">
                    <button class="w-sm-auto btn btn-primary mr-15" id="submit">
                      Enregistrer
                    </button>

                    <a class="btn btn-secondary" routerLink="/classeurs"
                      >Retour à la liste
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </mat-drawer-content>
    </mat-drawer-container>
  `,

  styleUrls: ['classeur-form.component.scss'],
})
export class ClasseurFormComponent implements OnInit {
  @Output('classeur-submit') classeurSubmitEvent = new EventEmitter<Classeur>();

  @Input() classeur?: Classeur;
  user!: any;
  users$: Observable<any>[] = []; //user$: Observable<IUser>[] = []
  sub: any;
  uniqueUser!: any;
  displayNameObs!: any;

  detailsExistsValidator: ValidatorFn = (control: AbstractControl) => {
    const details = control.get('details') as FormArray;

    return details.length > 0
      ? null
      : {
          noDetails: true,
        };
  };

  classeurForm: ClasseurFormType = this.fb.group({
    binder_name: ['', [Validators.required, Validators.minLength(3)]],
    customer_name: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(3)]],
    status: ['NOT_STARTED'],
    date_binder_creation: ['', [Validators.required]],
    directory: ['', [Validators.required, Validators.minLength(3)]],
    created_at: new Date(), //Adding the current date
    details: this.fb.array<FormGroup>([]),
    //added_by: this.user,
  });

  constructor(
    private fb: FormBuilder,
    private classeurService: ClasseurService,
    private router: Router,
    public authService: AuthService,
    private afAuth: AngularFireAuth,
    public userService: UserService
  ) {}

  ngOnInit(): void {
    this.sub = this.afAuth.authState.subscribe((user: any) => {
      this.user = user;

      if (this.user) {
        this.sub = this.userService.readUserWithUid(user.uid).subscribe(
          (data) => {
            this.user = data;
            console.log('this.user :', this.user);
          },
          (err) => {
            return console.error('readUserWithUID error', err);
          }
        );
      }
    });

    //this.addedBy(this.user);

    //console.log('this.addedBy(this.user): ', this.addedBy(this.user));

    if (!this.classeur) {
      return;
    }

    this.classeur.details.forEach((item) => this.onAddDetail());

    this.classeurForm.patchValue(this.classeur);

    console.log('details ?: ', this.details.value);

    console.log(
      'this.classeurForm.controls.details.value ?: ',
      this.classeurForm.controls.details.value
    );
  }

  get details() {
    return this.classeurForm.controls.details;
  }

  onAddDetail() {
    this.details.push(
      this.fb.group({
        file_name: ['', [Validators.required]],
        folder_name: [''],
      })
    );
  }

  onRemoveDetail(index: number) {
    this.details.removeAt(index);
  }

  onSubmit() {
    console.log('this.classeurForm.value:', this.classeurForm.value);
    if (this.classeurForm.invalid) {
      return;
    }
    this.classeurSubmitEvent.emit(this.classeurForm.value as Classeur);
  }

  sideBarOpen = true;

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  addedBy(user) {
    this.sub = this.afAuth.authState.subscribe((user: any) => {
      this.user = user;

      if (this.user) {
        this.sub = this.userService.readUserWithUid(user.uid).subscribe(
          (data) => {
            this.user = data;
            console.log('this.user :', this.user);
          },
          (err) => {
            return console.error('readUserWithUID error', err);
          }
        );
      }
    });
    return user;
  }
}
