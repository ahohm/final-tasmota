import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
  
  {
    path: '',
    component: LoginComponent,

  },
  {
    path:'chart',
    component: FinalGaugeComponent,
        canActivate: [AuthGuard],

  },
  {
    path:'gauge',
    component: GaugeComponent,
        canActivate: [AuthGuard],

  },
  {
    path:'device-list',
    component: DeviceListComponent,
        canActivate: [AuthGuard],

  },
  {
    path: 'device-details',
    component: DeviceDetailsComponent,
        canActivate: [AuthGuard],

  },
  {
    path: 'search',
    component: SearchComponent,
        canActivate: [AuthGuard],

  },
  {
    path: 'auto-search',
    component: AutoSearchComponent,
        canActivate: [AuthGuard],

  },
  {
    path: 'add-device',
    component: AddDeviceComponent,
        canActivate: [AuthGuard],

  },
  {
    path: 'detected-device',
    component: DetectedDeviceComponent,
        canActivate: [AuthGuard],

  },
  {
    path: 'configuration',
    component: ConfigurationComponent,
        canActivate: [AuthGuard],

  },
  {
    path: 'login',
    component: LoginComponent,

  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
