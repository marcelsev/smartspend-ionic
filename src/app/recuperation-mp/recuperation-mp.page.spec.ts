import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecuperationMpPage } from './recuperation-mp.page';

describe('RecuperationMpPage', () => {
  let component: RecuperationMpPage;
  let fixture: ComponentFixture<RecuperationMpPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RecuperationMpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
