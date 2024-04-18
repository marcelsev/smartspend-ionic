import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpHeaders } from '@angular/common/http';
import { CategoryService } from '../category.service';
import { ExpenseService } from '../expense.service';
import { MethodPayService } from '../method-pay.service';
import { DepositService } from '../deposit.service';
import  Chart, { ChartItem, ChartType }  from 'chart.js/auto';
import { ApexChart, ApexNonAxisChartSeries, ApexResponsive } from 'ng-apexcharts';


@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  /* @ViewChild('doughnutChart') doughnutChartRef!: ElementRef<HTMLCanvasElement>; */
  
  userId: number | null = null;
  userName: string = '';
  categories: any[] = [];
  methodPays: any[] = [];
  expenses: any[] = [];
  deposits: any[] = [];
  categoriesMap: { [key: number]: string } = {};
  methodPaysMap: { [key: number]: string } = {};

  // Variables para almacenar los valores de los filtros
  fechaInicio: Date | undefined;
  fechaFin: Date | undefined;
  categoryId: number | undefined;
  minAmount: number | undefined;
  maxAmount: number | undefined;
  methodPayId: number | undefined;

  filteredResults: any[] = [];
  filtersApplied: boolean = false; // Bandera para indicar si se aplicaron filtros
  noResultsMessage: string = ''; //



  constructor(
    private authService: AuthService,
    private categoryService: CategoryService,
    private expenseService: ExpenseService,
    private methodPayService: MethodPayService,
    private depositService: DepositService,
   
  ) {
    /*  this.categoryId = undefined;
    this.minAmount = undefined;
    this.maxAmount = undefined;
    this.methodPayId = undefined; */
  }

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
  /* applyFilters(): void {
    console.log('Applying filters...');
    console.log('Fecha inicio:', this.fechaInicio);
    console.log('Fecha fin:', this.fechaFin);
    console.log('Categoría ID:', this.categoryId);
  
    this.filteredResults = this.expenses.filter((expense) => {
      let matches = true;
  
      // Convertir categoryId de string a number para comparar
      if (this.categoryId !== undefined && expense.CategoryId !== parseInt(this.categoryId.toString(), 10)) {
        matches = false;
      }
  
      // Convertir minAmount de string a number para comparar
      if (this.minAmount !== undefined && expense.amount < parseInt(this.minAmount.toString(), 10)) {
        matches = false;
      }
  
      // Convertir maxAmount de string a number para comparar
      if (this.maxAmount !== undefined && expense.amount > parseInt(this.maxAmount.toString(), 10)) {
        matches = false;
      }
  
      // Convertir methodPayId de string a number para comparar
      if (this.methodPayId !== undefined && expense.MethodPayId !== parseInt(this.methodPayId.toString(), 10)) {
        matches = false;
      }
  
      return matches;
    });
  
    console.log('Filtered Results:', this.filteredResults);
  }
   */

  applyFilters() {
    // Combinar todos los gastos y depósitos inicialmente
    this.filteredResults = [...this.expenses, ...this.deposits];
  
    // Verificar si se han seleccionado criterios de filtro
    const filtersSelected =
      this.categoryId !== undefined ||
      this.minAmount !== undefined ||
      this.maxAmount !== undefined ||
      this.methodPayId !== undefined ||
      (this.fechaInicio !== undefined && this.fechaFin !== undefined);
  
    if (filtersSelected) {
      // Aplicar filtros según los criterios seleccionados
      this.filteredResults = this.filteredResults.filter((item) => {
        let matches = true;
  
        // Aplicar filtro por categoría
        if (this.categoryId !== undefined && item.CategoryId !== parseInt(this.categoryId.toString(), 10)) {
          matches = false;
        }
  
        // Aplicar filtro por monto mínimo
        if (this.minAmount !== undefined && item.amount < parseInt(this.minAmount.toString(), 10)) {
          matches = false;
        }
  
        // Aplicar filtro por monto máximo
        if (this.maxAmount !== undefined && item.amount > parseInt(this.maxAmount.toString(), 10)) {
          matches = false;
        }
  
        // Aplicar filtro por método de pago
        if (this.methodPayId !== undefined && item.MethodPayId !== parseInt(this.methodPayId.toString(), 10)) {
          matches = false;
        }
  
        // Aplicar filtro por rango de fechas
        if (this.fechaInicio !== undefined && this.fechaFin !== undefined) {
          const expenseDate = new Date(item.exp_date);
          if (expenseDate < this.fechaInicio || expenseDate > this.fechaFin) {
            matches = false;
          }
        }
  
        return matches;
      });
  
      // Verificar si no hay resultados después de aplicar filtros
      if (this.filteredResults.length === 0) {
        this.noResultsMessage = 'Aucun résultat ne correspond aux filtres appliqués.';
      } else {
        this.noResultsMessage = ''; // Reiniciar el mensaje
      }
  
      this.filtersApplied = true; // Indicar que se aplicaron filtros
    } else {
      // No se aplicaron filtros, mostrar todos los elementos
      this.filteredResults = [...this.expenses, ...this.deposits];
      this.filtersApplied = false;
      this.noResultsMessage = ''; // Reiniciar el mensaje
    }
  }
    clearFilters() {
      // Limpiar todos los filtros y mostrar todos los gastos y depósitos
      this.categoryId = undefined;
      this.minAmount = undefined;
      this.maxAmount = undefined;
      this.methodPayId = undefined;
      this.fechaInicio = undefined;
      this.fechaFin = undefined;
      this.filtersApplied = false;
      this.filteredResults = [...this.expenses, ...this.deposits]; // Mostrar todos los gastos y depósitos
      this.noResultsMessage = ''; // Reiniciar el mensaje
    }
  


  private createIdNameMap(items: any[]): { [key: number]: string } {
    const idNameMap: { [key: number]: string } = {};
    items.forEach((item) => {
      idNameMap[item.id] = item.name;
    });
    return idNameMap;
  }
  /* renderDoughnutChart(): void {
    const canvas = this.doughnutChartRef.nativeElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      console.error('No se pudo obtener el contexto 2D del canvas.');
      return;
    }

    const myDoughnutChart = new Chart(ctx as ChartItem, {
      type: 'doughnut',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
          label: '# of Votes',
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            'red',
            'blue',
            'yellow',
            'green',
            'purple',
            'orange'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: function(tooltipItem: any) {
                return tooltipItem.label + ': ' + tooltipItem.raw.toFixed(2);
              }
            }
          }
        }
      }
    });
  } */

}
