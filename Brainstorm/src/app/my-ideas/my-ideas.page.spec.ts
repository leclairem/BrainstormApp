import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyIdeasPage } from './my-ideas.page';

describe('MyIdeasPage', () => {
  let component: MyIdeasPage;
  let fixture: ComponentFixture<MyIdeasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyIdeasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyIdeasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
