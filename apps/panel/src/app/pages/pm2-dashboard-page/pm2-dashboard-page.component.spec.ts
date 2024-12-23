import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pm2DashboardPageComponent } from './pm2-dashboard-page.component';

describe('Pm2DashboardPageComponent', () => {
  let component: Pm2DashboardPageComponent;
  let fixture: ComponentFixture<Pm2DashboardPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pm2DashboardPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pm2DashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
