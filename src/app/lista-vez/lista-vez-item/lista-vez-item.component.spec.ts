import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaVezItemComponent } from './lista-vez-item.component';

describe('ListaVezItemComponent', () => {
  let component: ListaVezItemComponent;
  let fixture: ComponentFixture<ListaVezItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaVezItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListaVezItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
