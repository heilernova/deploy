import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectNewPageComponent } from './project-new-page.component';

describe('ProjectNewPageComponent', () => {
  let component: ProjectNewPageComponent;
  let fixture: ComponentFixture<ProjectNewPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectNewPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectNewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
