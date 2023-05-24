import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { UsersEntity } from '../+state/users.models';
import { selectAllUsers } from '../+state/users.selectors';

@Component({
  selector: 'angular-usermanagement-user-setup',
  templateUrl: './user-setup.component.html',
  styleUrls: ['./user-setup.component.scss'],
})
export class UserSetupComponent implements OnInit {
  users$ = this.store.select(selectAllUsers);
  user?: UsersEntity;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.users$.subscribe((users) => {
      this.user = users.find((user) => user.id == id);
    });
  }

  goBack(): void {
    this.location.back();
  }
}
