import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpHeaders } from '@angular/common/http';
import { CategoryService } from '../category.service';
import { ExpenseService } from '../expense.service';
import { MethodPayService } from '../method-pay.service';
import { DepositService } from '../deposit.service';
@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  userId: number | null = null;
  userName: string = '';
  categories: any[] = [];
  methodPays: any[] = [];
  expenses: any[] = [];
  deposits: any[] = [];
  categoriesMap: { [key: number]: string } = {};
  methodPaysMap: { [key: number]: string } = {};
  constructor(
    private authService: AuthService,
    private categoryService: CategoryService,
    private expenseService: ExpenseService,
    private methodPayService: MethodPayService,
    private depositService: DepositService
  ) {}

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

  ngOnInit(): void {
    // Obtiene el perfil del usuario y carga las categorías y gastos asociados
    this.authService.getUserProfile().subscribe(
      (userData) => {
        console.log('Información del usuario:', userData);
        this.userName = userData.name;
        this.userId = userData.id; // Asigna el userId del usuario conectado

        // Carga las categorías y los gastos solo si se obtuvo el userId correctamente
        if (this.userId) {
          this.loadCategories();
          this.loadExpenses();
          this.loadMethodPays();
          this.loadDeposits();
        } else {
          console.error('No se pudo obtener el userId del usuario');
        }
      },
      (error) => {
        console.error('Error al obtener información del usuario:', error);
        // Maneja el error apropiadamente
      }
    );
  }

  logout(): void {
    this.authService.logout().subscribe(
      () => {
        window.location.href = '/'; // Redirige al usuario a la página de inicio al salir
      },
      (error) => {
        console.error('Error al desconectar:', error);
      }
    );
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (categories) => {
        this.categories = categories;
        this.categoriesMap = this.createIdNameMap(categories);
        console.log('Categorías obtenidas:', this.categories);
      },
      (error) => {
        console.error('Error al cargar las categorías:', error);
      }
    );
  }

  loadMethodPays(): void {
    this.methodPayService.getAllMethodPays().subscribe(
      (methodPays) => {
        this.methodPays = methodPays;
        this.methodPaysMap = this.createIdNameMap(methodPays);
        console.log('Métodos de Pago obtenidos:', this.methodPays);
      },
      (error) => {
        console.error('Error al cargar los métodos de pago:', error);
      }
    );
  }

  loadExpenses(): void {
    this.expenseService.getExpensesByUserId().subscribe(
      (expenses) => {
        if (this.userId) {
          this.expenses = expenses.filter(
            (expense) => expense.UserId === this.userId
          );
          console.log(
            'Expenses obtenidas filtradas por userId:',
            this.expenses
          );
        } else {
          console.error('No se pudo obtener el userId del usuario');
        }
      },
      (error) => {
        console.error('Error al obtener expenses:', error);
        // Maneja el error de acuerdo a tus necesidades
      }
    );
  }

  loadDeposits(): void {
    this.depositService.getDepositsByUserId().subscribe(
      (deposit) => {
        if (this.userId) {
          this.deposits = deposit.filter(
            (deposit) => deposit.UserId === this.userId
          );
          console.log('deposit obtenidas filtradas por userId:', this.deposits);
        } else {
          console.error('No se pudo obtener el userId del usuario');
        }
      },
      (error) => {
        console.error('Error al obtener depósitos:', error);
      }
    );
  }
  private createIdNameMap(items: any[]): { [key: number]: string } {
    const idNameMap: { [key: number]: string } = {};
    items.forEach((item) => {
      idNameMap[item.id] = item.name;
    });
    return idNameMap;
  }
}
