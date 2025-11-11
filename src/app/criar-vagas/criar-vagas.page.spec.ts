import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CriarVagasPage } from './criar-vagas.page';

describe('CriarVagasPage', () => {
  let component: CriarVagasPage;
  let fixture: ComponentFixture<CriarVagasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CriarVagasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
