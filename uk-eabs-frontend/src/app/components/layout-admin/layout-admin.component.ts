import { Component, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from 'src/app/auth/session.service';

interface Link {
  link: string;
  label: string;
  icon: string;
  children?: Link[];
}

@Component({
  selector: 'app-layout',
  templateUrl: './layout-admin.component.html',
  styleUrls: ['./layout-admin.component.scss'],
})
export class LayoutAdminComponent implements OnInit {
  username: string = '';
  chatBadgeisHidden: boolean = false;
  notificationBadgeisHidden: boolean = false;

  menu = [
    {
      link: 'admin/dashboard',
      label: 'Upload',
      icon: '../../assets/icons/dashboard.svg',
      iconSelected: '../../assets/icons/dashboard-selected.svg',
      selected: true,
    },
    // {
    //   link: 'admin/business',
    //   label: 'Execute',
    //   icon: '../../assets/icons/business.svg',
    //   iconSelected: '../../assets/icons/business-selected.svg',
    //   selected: false,
    // },
    // {
    //   link: 'admin/freelancers',
    //   label: 'Freelancers',
    //   icon: '../../assets/icons/freelancers.svg',
    //   iconSelected: '../../assets/icons/freelancers-selected.svg',
    //   selected: false,
    // },
    // {
    //   link: 'admin/companies',
    //   label: 'Companies',
    //   icon: '../../assets/icons/companies.svg',
    //   iconSelected: '../../assets/icons/companies-selected.svg',
    //   selected: false,
    // },
    // {
    //   link: 'admin/payments',
    //   label: 'Payments',
    //   icon: '../../assets/icons/payments.svg',
    //   iconSelected: '../../assets/icons/payments-selected.svg',
    //   selected: false,
    // },
  ];

  options = {
    bottom: 0,
    fixed: true,
    top: 0,
  };

  links: Link[] = [
    {
      link: 'dashboard',
      label: 'Dashboard',
      icon: 'home_pin',
    },
    {
      link: 'signs',
      label: 'Signs',
      icon: 'free_cancellation',
    },
    {
      link: 'schedule',
      label: 'Schedule',
      icon: 'event_upcoming',
    },
    {
      link: 'complete-work',
      label: 'Work',
      icon: 'event_available',
    },
    {
      link: 'invoice',
      label: 'Invoice',
      icon: 'receipt_long',
    }
  ];

  // private router: Router;
  // private route: ActivatedRoute;

  constructor(
    private router: Router, // private session: SessionService,
    private route: ActivatedRoute,
    private sessionService: SessionService
  ) {
    this.router = router;
    this.route = route;
  }

  ngOnInit(): void {
    let userLogged = this.sessionService.getUser();
    this.username = userLogged.name ?? '';
  }

  toogleNavMenu(sidenav: MatSidenav) {
    sidenav.toggle();
  }

  showInfo(navItem: any) {
    this.router.navigate(['admin', navItem.link], { relativeTo: this.route });
  }

  selectItem(item: any) {
    this.menu.forEach(elem => {
      elem.selected = false;
    });
    item.selected = true;
    this.router.navigate([item.link]);
  }

  logout() {
    this.sessionService.logout().subscribe(
      user => {
        this.router.navigate(['login']);
      },
      err => {
        alert('Something went wrong! Please try again later.');
      }
    );
  }

  toggleChatBadgeVisibility() {
    this.chatBadgeisHidden = !this.chatBadgeisHidden;
  }

  toggleNotificationBadgeVisibility() {
    this.notificationBadgeisHidden = !this.notificationBadgeisHidden;
  }
}
