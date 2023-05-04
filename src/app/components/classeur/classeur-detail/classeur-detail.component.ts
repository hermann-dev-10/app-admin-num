import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Classeur } from '../classeur';
import { ClasseurService } from '../../../shared/services/classeur.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
const htmlToPdfmake = require('html-to-pdfmake');
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-classeur-detail',
  template: `
    <div class="container">
      <div id="test-export-pdf" *ngIf="classeur; as: classeur; else: fallBack">
        <br />
        <div class="row container-classeur">
          <div class="col-xs-12 col-md-6 text-left">
            <img
              src="./../../../../assets/logo_sekoia.png"
              alt="Logo Sekoia Services SA"
            />
          </div>
          <div class="col-xs-12 col-md-6t text-right">
            Nom classeur: {{ classeur.binder_name }}
          </div>
        </div>
        <br />

        <div class="row text-right container-classeur">
          <!--<div>Reférence:</div>-->
          <div>
            Année du classeur :
            {{
              classeur.date_binder_creation | date : 'yyyy' : undefined : 'fr'
            }}
            <!--
              {{
              classeur.date_binder_creation
                | date : 'MMMM yyyy' : undefined : 'fr'
            }}
            -->
          </div>
          <!--<div>Numéro classeur:</div>-->
        </div>

        <br /><br />

        <div class="row container-classeur">
          <div class="col-xs-12 col-md-6 text-left"></div>
          <div class="col-xs-12 col-md-6 text-right">
            Nom client: {{ classeur.customer_name }}
          </div>
        </div>

        <br /><br />
        <br /><br />
        <table class="table container-classeur">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Nom Fichier</th>
              <th scope="col">Nom dossier</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let data of classeur.details; let index = index">
              <th scope="row">{{ index }}</th>
              <td>{{ data.file_name }}</td>
              <td>{{ data.folder_name }}h</td>
            </tr>
          </tbody>
        </table>

        <div class="row container-classeur">
          <div class="col-xs-12 col-md-6 text-left">
            <h4 *ngIf="classeur.status === 'NOT_STARTED'">
              État classeur : <span class="badge bg-success">Pas commencé</span>
            </h4>
            <h4 *ngIf="classeur.status === 'PROGRESSING'">
              État classeur : <span class="badge bg-dark">En cours</span>
            </h4>
            <h4 *ngIf="classeur.status === 'DONE'">
              État classeur : <span class="badge bg-danger">Terminé</span>
            </h4>
          </div>
        </div>
        <br /><br />
        <br /><br />
      </div>
      <div class="row">
        <div class="text-center">
          <button class="btn btn-primary mr-15" (click)="goBack()">
            Retour à la liste
          </button>

          <button class="btn btn-danger" (click)="openPDF(classeur)">
            Exporter
          </button>
        </div>
      </div>
      <p>
        Ajouté le
        {{ classeur.created_at | date : 'dd MMMM yyyy' : undefined : 'fr' }}
      </p>
    </div>
    <ng-template #fallBack>
      <h3>Une erreur est survenue aucun document trouvé</h3>
      <a [routerLink]="['../..']" class="btn btn-primary"
        >Retourner à la liste</a
      >
    </ng-template>
  `,
  styleUrls: ['classeur-detail.component.scss'],
})
export class ClasseurDetailComponent implements OnInit {
  @ViewChild('pdfTable')
  pdfTable!: ElementRef;

  @ViewChild('htmlData') htmlData!: ElementRef;
  classeur!: Classeur;

  singleClasseur: any | undefined;

  classeurId?: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private classeurService: ClasseurService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.classeurService
      .find(id)
      .subscribe((classeur: any) => (this.classeur = classeur));

