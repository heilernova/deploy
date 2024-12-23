import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawerUserMenuComponent } from './drawer-user-menu.component';

describe('DrawerUserMenuComponent', () => {
  let component: DrawerUserMenuComponent;
  let fixture: ComponentFixture<DrawerUserMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawerUserMenuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrawerUserMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
