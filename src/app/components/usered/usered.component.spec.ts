import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEdComponent } from './usered.component';

describe('UseredComponent', () => {
  let component: UserEdComponent;
  let fixture: ComponentFixture<UserEdComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserEdComponent],
    });
    fixture = TestBed.createComponent(UserEdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
