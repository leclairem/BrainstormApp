import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditIdeaPage } from './edit-idea.page';

describe('EditIdeaPage', () => {
  let component: EditIdeaPage;
  let fixture: ComponentFixture<EditIdeaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditIdeaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditIdeaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
