import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalListaComponent } from './animal-lista';

describe('AnimalListaComponent', () => {
  let component: AnimalListaComponent;
  let fixture: ComponentFixture<AnimalListaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimalListaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AnimalListaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

{
  "compilerOptions"; {
    "types"; ["jasmine"]
  }
}
});