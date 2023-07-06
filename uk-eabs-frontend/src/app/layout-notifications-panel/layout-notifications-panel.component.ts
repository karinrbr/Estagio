import { Component } from '@angular/core';

@Component({
  selector: 'app-layout-notifications-panel',
  templateUrl: './layout-notifications-panel.component.html',
  styleUrls: ['./layout-notifications-panel.component.scss']
})
export class LayoutNotificationsPanelComponent {
  notifications = [{
    subject: 'Subject 1',
    body: 'body 1',
    param: 'someEncryptedString'
  }, {
    subject: 'Subject 2',
    body: 'body 2',
    param: 'someEncryptedString'
  }, {
    subject: 'Subject 3',
    body: 'body 3',
    param: 'someEncryptedString'
  }];
}
