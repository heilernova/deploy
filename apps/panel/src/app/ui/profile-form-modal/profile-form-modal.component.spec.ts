import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileFormModalComponent } from './profile-form-modal.component';

describe('ProfileFormModalComponent', () => {
  let component: ProfileFormModalComponent;
  let fixture: ComponentFixture<ProfileFormModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileFormModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
