import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserSetupPageComponent } from './user-setup-page.component';

describe('UserSetupPageComponent', () => {
  let component: UserSetupPageComponent;
  let fixture: ComponentFixture<UserSetupPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserSetupPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserSetupPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
