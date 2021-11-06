import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CalendarDate } from '../CalendarDate';
import * as moment from 'moment-hijri';
import * as _ from 'lodash';

@Component({
  selector: 'app-date-picker-hijri',
  templateUrl: './date-picker-hijri.component.html',
  styleUrls: ['./date-picker-hijri.component.scss']
})
export class DatePickerHijriComponent implements OnInit , AfterViewInit{

  currentDate = moment().locale('ar-SA');
  dayNames = ['ا', 'أ', 'ث', 'ر', 'خ', 'ج', 'س'];
  weeks: CalendarDate[][] = [];
  sortedDates: CalendarDate[] = [];
  daysOutSideVisibleMonth:number=0
  doneFromPrevMonth:boolean = false
  calenderGenerated:boolean = false
  lastWeek:number
  today:CalendarDate
  selectedDate:CalendarDate
  @Input() selectedDates: CalendarDate[] = [];
  @Output() SelectDate = new EventEmitter<CalendarDate>();

  constructor() {
    console.log(this.currentDate)
  }

  ngOnInit(): void {
    this.generateCalendar();
  }

  ngAfterViewInit(){
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
  isToday(date: moment.Moment): boolean {
    console.log('isToday');
    return moment().isSame(moment(date), 'day');
  }

  isSelected(date: moment.Moment): boolean {
    console.log('isSelected');
    return _.findIndex(this.selectedDates, (selectedDate) => {
      return moment(date).isSame(selectedDate.mDate, 'day');
    }) > -1;
  }

  isSelectedMonth(date: moment.Moment): boolean {
    console.log('isSelectedMonth');
    if(!moment(date).isSame(this.currentDate, 'month') && this.doneFromPrevMonth){
      ++this.daysOutSideVisibleMonth
    }
    else{
      this.doneFromPrevMonth=true
    }
    return moment(date).isSame(this.currentDate, 'month');
  }

  selectDate(date: CalendarDate): void {
    console.log('selectDate');
    this.selectedDate.selected =false
    date.selected=true
    this.selectedDate =date
    this.SelectDate.emit(date);
  }

  // actions from calendar
  prevMonth(): void {
    console.log('prevMonth');
    this.currentDate = moment(this.currentDate).subtract(1, "iMonth");
    this.generateCalendar();
  }

  nextMonth(): void {
    console.log('nextMonth');
    this.currentDate = moment(this.currentDate).add(1, "iMonth");
    console.log(this.lastWeek)
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

  currentYear(){

  }

  currentMonth(){

  }

  getCurrentDay():number{
    return moment().iDate()
  }

  notSelectedMonth(){
    console.log("not")
    return moment(this.currentDate).startOf('iMonth').day();
  }

  notLastSelectedMonth(){
    return moment(this.currentDate).endOf('iMonth').day();
  }

  updateLastWeek(){
    console.log("update")
    42 - this.notSelectedMonth() - moment(this.currentDate).endOf("iMonth").iDate() >= 7 ? this.lastWeek=4 : this.lastWeek =5;
  }

  // generate the calendar grid
  generateCalendar(): void {
    console.log('generateCalendar');
    const dates = this.fillDates(this.currentDate);
    const weeks: CalendarDate[][] = [];
    while (dates.length > 0) {
      weeks.push(dates.splice(0, 7));
    }
    if(moment().isSame(moment(this.currentDate), 'month')){
      weeks[Math.trunc((this.getCurrentDay() + this.notSelectedMonth()-1)/7)][((this.getCurrentDay() + this.notSelectedMonth()-1)%7)].today=true
      weeks[Math.trunc((this.getCurrentDay() + this.notSelectedMonth()-1)/7)][((this.getCurrentDay() + this.notSelectedMonth()-1)%7)].selected=true
      this.selectedDate = weeks[Math.trunc((this.getCurrentDay() + this.notSelectedMonth()-1)/7)][((this.getCurrentDay() + this.notSelectedMonth()-1)%7)]
    }
    this.updateLastWeek()
    this.weeks = weeks;
  }

  fillDates(currentMoment: moment.Moment): CalendarDate[] {
    console.log('fillDates');
    const firstOfMonth = this.notSelectedMonth()
    const firstDayOfGrid = moment(currentMoment).startOf('iMonth').subtract(firstOfMonth, 'days');
    const start = firstDayOfGrid.date();
    return _.range(start, start + 42)
      .map((date: number): CalendarDate => {
        const d = moment(firstDayOfGrid).date(date);
        return {
          today: false,
          selected: false,
          mDate: d,
        };
      });
  }

}
