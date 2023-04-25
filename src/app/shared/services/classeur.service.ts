import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { Classeur } from './../../components/classeur/classeur';



@Injectable()
export class ClasseurService {
  API_URL = environment.API_URL;

  constructor(private http: HttpClient, private auth: AuthService) {}

  postClasseur(registerObj: any) {
    return this.http.post<Classeur[]>(
      `${this.API_URL}/classeurList`,
      registerObj
    );
  }

  getRegisteredClasseur() {
    return this.http.get<Classeur[]>(`${this.API_URL}/classeurList`);
  }

  /*
  updateRegisterUser(registerObj: Classeur, id: number) {
    return this.http.put<Classeur>(`${this.API_URL}/${id}`, registerObj);
  }

  deleteRegistered(id: number) {
    return this.http.delete<Classeur>(`${this.API_URL}/${id}`);
  }

  getRegisteredUserId(id: number) {
    return this.http.get<Classeur>(`${this.API_URL}/${id}`);
  }*/

  //////////////////////////////////////////////////////////

  /*create(classeurData: Classeur) {
    return this.auth.authStatus$.pipe(
      tap((token) => {
        if (!token) {
          throw new Error('Unauthenticated');
        }
      }),
      switchMap((token) => {
        return this.http.post<Classeur>(this.API_URL + '/classeur', classeurData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      })
    );
  }*/

  update(classeurData: Classeur) {
    return this.http.put<Classeur>(
      this.API_URL + '/classeurList/' + classeurData.id,
      classeurData
    );
  }

  delete(id: number) {
    return this.http.delete<Classeur>(this.API_URL + '/classeurList/' + id);
  }

  findAll(): Observable<Classeur[]> {
    return this.http.get<Classeur[]>(this.API_URL + '/classeurList');
  }

  find(id: number) {
    return this.http.get<Classeur>(this.API_URL + '/classeurList/' + id);
  }
}
