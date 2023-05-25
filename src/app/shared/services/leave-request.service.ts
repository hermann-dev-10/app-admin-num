import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database'

import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { LeaveRequest } from './../../components/leave-request/leave-request';

@Injectable()
export class LeaveRequestService {
  API_URL = environment.API_URL;

  private personalLeaveRequestCollection!: AngularFirestoreCollection<any>;
  private leaveRequestCollection!: AngularFirestoreCollection<any>;
  allLeaveRequest!: Observable<any[]>; //personalLeaveRequest!: Observable<any[]>;
  //leaveRequests$!: Observable<any[]>;
  collectionName = 'table-leave-requests';

  private leaveRequests: any[] = [];

  leaveRequestsSubject: BehaviorSubject<any[]> = new BehaviorSubject(<any[]>[]);

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private db: AngularFireDatabase,
    private storage: AngularFireStorage,
    private afs: AngularFirestore
  ) {
    this.getLeaveRequestsOn();
  }

  /*postLeaveRequest(registerObj: LeaveRequest) {
    return this.http.post<LeaveRequest[]>(
      `${this.API_URL}/leaveRequestList`,
      registerObj
    );
  }*/

  createLeaveRequest(
    displayName: string,
    type: string,
    description: string,
    start_date: Date,
    end_date: Date,
    status: string,
    responsable: string,
    created_at: Date,
    managed_by: String,
    managed_date: Date,
    uid: string
  ) {
    return this.afs.collection(`${this.collectionName}`).add({
      displayName,
      type,
      description,
      start_date,
      end_date,
      status,
      responsable,
      created_at,
      managed_by,
      managed_date,
      uid,
    });
  }

  //  postLeaveRequest(registerObj: any) {
  //  return this.afs.collection(`${this.collectionName}`).add({ registerObj })

  // // /*return this.http.post<LeaveRequest[]>(
  // //     `${this.API_URL}/classeurList`,
  // //     registerObj
  // //   );*/
  //  }

  /*
   postLeaveRequest(registerObj: any) {
    return this.http.post<LeaveRequest[]>(
      `${this.API_URL}/classeurList`,
      registerObj
    );
  } 
  */

  // getRegisteredLeaveRequest() {
  //   return this.http.get<LeaveRequest[]>(`${this.API_URL}/leaveRequestList`);
  // }

  /*
  updateRegisterUser(registerObj: Invoice, id: number) {
    return this.http.put<Invoice>(`${this.API_URL}/${id}`, registerObj);
  }

  deleteRegistered(id: number) {
    return this.http.delete<Invoice>(`${this.API_URL}/${id}`);
  }

  getRegisteredUserId(id: number) {
    return this.http.get<Invoice>(`${this.API_URL}/${id}`);
  }*/

  //////////////////////////////////////////////////////////

  /*create(leaveRequestData: LeaveRequest) {
    return this.auth.authStatus$.pipe(
      tap((token) => {
        if (!token) {
          throw new Error('Unauthenticated');
        }
      }),
      switchMap((token) => {
        return this.http.post<LeaveRequest>(this.API_URL + '/invoice', leaveRequestData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      })
    );
  }*/

  readPersonalByUid(uid: string) {
    return this.afs
      .collection(this.collectionName, (ref) => ref.where('uid', '==', uid))
      .valueChanges({ idField: 'id' });

    //  return this.afs
    // .collection(`${this.collectionName}`)
    // .valueChanges({ idField: 'id' });
  }

  // update(leaveRequestData: LeaveRequest) {
  //   return this.http.put<LeaveRequest>(
  //     this.API_URL + '/leaveRequestList/' + leaveRequestData.id,
  //     leaveRequestData
  //   );
  // }

  update(data: any, id: number) {
    return this.afs.doc<any>(`${this.collectionName}/${id}`).update(data);
  }

  // delete(id: number) {
  //   return this.http.delete<LeaveRequest>(
  //     this.API_URL + '/leaveRequestList/' + id
  //   );
  // }

  delete(id: number) {
    //return this.http.delete<any>("http://localhost:3001/folderList/"+id);
    return this.afs.doc<any>(`${this.collectionName}/${id}`).delete();
  }

  findAll() {
    return this.afs.collection<any>(`${this.collectionName}`, (ref) =>
      ref.orderBy('date', 'asc')
    );
  }

  getLeaveRequests(): Observable<any[]> {
    return this.afs
      .collection(`${this.collectionName}`)
      .valueChanges({ idField: 'id' });
  }

  /*findAll(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(this.API_URL + '/leaveRequestList');
  }*/

  find(id: number) {
    return this.http.get<LeaveRequest>(
      this.API_URL + '/leaveRequestList/' + id
    );
  }

  getLeaveRequestsOn(): void {
    this.db
      .list(`${this.collectionName}`)
      .query.limitToLast(10)
      .on('value', (snapshot) => {
        const foldersSnapshotValue = snapshot.val();
        if (foldersSnapshotValue) {
          const folders = Object.keys(foldersSnapshotValue).map((id) => ({
            id,
            ...foldersSnapshotValue[id],
          }));
          console.log(folders);
        }
      });
  }
}
