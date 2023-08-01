import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { map } from 'rxjs'


import { UserData } from 'src/app/interfaces/user-data.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  filterValue!: string;
  dataSource!: UserData;
  pageEvent!: PageEvent;
  displayedColumns = [
    '_id',
    'name',
    'username',
    'email',
    'role'
  ];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.initDataSource();
  }

  initDataSource() {
    this.userService.findAll(1, 10).pipe(
      map((userData: UserData) => this.dataSource = userData)
    ).subscribe()
  }

  onPaginateChange(event: PageEvent) {
    let page = event.pageIndex + 1;
    let size = event.pageSize;

    if(!this.filterValue) {
      this.userService.findAll(page, size).pipe(
        map((userData: UserData) => this.dataSource = userData)
      ).subscribe();
    }
    else {
      this.userService.paginateByName(page, size, this.filterValue).pipe(
        map((userData: UserData) => this.dataSource = userData)
      ).subscribe();
    }

  }

  findByName(userName: string) {
    this.userService.paginateByName(0, 10, userName).pipe(
      map((userData: UserData) => this.dataSource = userData)
    ).subscribe();
  }
}
