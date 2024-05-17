import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

  
  fechaInicio: Date | undefined;
  fechaFin: Date | undefined;
  categoryId: number | undefined;
  minAmount: number | undefined;
  maxAmount: number | undefined;
  methodPayId: number | undefined;

  filteredResults: any[] = [];
  filtersApplied: boolean = false; 
  noResultsMessage: string = ''; //
  totalExpenses: number = 0; // 
  totalDeposits: number = 0; 
  totalFilteredExpenses: number = 0; // Variable para almacenar el total de gastos filtrados
  totalFilteredDeposits: number = 0; 
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
    
    this.authService.getUserProfile().subscribe(
      (userData) => {
        console.log('Información del usuario:', userData);
        this.userName = this.formatUserName(userData.name);
        this.userId = userData.id; 

        
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
        
      }
    );
 
  }
  private formatUserName(name: string): string { 
    const parts = name.split(' ');
    const formattedParts = parts.map(part => {
      const formattedPart = part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
      return formattedPart;
    });
  
    const formattedName = formattedParts.join(' ');
  
    return formattedName;
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
          this.calculateTotalExpenses();
        } else {
          console.error('No se pudo obtener el userId del usuario');
        }
      },
      (error) => {
        console.error('Error al obtener expenses:', error);
        
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
          this.calculateTotalDeposits();
        } else {
          console.error('No se pudo obtener el userId del usuario');
        }
      },
      (error) => {
        console.error('Error al obtener depósitos:', error);
      }
    );
  }
  calculateTotalExpenses(): void {
    // Calcula el total de gastos
    this.totalExpenses = this.expenses.reduce((total, expense) => total + expense.amount, 0);
    console.log('Total de gastos:', this.totalExpenses);
  }

  calculateTotalDeposits(): void {
    // Calcula el total de depósitos
    this.totalDeposits = this.deposits.reduce((total, deposit) => total + deposit.amount, 0);
    console.log('Total de depósitos:', this.totalDeposits);
  }
  applyFilters() {
    
    this.filteredResults = [...this.expenses];
  
   
    const filtersSelected =
      this.categoryId !== undefined ||
      this.minAmount !== undefined ||
      this.maxAmount !== undefined ||
      this.methodPayId !== undefined ||
      (this.fechaInicio !== undefined && this.fechaFin !== undefined);
  
    if (filtersSelected) {
     
      this.filteredResults = this.filteredResults.filter((item) => {
        let matches = true;
  
        
        if (this.categoryId !== undefined && item.CategoryId !== parseInt(this.categoryId.toString(), 10)) {
          matches = false;
        }
  
        if (this.minAmount !== undefined && item.amount < parseInt(this.minAmount.toString(), 10)) {
          matches = false;
        }
  
      
        if (this.maxAmount !== undefined && item.amount > parseInt(this.maxAmount.toString(), 10)) {
          matches = false;
        }
  
        
        if (this.methodPayId !== undefined && item.MethodPayId !== parseInt(this.methodPayId.toString(), 10)) {
          matches = false;
        }
  
        if (this.fechaInicio !== undefined && this.fechaFin !== undefined) {
          const expenseDate = new Date(item.exp_date);
          if (expenseDate < this.fechaInicio || expenseDate > this.fechaFin) {
            matches = false;
          }
        }
  
        return matches;
      });
  
   
      if (this.filteredResults.length === 0) {
        this.noResultsMessage = 'Aucun résultat ne correspond aux filtres appliqués.';
      } else {
        this.noResultsMessage = ''; 
      }
  
      this.filtersApplied = true; 
    } else {
     
      this.filteredResults = [...this.expenses];
      this.filtersApplied = false;
      this.noResultsMessage = ''; 
    }
    this.totalFilteredExpenses = this.filteredResults.filter(item => item.hasOwnProperty('CategoryId')).reduce((total, item) => total + item.amount, 0);
    this.totalFilteredDeposits = this.filteredResults.filter(item => item.hasOwnProperty('MethodPayId')).reduce((total, item) => total + item.amount, 0);

    // Actualiza el indicador de filtros aplicados
    this.filtersApplied = true;
  }
    clearFilters() {
      
      this.categoryId = undefined;
      this.minAmount = undefined;
      this.maxAmount = undefined;
      this.methodPayId = undefined;
      this.fechaInicio = undefined;
      this.fechaFin = undefined;
      this.filtersApplied = false;
      this.filteredResults = [...this.expenses, ...this.deposits]; 
      this.noResultsMessage = ''; 
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