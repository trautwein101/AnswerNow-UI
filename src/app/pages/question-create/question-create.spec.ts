import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionCreate } from './question-create';

describe('QuestionCreate', () => {
  let component: QuestionCreate;
  let fixture: ComponentFixture<QuestionCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
