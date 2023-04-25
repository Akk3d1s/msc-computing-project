import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Store } from '@ngrx/store';
import * as UserActions from "./state/actions";
import * as UserSelectors from "./state/selectors";
import { User } from 'src/app/interfaces/user.interface';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UsersEndpoint } from 'src/app/endpoints/users.endpoint';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  title = 'Editing data using NGRX';
  displayedColumns: string[] = ['select', 'userId', 'status', 'username', 'email', 'name', 'surname', 'birthdate', 'registeredAt'];
  dataSource = new MatTableDataSource<User>([]);
  selection = new SelectionModel<User>(true, []);
  statuses: string[] = ['ACTIVE', 'PENDING', 'INACTIVE'];
  statusSelected: string = '';
  resourceSelected: string = '10';
  actionsEnabled: boolean;
  dataSourceSelection: string[] = ['10', '100', '1000', '10000', '100000'];
  private _unsubscribe$: Subject<void> = new Subject<void>();

  constructor(private readonly store: Store, private usersEndpoint: UsersEndpoint) {
  }

  ngOnInit() {
    this.store.select(UserSelectors.getUsers)
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe((users: User[]) => {
        if (users.length) {
          try {
            performance.mark('end');
            const totalMeasure = performance.measure('diff', 'start', 'end');
            const apiMeasure = performance.measure('api_diff', 'fetch_api_start', 'fetch_api_end');

            // cleanup
            performance.clearMeasures('api_diff');
            performance.clearMeasures('diff');

            performance.clearMarks('start');
            performance.clearMarks('end');
            performance.clearMarks('fetch_api_start');
            performance.clearMarks('fetch_api_end');


            // Good practices for updating logs is beyond the scope of this research, thus we will call the endpoint directly without proper state management approaches.
            this.usersEndpoint.updateLog(totalMeasure.duration - apiMeasure.duration, `fetch_${users.length}_ms`).subscribe(() => {
              this.dataSource.data = users;
            });
          } catch (e) {
            this.dataSource.data = users;
          }
        }
      });
  }

  scheduleMeasurement(): void {
    // Check measurement API is available.
    if (!window.crossOriginIsolated) {
      console.log('performance.measureUserAgentSpecificMemory() is only available in cross-origin-isolated pages');
      console.log('See https://web.dev/coop-coep/ to learn more');
      return;
    }
    // @ts-ignore
    if (!performance.measureUserAgentSpecificMemory) {
      console.log('performance.measureUserAgentSpecificMemory() is not available in this browser');
      return;
    }
    const interval = this.measurementInterval();
    console.log(`Running next memory measurement in ${Math.round(interval / 1000)} seconds`);
    setTimeout(() => this.performMeasurement(), interval);
  }

  measurementInterval(): number {
    const MEAN_INTERVAL_IN_MS = 30 * 1000;
    return -Math.log(Math.random()) * MEAN_INTERVAL_IN_MS;
  }

  async performMeasurement(): Promise<void> {
    // 1. Invoke performance.measureUserAgentSpecificMemory().
    let result;
    try {
      // @ts-ignore
      result = await performance.measureUserAgentSpecificMemory();
    } catch (error) {
      if (error instanceof DOMException && error.name === 'SecurityError') {
        console.log('The context is not secure.');
        return;
      }
      // Rethrow other errors.
      throw error;
    }
    // 2. Record the result.
    console.log('Memory usage:', result);
    this.usersEndpoint.updateLog(result.bytes, `fetch_${this.resourceSelected}_bytes`).subscribe();
    // 3. Schedule the next measurement.
    this.scheduleMeasurement();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.scheduleMeasurement();
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
    this.store.dispatch(UserActions.getUsers({amount: this.resourceSelected}));
  }

  handleStatusUpdate(): void {
    const updatedUsers = this.selection.selected.map(user => {
      return {
        ...user,
        status: this.statusSelected
      }
    });

    this.store.dispatch(UserActions.updateUsers({users: updatedUsers}));
    this.selection.clear();
    this.toggleActions();
  }

  handleDelete(): void {
    this.store.dispatch(UserActions.deleteUsers({users: this.selection.selected}));
    this.selection.clear();
    this.toggleActions();
  }
}
