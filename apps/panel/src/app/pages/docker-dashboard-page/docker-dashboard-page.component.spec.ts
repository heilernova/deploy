import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DockerDashboardPageComponent } from './docker-dashboard-page.component';

describe('DockerDashboardPageComponent', () => {
  let component: DockerDashboardPageComponent;
  let fixture: ComponentFixture<DockerDashboardPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DockerDashboardPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DockerDashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
