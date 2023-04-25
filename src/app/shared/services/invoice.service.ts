import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { Invoice } from './../../components/invoice/invoice';



@Injectable()
export class InvoiceService {
  API_URL = environment.API_URL;

  constructor(private http: HttpClient, private auth: AuthService) {}

  postInvoice(registerObj: any) {
    return this.http.post<Invoice[]>(`${this.API_URL}/invoiceList`, registerObj);
  }

  getRegisteredInvoice() {
    return this.http.get<Invoice[]>(`${this.API_URL}/invoiceList`);
  }

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

  /*create(invoiceData: Invoice) {
    return this.auth.authStatus$.pipe(
      tap((token) => {
        if (!token) {
          throw new Error('Unauthenticated');
        }
      }),
      switchMap((token) => {
        return this.http.post<Invoice>(this.API_URL + '/invoice', invoiceData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      })
    );
  }*/

  update(invoiceData: Invoice) {
    return this.http.put<Invoice>(
      this.API_URL + '/invoiceList/' + invoiceData.id,
      invoiceData
    );
  }

  delete(id: number) {
    return this.http.delete<Invoice>(this.API_URL + '/invoiceList/' + id);
  }

  findAll(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.API_URL + '/invoiceList');
  }

  find(id: number) {
    return this.http.get<Invoice>(this.API_URL + '/invoiceList/' + id);
  }
}
