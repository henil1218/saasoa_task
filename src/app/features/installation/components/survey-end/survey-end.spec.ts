import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyEnd } from './survey-end';

describe('SurveyEnd', () => {
  let component: SurveyEnd;
  let fixture: ComponentFixture<SurveyEnd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyEnd],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyEnd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
