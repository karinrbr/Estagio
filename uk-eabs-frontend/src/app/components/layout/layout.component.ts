import { Component, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from 'src/app/auth/session.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
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

  links = [
    {
      link: 'dashboard',
      label: 'Dashboard',
      icon: 'home_pin',
      children: [],
    },
    {
      link: 'signs',
      label: 'View Signs',
      icon: 'share_location',
      children: [
        {
          link: 'request',
          label: 'New Request',
          icon: 'add_location',
          children: [
            {
              link: 'dashboard',
              label: 'Dashboard',
              icon: 'home_pin',
              children: [],
            },
            {
              link: 'dashboard',
              label: 'Dashboard',
              icon: 'home_pin',
              children: [],
            },
            {
              link: 'dashboard',
              label: 'Dashboard',
              icon: 'home_pin',
              children: [],
            },
          ]
        },
      ],
    },
    // { link: '/agents', label: 'Agents', icon: 'manage_accounts' },
    // {
    //   link: '/signs',
    //   label: 'Work Schedule',
    //   icon: 'signpost',
    // },
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
    this.router.navigate(['agent', navItem.link], { relativeTo: this.route });
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
