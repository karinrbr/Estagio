import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  HttpClientJsonpModule,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutComponent } from './components/layout/layout.component';
import { UnderConstructionComponent } from './components/under-construction/under-construction.component';
import { SignTableComponent } from './components/sign-table/sign-table.component';
import { GoogleMapComponent } from './components/google-map/google-map.component';
import { CreateSignComponent } from './screens/create-sign/create-sign.component';
import { LoginComponent } from './auth/login/login.component';
import { ToastComponent } from './core/toaster/toast.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { GeofencingService } from './components/google-map/geofencing.service';
import { LoginPageComponent } from './screens/login-page/login-page.component';
import { LoadingSpinnerComponent } from './core/loading-spinner/loading-spinner.component';
import { NotFoundPageComponent } from './screens/not-found-page/not-found-page.component';
import { NgChartsModule } from 'ng2-charts';
import { AgentDashboardComponent } from './screens/agent-dashboard/agent-dashboard.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { DoughnutChartComponent } from './components/doughnut-chart/doughnut-chart.component';
import { LayoutAdminComponent } from './components/layout-admin/layout-admin.component';
import { SignTableAdminComponent } from './components/sign-table-admin/sign-table-admin.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { ScheduleWorkTableAdminComponent } from './components/schedule-work-table-admin/schedule-work-table-admin.component';
import { RequestTypeComponent } from './components/request-type/request-type.component';
import { CollectStraySignComponent } from './components/collect-stray-sign/collect-stray-sign.component';
import { CollectChangeSignTableComponent } from './components/collect-change-sign-table/collect-change-sign-table.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SignTableConfirmDialogComponent } from './components/sign-table-confirm-dialog/sign-table-confirm-dialog.component';
import { InvoiceGenerateAdminComponent } from './components/invoice-generate-admin/invoice-generate-admin.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { LayoutNotificationsPanelComponent } from './layout-notifications-panel/layout-notifications-panel.component';
import { DateToStringPipe } from './utils/date-to-string.pipe';
import { GoogleMapListComponent } from './components/google-map-list/google-map-list.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    LayoutAdminComponent,
    UnderConstructionComponent,
    SignTableComponent,
    GoogleMapComponent,
    CreateSignComponent,
    LoginComponent,
    ToastComponent,
    LoginPageComponent,
    LoadingSpinnerComponent,
    NotFoundPageComponent,
    AgentDashboardComponent,
    LineChartComponent,
    PieChartComponent,
    DoughnutChartComponent,
    SignTableAdminComponent,
    ScheduleWorkTableAdminComponent,
    RequestTypeComponent,
    CollectStraySignComponent,
    CollectChangeSignTableComponent,
    SignTableConfirmDialogComponent,
    InvoiceGenerateAdminComponent,
    LayoutNotificationsPanelComponent,
    DateToStringPipe,
    GoogleMapListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    MatDialogModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore())
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    GeofencingService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { 
  // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
}
