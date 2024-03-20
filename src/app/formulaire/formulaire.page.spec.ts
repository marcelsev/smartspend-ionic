import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormulairePage } from './formulaire.page';

describe('FormulairePage', () => {
  let component: FormulairePage;
  let fixture: ComponentFixture<FormulairePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FormulairePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