    console.log('id:', id);
  }

  public openPDF(classeur: Classeur): void {
    // On récupère les informations de du classeur et on y ajoute l'identifiant
    const uptatedClasseur = { ...classeur, id: this.classeurId };

    let DATA: any = document.getElementById('test-export-pdf');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('Facture_' + `${this.classeur.customer_name}` + '.pdf');
    });
  }

  public goBack() {
    this.router.navigate(['/classeurs']);
  }

  public exportClasseur() {
    const doc = new jsPDF();

    autoTable(doc, {
      body: [
        [
          {
            //content: this.getLogo(),
            content: 'LM Services',
            styles: {
              halign: 'left',
              fontSize: 20,
              textColor: '#000',
            },
          },
          {
            content: 'classeur',
            styles: {
              halign: 'right',
              fontSize: 20,
              textColor: '#000',
            },
          },
        ],
      ],
      theme: 'plain',
      styles: {
        fillColor: '#D0D0D0',
      },
    });

    autoTable(doc, {
      body: [
        [
          {
            content:
              'Reférence: #FA0001' + '\nDate: 27-01-2022' + `\nNuméro facture:`,
            styles: {
              halign: 'right',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      body: [
        [
          {
            content:
              '\nClient' + '\nAdresse 1' + '\nCode postale - Ville' + '\nPays',
            styles: {
              halign: 'left',
            },
          },
          {
            content:
              /*'Shipping address:' +
              '\nJohn Doe' +
              '\nShipping Address line 1' +
              '\nShipping Address line 2' +
              '\nZip code - City' +*/
              '\n',
            styles: {
              halign: 'left',
            },
          },
          {
            content:
              '\nLM-Services Sàrl' +
              '\nRue Arnold Winkelried 6' +
              '\n1201 Genève' +
              '\nTVA: CHE-470.914.506',
            styles: {
              halign: 'right',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      body: [
        /*[
          {
            content: 'Montant dû:',
            styles: {
              halign: 'right',
              fontSize: 14,
            },
          },
        ],
        [
          {
            content: 'CHF 4000',
            styles: {
              halign: 'right',
              fontSize: 20,
              textColor: '#3366ff',
            },
          },
        ],
        [
          {
            content: 'Due date: 01-02-2022',
            styles: {
              halign: 'right',
            },
          },
        ],*/
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Services',
            styles: {
              halign: 'left',
              fontSize: 14,
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      head: [['Elements', 'Catégorie', 'Quantité', 'Prix', 'Tax', 'Montant']],
      body: [
        [
          'Produit ou Nom du service',
          'Catégorie',
          '2',
          'CHF 450',
          'CHF 50',
          'CHF 1000',
        ],
        [
          'Produit ou Nom du service',
          'Catégorie',
          '2',
          'CHF 450',
          'CHF 50',
          'CHF 1000',
        ],
        [
          'Produit ou Nom du service',
          'Catégorie',
          '2',
          'CHF 450',
          'CHF 50',
          'CHF 1000',
        ],
        [
          'Produit ou Nom du service',
          'Catégorie',
          '2',
          'CHF 450',
          'CHF 50',
          'CHF 1000',
        ],
      ],
      theme: 'striped',
      headStyles: {
        fillColor: '#D0D0D0',
        textColor: '#000',
      },
    });

    autoTable(doc, {
      body: [
        [
          {
            content: '',
            styles: {
              halign: 'right',
            },
          },
          {
            content: 'Sous-total: CHF 3600',
            styles: {
              halign: 'right',
            },
          },
        ],
        [
          {
            content: ':',
            styles: {
              halign: 'right',
            },
          },
          {
            content: 'Total tax : CHF 400',
            styles: {
              halign: 'right',
            },
          },
        ],
        [
          {
            content: '',
            styles: {
              halign: 'right',
            },
          },
          {
            content: 'Montant total: CHF 4000',
            styles: {
              halign: 'right',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'Terms & notes',
            styles: {
              halign: 'left',
              fontSize: 14,
            },
          },
        ],
        [
          {
            content:
              'orem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia' +
              'molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum' +
              'numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium',
            styles: {
              halign: 'left',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      body: [
        [
          {
            content: ' ',

            styles: {
              halign: 'center',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      body: [
        [
          {
            content: ' ',

            styles: {
              halign: 'center',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      body: [
        [
          {
            content: ' ',

            styles: {
              halign: 'center',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      body: [
        [
          {
            content: 'IBAN : CH29 0078 8000 0509 1317 6',

            styles: {
              halign: 'center',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    autoTable(doc, {
      body: [
        [
          {
            content:
              '+41 79 128 52 93 - contact@lm-services.ch - lm-services.ch',

            styles: {
              halign: 'center',
            },
          },
        ],
      ],
      theme: 'plain',
    });

    return doc.save(`Facture_num`);
  }
}
