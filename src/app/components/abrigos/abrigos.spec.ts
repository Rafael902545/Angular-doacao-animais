import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbrigosComponent } from './abrigos';

describe('AbrigosComponent', () => {
  let component: AbrigosComponent;
  let fixture: ComponentFixture<AbrigosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AbrigosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AbrigosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
