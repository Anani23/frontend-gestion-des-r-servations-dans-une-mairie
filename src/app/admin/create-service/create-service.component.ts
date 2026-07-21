import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { catchError, finalize, of } from 'rxjs';

import { Service } from '../../models/service.model';
import { CategorieBienService } from '../../services/categorie-bien.service';
import { ServiceService } from '../../services/service.service';

interface MoyenPaiement {
  code: string;
  label: string;
  icon: string;
}

@Component({
  selector:'app-create-service',
  standalone:true,
  imports:[
    CommonModule,
    FormsModule
  ],
  templateUrl:'./create-service.component.html',
  styleUrls:[
    './create-service.component.scss'
  ]
})
export class CreateServiceComponent implements OnInit{

  private serviceService=
  inject(ServiceService);

  private catService=
  inject(CategorieBienService);

  private router=
  inject(Router);

  private route=
  inject(ActivatedRoute);

  private cdr=
  inject(ChangeDetectorRef);


  categories:any[]=[];

  isEdit=false;

  serviceId?:number;

  loading=false;

  selectedFile?:File;

  moyensPaiementDisponibles: MoyenPaiement[] = [
    { code: 'MIXX_YAS', label: 'Mixx Yas', icon: '💳' },
    { code: 'MOOV_MONEY', label: 'Moov Money', icon: '📱' },
    { code: 'TMONEY', label: 'T-Money', icon: '💰' },
    { code: 'CASH', label: 'Espèces', icon: '💵' },
    { code: 'CARD', label: 'Carte bancaire', icon: '🏧' }
  ];

  selectedMoyens: Set<string> = new Set();

  serviceData:Service={

    nom:'',

    description:'',

    actif:true,

    categorieId:null,

    piecesPath:'',

    prix:0,

    moyensPaiement:''

  };

  toggleMoyen(code: string): void {
    if (this.selectedMoyens.has(code)) {
      this.selectedMoyens.delete(code);
    } else {
      this.selectedMoyens.add(code);
    }
    this.serviceData.moyensPaiement = Array.from(this.selectedMoyens).join(',');
  }

  isMoyenSelected(code: string): boolean {
    return this.selectedMoyens.has(code);
  }


  ngOnInit():void{

    this.loadCategories();

    this.checkEditMode();

  }



  /*=========================
      CHARGER CATEGORIES
  =========================*/

  loadCategories():void{

    this.catService

    .getTreeCategories()

    .pipe(

      catchError(err=>{

        console.error(
          'Erreur catégories',
          err
        );

        return of([]);

      })

    )

    .subscribe((data:any[])=>{

      console.log(
        'categories:',
        data
      );


      this.categories=

      data.filter(c=>

      c.type?.toLowerCase()

      ===

      'services'

      );

      this.cdr.markForCheck();
      this.cdr.detectChanges();

    });

  }



  /*=========================
      MODE EDITION
  =========================*/

  checkEditMode():void{

    const id=

    this.route
    .snapshot
    .paramMap
    .get('id');


    if(!id){

      return;

    }


    this.isEdit=true;

    this.serviceId=+id;

    this.loadService(
      this.serviceId
    );

  }



  /*=========================
      CHARGER SERVICE
  =========================*/

  loadService(
    id:number
  ):void{

    this.loading=true;

    this.serviceService

    .getServiceById(id)

    .pipe(

      finalize(()=>{

        this.loading=false;

      }),

      catchError(err=>{

        console.log(err);

        return of(null);

      })

    )

    .subscribe(data=>{

      if(!data){

        return;

      }

      this.serviceData={
        ...data
      };

      this.selectedMoyens = new Set(
        (data.moyensPaiement || '').split(',').map((m: string) => m.trim()).filter(Boolean)
      );

      this.cdr.markForCheck();
      this.cdr.detectChanges();

    });

  }




  /*=========================
      PDF
  =========================*/

  onFileSelected(
    event:any
  ){

    const file=
    event.target.files[0];

    if(!file){

      return;

    }

    if(
      file.type
      !==
      'application/pdf'
    ){

      alert(
      'PDF uniquement'
      );

      return;

    }

    this.selectedFile=file;

  }



  /*=========================
      ENREGISTRER
  =========================*/

  submit():void{

    if(

    !this.serviceData.nom?.trim()

    ||

    !this.serviceData.categorieId

    ){

      alert(
      'Champs obligatoires'
      );

      return;

    }


    this.loading=true;


    const save=(path?:string)=>{

      if(path){

      this.serviceData.piecesPath=
      path;

      }

      const request=

      this.isEdit

      &&

      this.serviceId

      ?

      this.serviceService
      .modifierService(
        this.serviceId,
        this.serviceData
      )

      :

      this.serviceService
      .ajouterService(
        this.serviceData
      );


      request

      .pipe(

        finalize(()=>{

          this.loading=false;

        }),

        catchError(err=>{

          console.log(err);

          alert(
          'Erreur sauvegarde'
          );

          return of(null);

        })

      )

      .subscribe(res=>{

        if(!res){

          return;

        }

        this.router.navigate(
          ['/admin/services']
        );

      });

    };


    if(this.selectedFile){

      this.serviceService

      .uploadPdf(
      this.selectedFile
      )

      .pipe(

        catchError(err=>{

          console.log(err);

          alert(
          'Erreur upload PDF'
          );

          this.loading=false;

          return of(null);

        })

      )

      .subscribe(path=>{

        if(!path){

          return;

        }

        save(path);

      });

    }

    else{

      save();

    }

  }

}