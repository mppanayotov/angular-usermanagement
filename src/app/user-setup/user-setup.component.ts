import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

export interface UserListItem {
  name: string;
  id: number;
  role: string;
  status: string;
}

const EXAMPLE_DATA: UserListItem[] = [
  { id: 1, name: 'Hydrogen', role: 'admin', status: 'active' },
  { id: 2, name: 'Helium', role: 'user', status: 'disabled' },
  { id: 3, name: 'Lithium', role: 'admin', status: 'disabled' },
  { id: 4, name: 'Beryllium', role: 'user', status: 'active' },
  { id: 5, name: 'Boron', role: 'user', status: 'active' },
  { id: 6, name: 'Carbon', role: 'user', status: 'active' },
  { id: 7, name: 'Nitrogen', role: 'user', status: 'active' },
  { id: 8, name: 'Oxygen', role: 'user', status: 'active' },
  { id: 9, name: 'Fluorine', role: 'user', status: 'active' },
  { id: 10, name: 'Neon', role: 'user', status: 'active' },
  { id: 11, name: 'Sodium', role: 'user', status: 'active' },
  { id: 12, name: 'Magnesium', role: 'user', status: 'active' },
  { id: 13, name: 'Aluminum', role: 'user', status: 'active' },
  { id: 14, name: 'Silicon', role: 'user', status: 'active' },
  { id: 15, name: 'Phosphorus', role: 'user', status: 'active' },
  { id: 16, name: 'Sulfur', role: 'user', status: 'active' },
  { id: 17, name: 'Chlorine', role: 'user', status: 'active' },
  { id: 18, name: 'Argon', role: 'user', status: 'active' },
  { id: 19, name: 'Potassium', role: 'user', status: 'active' },
  { id: 20, name: 'Calcium', role: 'user', status: 'active' },
];

@Component({
  selector: 'app-user-setup',
  templateUrl: './user-setup.component.html',
  styleUrls: ['./user-setup.component.scss'],
})
export class UserSetupComponent implements OnInit {
  user: UserListItem | undefined;

  constructor(private route: ActivatedRoute, private location: Location) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.user = EXAMPLE_DATA.find((user) => (user.id = id));
  }

  goBack(): void {
    this.location.back();
  }
}
