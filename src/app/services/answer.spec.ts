import { TestBed } from '@angular/core/testing';

import { Answer } from './answer';

describe('Answer', () => {
  let service: Answer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Answer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
