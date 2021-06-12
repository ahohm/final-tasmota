import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/common/footer/footer.component';
import { HeaderComponent } from './components/common/header/header.component';
import { AddDeviceComponent } from './components/content/add-device/add-device.component';
import { AutoSearchComponent } from './components/content/auto-search/auto-search.component';
import { ConfigurationComponent } from './components/content/configuration/configuration.component';
import { DetectedDeviceComponent } from './components/content/detected-device/detected-device.component';
import { DeviceDetailsComponent } from './components/content/device-details/device-details.component';
import { DeviceListComponent } from './components/content/device-list/device-list.component';
import { FinalGaugeComponent } from './components/content/final-gauge/final-gauge.component';
import { GaugeComponent } from './components/content/gauge/gauge.component';
import { LoginComponent } from './components/content/login/login.component';
import { SearchComponent } from './components/content/search/search.component';
import { authInterceptorProviders } from './_helpers/auth.interceptor';


import { GaugeChartModule } from 'angular-gauge-chart'
import { NgxGaugeModule } from 'ngx-gauge';
import { jqxKnobModule } from 'jqwidgets-ng/jqxknob';
import { jqxNumberInputModule } from 'jqwidgets-ng/jqxnumberinput';
@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    AddDeviceComponent,
    AutoSearchComponent,
    ConfigurationComponent,
    DetectedDeviceComponent,
    DeviceDetailsComponent,
    DeviceListComponent,
    FinalGaugeComponent,
    GaugeComponent,
    LoginComponent,
    SearchComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,

    NgbModule,
    ToastrModule.forRoot(),
    jqxKnobModule,
    jqxNumberInputModule,
    NgxGaugeModule,
    GaugeChartModule
  ],
  providers: [authInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
