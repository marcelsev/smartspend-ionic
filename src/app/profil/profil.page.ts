import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  user: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getUserProfile().subscribe(
      (userData) => {
        console.log('Información del usuario:', userData);
        // Procesar la información del usuario aquí
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
}
