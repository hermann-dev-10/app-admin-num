import { Injectable } from '@angular/core';
//import { User } from "../model/user";
import firebase from 'firebase/compat/app';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  //users!: Observable<User[]>;
  users!: Observable<any[]>;
  collectionName = 'table-users';
  result: any;
  registerForm!: FormGroup;
  //private userCollection: AngularFirestoreCollection<User>;
  private userCollection: AngularFirestoreCollection<any>;

  constructor(private afs: AngularFirestore, private router: Router, private afAuth: AngularFireAuth) { 
    //this.userCollection = afs.collection<User>(
    this.userCollection = afs.collection<any>(
      this.collectionName
    );
    this.users = this.userCollection.valueChanges();
  }

  createUserBis (user :any ) { //créer l'utilisateur dans une collection

    // we chose a create a specific id (the id will NOT be generated by Firestore)
    // then we create a document matching this id
    return this.userCollection.doc(`user-${user.uid}`).set({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      createdAt: new Date(),
    });
  }

  createUser (user : { uid: any; /*firstname: any;*/ displayName: any; email: any; /*role: number;*/  createdAt: Date;  /*tel: any;*/ isAdmin: Boolean }) { //créer l'utilisateur dans une collection
    
    const  newUser = {
  
      uid: user.uid, //user.uid, //Je prends ici l'id de l'utilisateur
      //firstname: user.firstname,
      displayName: user.displayName,
      email: user.email,
     
      //role: 0, //on assigne par défaut à 0 un utilisateur qui n'est pas admin
      createdAt: new Date(),
      isAdmin: 0,
      //tel: user.tel,
      //photoURL: string;
      //createdAt: Date;
    }
    const usersCollection = this.afs.collection(`${this.collectionName}`);
    console.log('usersCollection : ', usersCollection);

    //console.log('firebase.auth().currentUser?.uid;', firebase.auth().currentUser?.uid);
    /*this.afAuth.currentUser.then(data  => {
      console.log(data);
      console.log(data.uid);
    )}*/

    //console.log('currentUser : ', this.afAuth.currentUser);

    console.log('New user : ', newUser);

    //const usersCollection = this.afs.collection<IUser>(`${this.collectionName}`);
   
    return usersCollection.add(newUser);
  }

  getUsers() {
    return this.afs.collection(`${this.collectionName}`).valueChanges({ idField: 'id'});
  }

  //getUsers(): Observable<User[]> 
  /*getUsers() {
    return this.afs.collection<any>(`${this.collectionName}`, (ref) =>
      ref.orderBy('createdAt', 'asc')
    );
  }*/

  readAllCompany() {
    return this.afs.collection<any>(`${this.collectionName}`, (ref) =>
      ref.orderBy('createdAt', 'asc')
      
    );
  }



  getUser(id: any) {
    return this.afs.doc(`${this.collectionName}/${id}`).valueChanges();
  }

  //readUser(): Observable<User[]> {
  readUser(): Observable<any[]> {
    return this.users;
  }

  readUserWithUid(uid:string){
    return this.afs
      .collection(`${this.collectionName}`, (ref) => ref.where('uid', '==', uid))
      .valueChanges({ idField: 'id'});
  }
}
