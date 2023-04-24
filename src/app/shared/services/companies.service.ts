import { Injectable } from '@angular/core';
//import { Company } from "../model/user";
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {

  //companies!: Observable<User[]>;
  companies!: Observable<any[]>;
  collectionName = 'table-companies';
  result: any;
  private companyCollection: AngularFirestoreCollection<any>;


  constructor(private afs: AngularFirestore, private router: Router, private afAuth: AngularFireAuth) {
    //this.companyCollection = afs.collection<User>(
    this.companyCollection = afs.collection<any>(
      this.collectionName
    );
    this.companies = this.companyCollection.valueChanges();
  }


  readCompanyWithUid(uid: string) {
    return this.afs
      .collection(`${this.collectionName}`, (ref) => ref.where('uid', '==', uid))
      .valueChanges({ idField: 'id' });
  }

  readAllCompany() {
    return this.afs.collection<any>(`${this.collectionName}`);
    /*return this.afs.collection<any>(`${this.collectionName}`, (ref) =>
      ref.orderBy('name', 'desc')
    );*/
  }

  /*
  readAllCompany() {
    return this.afs.collection<any>(`${this.collectionName}`, (ref) =>
      ref.orderBy('name', 'desc')
    );
  }
  */
}
