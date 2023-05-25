import { Component, OnInit } from '@angular/core';
import { LeaveRequest } from '../leave-request';
import { ActivatedRoute, Router } from '@angular/router';
import { LeaveRequestService } from '../../../shared/services/leave-request.service';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-request-edition',
  templateUrl: './request-edition.component.html',
  styleUrls: ['./request-edition.component.scss'],
})
export class RequestEditionComponent implements OnInit {
  errorMessage = '';
  leaveRequest?: LeaveRequest;


  // L'observable qui contiendra dans le futur la facture récupérée sur Xano
  leaveRequest$?: Observable<LeaveRequest>;
  leaveRequestId?: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private leaveRequestService: LeaveRequestService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Notre observable invoice$ sera le résultat de l'observable ParamMap de la route,
    // qui à chaque évolution, sera transformé en un identifiant, puis en la facture qui
    // correspond à l'identifiant

    this.leaveRequest$ = this.activatedRoute.paramMap.pipe(
      map((paramMap) => paramMap.get('id')),
      tap((id) => (this.leaveRequestId = +id!)),
      switchMap((id) => this.leaveRequestService.find(+id!))
    );
    // .subscribe((invoice: any) => {
    //   console.log('INVOICE EDITION COMPONENT');
    //   console.log(invoice);
    //   this.invoice = invoice;
    //console.log('this.invoice', this.invoice);
    //});

    console.log('this.leaveRequest$ :', this.leaveRequest$);
  }

  // onSubmit(leaveRequest: LeaveRequest) {
  //   // On récupère les informations de la facture et on y ajoute l'identifiant
  //   console.log('UPDATE leaveRequest');
  //   const uptatedInvoice = {
  //     ...leaveRequest,
  //     id: this.leaveRequestId,
  //   };

  //   this.leaveRequestService.update(uptatedInvoice).subscribe({
  //     next: () => this.router.navigate(['../leave-requests']),
  //     error: () =>
  //       (this.errorMessage =
  //         "Une erreur est survenue lors de l'enregistrement de la facture, veuillez réessayer plus tard :)"),
  //   });
  // }

  sideBarOpen = true;

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
}
