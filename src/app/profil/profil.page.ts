import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpHeaders } from '@angular/common/http';
import { CategoryService } from '../category.service';
@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  userId: number =12;
userName: string = '';
categories: any[] = [];
  constructor(private authService: AuthService, private categoryService: CategoryService) {}

  /* ngOnInit(): void {
    this.authService.getUserProfile(this.userId).subscribe(
      (userData) => {
        console.log('Información del usuario:', userData);
        this.userName = userData.name
      },
      (error) => {
        console.error('Error al obtener información del usuario:', error);
        // Maneja el error de acuerdo a tus necesidades
      }
    );
  } */

   ngOnInit() {this.loadCategories();
    this.getUserProfile();
    
  
  } 

  getUserProfile():void{
    this.authService.getUserProfile().subscribe(
      (userData) => {
        console.log('Información del usuario:', userData);
        // Procesar la información del usuario aquí
        this.userName = userData.name
      },
      (error) => {
        console.error('Error al obtener información del usuario:', error);
        // Manejar el error apropiadamente
      }
    );
  }
 

  logout(): void {
    this.authService.logout().subscribe(
      () => {
        window.location.href = '/';
      },
      (error) => {
        console.error('Error al desconectar:', error);
      }
    );
  }

  

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (data) => {
        this.categories = data;
        console.log('Categorías obtenidas:', this.categories);
      },
      (error) => {
        console.error('Error al cargar las categorías:', error);
      }
    );
  }
}
