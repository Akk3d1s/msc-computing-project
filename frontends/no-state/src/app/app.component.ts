import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { User } from 'src/app/users/user.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'Editing data using OSS';
  displayedColumns: string[] = ['userId', 'status', 'username', 'email', 'name', 'surname', 'birthdate', 'registeredAt'];
  dataSource = new MatTableDataSource<User>([]);
  resourceSelected: string = '';
  dataSourceSelection: { value: string; label: string }[] = [
    {
      value: '', label: 'Select'
    },
    {
      value: '10', label: '10'
    },
    {
      value: '100', label: '100'
    },
    {
      value: '1000', label: '1000'
    },
    {
      value: '10000', label: '10000'
    },
    {
      value: '100000', label: '100000'
    }];
  action: string; // the action executed at the time.

  private _unsubscribe$: Subject<void> = new Subject<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  handleFetchingResource(): void {
    this.action = `fetch_${this.resourceSelected}`;
  }

  addUser(): void {
    this.action = 'add';
  }
}
