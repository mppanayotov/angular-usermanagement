import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loadUsersSuccess } from './+state/users.actions';
import { UsersService } from './services/users.service';

@Component({
  selector: 'angular-usermanagement-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'angular-usermanagement';

  constructor(private usersService: UsersService, private store: Store) {}

  ngOnInit() {
    this.usersService
      .getUsers()
      .subscribe((users) => this.store.dispatch(loadUsersSuccess({ users })));
  }
}
