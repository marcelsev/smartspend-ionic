import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InformationAppPage } from './information-app.page';

describe('InformationAppPage', () => {
  let component: InformationAppPage;
  let fixture: ComponentFixture<InformationAppPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InformationAppPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
