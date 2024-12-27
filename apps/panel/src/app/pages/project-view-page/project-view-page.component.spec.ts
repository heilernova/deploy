import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectViewPageComponent } from './project-view-page.component';

describe('ProjectViewPageComponent', () => {
  let component: ProjectViewPageComponent;
  let fixture: ComponentFixture<ProjectViewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectViewPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
