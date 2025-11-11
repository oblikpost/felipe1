import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerVagasPage } from './ver-vagas.page';

describe('VerVagasPage', () => {
  let component: VerVagasPage;
  let fixture: ComponentFixture<VerVagasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerVagasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
