import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service'; // Corrigido de Auth para AuthService

describe('AuthService', () => {
  // Corrigido de Auth para AuthService
  let service: AuthService; // Corrigido de Auth para AuthService

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService); // Corrigido de Auth para AuthService
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
