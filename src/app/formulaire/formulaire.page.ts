import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { CategoryService } from '../category.service';
import { MethodPayService } from '../method-pay.service';
import { DepositService } from '../deposit.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExpenseService } from '../expense.service';

@Component({
  selector: 'app-formulaire',
  templateUrl: './formulaire.page.html',
  styleUrls: ['./formulaire.page.scss'],
})
export class FormulairePage implements OnInit {
  userName: string = '';
  categories: any[] = [];
  methodPays: any[] = [];
  depositForm: FormGroup;
  expenseForm: FormGroup;
  userId: number | null = null;
  constructor(
    private authService: AuthService,
    private categoryService: CategoryService,
    private methodPayService: MethodPayService,
    private depositService: DepositService,
    private expenseService: ExpenseService,
    private formBuilder: FormBuilder
  ) {
    this.expenseForm = this.formBuilder.group({
      amount: ['', Validators.required],
      exp_date: ['', Validators.required],
      location: [''],
      note: [''],
      MethodPayId: ['', Validators.required],
      CategoryId: ['', Validators.required],
    });
    this.depositForm = this.formBuilder.group({
      amount: ['', Validators.required],
      dep_date: ['', Validators.required],
      note: [''],
    });
  }

  ngOnInit(): void {
    this.loadCategories();

    this.loadMethodPays();

    this.authService.getUserProfile().subscribe(
      (userData) => {
        this.userName = this.formatUserName(userData.name);
        this.userId = userData.id; 
        console.log(this.userId);
      },
      (error) => {
        console.error('Error info user:', error);
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
  
  createDeposit(): void {
    console.log('Entrando a createDeposit()');
    if (this.depositForm.valid && this.userId) {
      const depositData = {
        ...this.depositForm.value,
        userId: this.userId,
         
      };
      console.log(this.depositForm);
      console.log('Datos de depósito a enviar:', depositData); 

      this.depositService.createDeposit(depositData).subscribe(
        (response: any) => {
          console.log('Depósito creado exitosamente:', response);
          this.depositForm.reset();
          window.location.href = '/profil'; 
        },
        (error: any) => {
          console.error('Error al crear depósito:', error);
         
        }
      );
      console.log('Datos del formulario:', this.depositForm.value);
    } else {
      console.error('Formulario inválido o ID de usuario no disponible.');
      console.log('Estado del formulario:', this.depositForm.status);
    }
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (categories) => {
        this.categories = categories;
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
        console.log('Métodos de Pago obtenidos:', this.methodPays);
      },
      (error) => {
        console.error('Error al cargar los métodos de pago:', error);
      }
    );
  }
   createExpense(): void {
    if (this.expenseForm.valid) {
      const expenseData = {
        ...this.expenseForm.value,
        userId: this.userId,
        categoryId: +this.expenseForm.value.CategoryId, 
        methodPayId: +this.expenseForm.value.MethodPayId,
         
      };
      console.log('Expense data to send:', expenseData);
  
      this.expenseService.createExpense(expenseData).subscribe(
        (response: any) => {
          console.log('Expense created successfully:', response);
          this.expenseForm.reset(); 
          window.location.href = '/profil';
        },
        (error: any) => {
          console.error('Error creating expense:', error);
          
        }
      );
    } else {
      console.error('Invalid form');
    }
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
