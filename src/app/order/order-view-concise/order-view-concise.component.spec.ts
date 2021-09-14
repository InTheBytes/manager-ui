import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderViewConciseComponent } from './order-view-concise.component';

describe('OrderViewConciseComponent', () => {
  let component: OrderViewConciseComponent;
  let fixture: ComponentFixture<OrderViewConciseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderViewConciseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderViewConciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
