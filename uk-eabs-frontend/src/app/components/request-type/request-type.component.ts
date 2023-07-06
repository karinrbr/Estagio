import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-request-type',
  templateUrl: './request-type.component.html',
  styleUrls: ['./request-type.component.scss']
})
export class RequestTypeComponent implements OnInit {
  showSelect = true;
  disableSelect = false;
  constructor(
    private readonly router: Router,
    private readonly activateRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    console.log("PORRA DO C: ", this.activateRoute.snapshot.firstChild)
    this.showSelect = this.activateRoute.snapshot.firstChild == null
  }

  handleRequestChange(value: string) {
    // console.log(value)
    this.disableSelect = true
    // this.showSelect = false
    this.router.navigate(['agent', 'request', value])
  }

}
