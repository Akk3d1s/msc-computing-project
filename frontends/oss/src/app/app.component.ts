import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { UsersStore } from 'src/app/users/users.store';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/users/user.interface';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, status: 'ACTIVE', name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, status: 'ACTIVE', name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, status: 'PENDING', name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, status: 'INACTIVE', name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, status: 'ACTIVE', name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, status: 'ACTIVE', name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, status: 'ACTIVE', name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, status: 'ACTIVE', name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, status: 'ACTIVE', name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, status: 'ACTIVE', name: 'Neon', weight: 20.1797, symbol: 'Ne'},
  {position: 11, status: 'ACTIVE', name: 'Sodium', weight: 22.9897, symbol: 'Na'},
  {position: 12, status: 'ACTIVE', name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
  {position: 13, status: 'ACTIVE', name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
  {position: 14, status: 'ACTIVE', name: 'Silicon', weight: 28.0855, symbol: 'Si'},
  {position: 15, status: 'ACTIVE', name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
  {position: 16, status: 'ACTIVE', name: 'Sulfur', weight: 32.065, symbol: 'S'},
  {position: 17, status: 'ACTIVE', name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
  {position: 18, status: 'ACTIVE', name: 'Argon', weight: 39.948, symbol: 'Ar'},
  {position: 19, status: 'ACTIVE', name: 'Potassium', weight: 39.0983, symbol: 'K'},
  {position: 20, status: 'ACTIVE', name: 'Calcium', weight: 40.078, symbol: 'Ca'},
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  title = 'Editing data using OSS';
  displayedColumns: string[] = ['select', 'userId', 'status', 'username', 'email', 'name', 'surname', 'birthdate', 'registeredAt'];
  dataSource = new MatTableDataSource<User>([]);
  selection = new SelectionModel<User>(true, []);
  statuses: string[] = ['ACTIVE', 'PENDING', 'INACTIVE'];
  statusSelected: string = '';
  resourceSelected: string = '10';
  actionsEnabled: boolean;
  dataSourceSelection: string[] = ['10', '100', '1000', '10000', '100000'];

  private _unsubscribe$: Subject<void> = new Subject<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private usersStore: UsersStore) {
  }

  ngOnInit(): void {
    this.usersStore.state$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(({users}) => {
        if (users.length) {
          performance.mark('end');
          const totalMeasure = performance.measure('diff', 'start', 'end');
          const apiMeasure = performance.measure('api_diff', 'fetch_api_start', 'fetch_api_end');
          this.dataSource.data = users;

          setTimeout(() => {
            alert(`Duration:  ${totalMeasure.duration - apiMeasure.duration} milliseconds`);
          })
        }
      });
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this._unsubscribe$.next();
    this._unsubscribe$.complete();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** Show/hide actions on top of table. */
  toggleActions(): void {
    this.actionsEnabled = !!this.selection.selected.length;

    if (!this.actionsEnabled) {
      this.statusSelected = ''; // restore status selection to default.
    }
  }

  handleFetchingResource(): void {
    performance.mark('start');
    this.usersStore.getUsers(this.resourceSelected);
  }

  handleStatusUpdate(): void {
    const updatedUsers = this.selection.selected.map(user => {
        return {
          ...user,
          status: this.statusSelected
        }
      });

    this.usersStore.updateUsers(updatedUsers);
    this.selection.clear();
    this.toggleActions();
  }

  handleDelete(): void {
    this.usersStore.deleteUsers(this.selection.selected)
    this.selection.clear();
    this.toggleActions();
  }
}
