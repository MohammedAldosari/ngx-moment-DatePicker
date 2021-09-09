import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { DatePickerHijriComponent } from './date-picker-hijri/date-picker-hijri.component';

@NgModule({
  declarations: [
    AppComponent,
    DatePickerComponent,
    DatePickerHijriComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
