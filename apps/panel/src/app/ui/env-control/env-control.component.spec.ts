import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvControlComponent } from './env-control.component';

describe('EnvControlComponent', () => {
  let component: EnvControlComponent;
  let fixture: ComponentFixture<EnvControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
