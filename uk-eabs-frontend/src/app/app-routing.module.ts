import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GoogleMapsModule } from '@angular/google-maps';

import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatStepperModule } from '@angular/material/stepper';
import { MatRadioModule } from '@angular/material/radio';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';

import { LayoutComponent } from './components/layout/layout.component';
import { UnderConstructionComponent } from './components/under-construction/under-construction.component';
import { SignTableComponent } from './components/sign-table/sign-table.component';
import { CreateSignComponent } from './screens/create-sign/create-sign.component';

import { AuthGuard } from './auth/auth.guard';
import { LoginPageComponent } from './screens/login-page/login-page.component';
import { NotFoundPageComponent } from './screens/not-found-page/not-found-page.component';
import { AgentDashboardComponent } from './screens/agent-dashboard/agent-dashboard.component';
import { LayoutAdminComponent } from './components/layout-admin/layout-admin.component';
import { SignTableAdminComponent } from './components/sign-table-admin/sign-table-admin.component';
import { AppComponent } from './app.component';
import { ScheduleWorkTableAdminComponent } from './components/schedule-work-table-admin/schedule-work-table-admin.component';
import { RequestTypeComponent } from './components/request-type/request-type.component';
import { CollectStraySignComponent } from './components/collect-stray-sign/collect-stray-sign.component';
import { CollectChangeSignTableComponent } from './components/collect-change-sign-table/collect-change-sign-table.component';
import { InvoiceGenerateAdminComponent } from './components/invoice-generate-admin/invoice-generate-admin.component';

const routes: Routes = [
  { path: '404', component: NotFoundPageComponent },
  { path: 'login', component: LoginPageComponent },
  {
    path: '',
    component: AppComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    // runGuardsAndResolvers: 'always',
    children: [
      {
        path: 'admin',
        component: LayoutAdminComponent,
        children: [
          {
            path: 'dashboard',
            children: [
              {
                path: '',
                component: AgentDashboardComponent,
              },
            ],
          },
          {
            path: 'signs',
            component: SignTableAdminComponent,
          },
          {
            path: 'schedule',
            component: ScheduleWorkTableAdminComponent,
          },
          {
            path: 'complete-work',
            component: SignTableAdminComponent,
          },
          {
            path: 'invoice',
            component: InvoiceGenerateAdminComponent,
          },
        ],
      },
      {
        path: 'agent',
        component: LayoutComponent,
        children: [
          {
            path: 'dashboard',
            children: [
              {
                path: '',
                component: AgentDashboardComponent,
              },
            ],
          },
          {
            path: 'request',
            canActivate: [AuthGuard],
            canActivateChild: [AuthGuard],
            component: RequestTypeComponent,
            children: [
              {
                path: 'sign',
                component: CreateSignComponent,
              },
              {
                path: 'sign/:id',
                component: CreateSignComponent,
              },
              {
                path: 'collect',
                component: CollectStraySignComponent
              },
              {
                path: 'change-table',
                component: CollectChangeSignTableComponent
              }
            ]
          },
          {
            path: 'signs',
            component: SignTableComponent,
          },
        ],
      },
      {
        path: 'wip',
        component: UnderConstructionComponent,
        canActivate: [AuthGuard],
        // runGuardsAndResolvers: 'always',
        children: [],
      },
    ],
  },
  { path: '**', redirectTo: '404' },
  { path: '', redirectTo: '404', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'ignore',
      enableTracing: false,
    }),
    GoogleMapsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  exports: [
    RouterModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatProgressBarModule,
    MatChipsModule,
    GoogleMapsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatDatepickerModule,
    DragDropModule,
    MatStepperModule,
    MatRadioModule,
    MatMenuModule,
  ],
})
export class AppRoutingModule { }
