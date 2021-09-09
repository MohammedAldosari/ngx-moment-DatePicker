import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CalendarDate } from '../CalendarDate';
import * as moment from 'moment-hijri';
import * as _ from 'lodash';

@Component({
  selector: 'app-date-picker-hijri',
  templateUrl: './date-picker-hijri.component.html',
  styleUrls: ['./date-picker-hijri.component.scss']
})
export class DatePickerHijriComponent implements OnInit {

  currentDate = moment();
  dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  weeks: CalendarDate[][] = [];
  sortedDates: CalendarDate[] = [];

  @Input() selectedDates: CalendarDate[] = [];
  @Output() SelectDate = new EventEmitter<CalendarDate>();

  constructor() {

  }

  ngOnInit(): void {
    this.generateCalendar();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges');
    if (changes.selectedDates &&
      changes.selectedDates.currentValue &&
      changes.selectedDates.currentValue.length > 1) {
      // sort on date changes for better performance when range checking
      this.sortedDates = _.sortBy(changes.selectedDates.currentValue, (m: CalendarDate) => m.mDate.valueOf());
      this.generateCalendar();
    }
  }

  // date checkers
  isToday(date: moment.hMoment): boolean {
    console.log('isToday');
    return moment().isSame(moment(date), 'day');
  }

  isSelected(date: moment.hMoment): boolean {
    console.log('isSelected');
    return _.findIndex(this.selectedDates, (selectedDate) => {
      return moment(date).isSame(selectedDate.mDate, 'day');
    }) > -1;
  }

  isSelectedMonth(date: moment.hMoment): boolean {
    console.log('isSelectedMonth');
    return moment(date).isSame(this.currentDate, 'month');
  }

  selectDate(date: CalendarDate): void {
    console.log('selectDate');
    this.SelectDate.emit(date);
  }

  // actions from calendar
  prevMonth(): void {
    console.log('prevMonth');
    this.currentDate = moment(this.currentDate).subtract(1, 'iMonths');
    this.generateCalendar();
  }

  nextMonth(): void {
    console.log('nextMonth');
    this.currentDate = moment(this.currentDate).add(1, 'iMonths');
    this.generateCalendar();
  }

  firstMonth(): void {
    console.log('firstMonth');
    this.currentDate = moment(this.currentDate).startOf('iYear');
    this.generateCalendar();
  }

  lastMonth(): void {
    console.log('lastMonth');
    this.currentDate = moment(this.currentDate).endOf('iYear');
    this.generateCalendar();
  }

  prevYear(): void {
    console.log('prevYear');
    this.currentDate = moment(this.currentDate).subtract(1, 'iYear');
    this.generateCalendar();
  }

  nextYear(): void {
    console.log('nextYear');
    this.currentDate = moment(this.currentDate).add(1, 'iYear');
    this.generateCalendar();
  }

  // generate the calendar grid
  generateCalendar(): void {
    console.log('generateCalendar');
    const dates = this.fillDates(this.currentDate);
    const weeks: CalendarDate[][] = [];
    while (dates.length > 0) {
      weeks.push(dates.splice(0, 7));
    }
    this.weeks = weeks;
  }

  fillDates(currentMoment: moment.hMoment): CalendarDate[] {
    console.log('fillDates');
    const firstOfMonth = moment(currentMoment).startOf('month').day();
    const firstDayOfGrid = moment(currentMoment).startOf('month').subtract(firstOfMonth, 'days');
    const start = firstDayOfGrid.date();
    return _.range(start, start + 42)
      .map((date: number): CalendarDate => {
        const d = moment(firstDayOfGrid).date(date);
        return {
          today: this.isToday(d),
          selected: this.isSelected(d),
          mDate: d,
        };
      });
  }

}
