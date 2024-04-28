import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaVezComponent } from './lista-vez.component';

describe('ListaVezComponent', () => {
  let component: ListaVezComponent;
  let fixture: ComponentFixture<ListaVezComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaVezComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListaVezComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
