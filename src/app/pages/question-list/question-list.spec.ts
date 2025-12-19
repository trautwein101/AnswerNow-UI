import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionList } from './question-list';

describe('QuestionList', () => {
  let component: QuestionList;
  let fixture: ComponentFixture<QuestionList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
