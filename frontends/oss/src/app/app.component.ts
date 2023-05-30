import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { UsersStore } from 'src/app/users/users.store';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/users/user.interface';
import { UsersEndpoint } from 'src/app/users/users.endpoint';

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
  action: string; // the action executed at the time.

  private _unsubscribe$: Subject<void> = new Subject<void>();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private usersStore: UsersStore, private usersEndpoint: UsersEndpoint) {
  }

  ngOnInit(): void {
    this.usersStore.state$
      .pipe(takeUntil(this._unsubscribe$))
      .subscribe(({users}) => {
        if (users.length) {
          try {
            // @TODO - add marks and measures for Updates
            // @TODO - add marks and measures for Deletes
            // @TODO - maybe for marks and measures we can re-use the same for all actions?
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
            this.usersEndpoint.updateLog(totalMeasure.duration - apiMeasure.duration, this.action).subscribe(response => {
              this.dataSource.data = users;
            });
          } catch(e) {
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
    this.usersEndpoint.updateLog(result.bytes, `${this.action}_bytes`).subscribe();
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
    this.action = `fetch_${this.resourceSelected}`;
    performance.mark('start');
    this.usersStore.getUsers(this.resourceSelected);
  }

  handleStatusUpdate(): void {
    this.action = `update_${this.resourceSelected}`;
    const updatedUsers = this.selection.selected.map(user => {
        return {
          ...user,
          status: this.statusSelected
        }
      });

    this.selection.clear();
    this.toggleActions();

    performance.mark('start');
    this.usersStore.updateUsers(updatedUsers);
  }

  handleDelete(): void {
    this.action = `delete_${this.resourceSelected}`;
    const toBeDeleted = [
      ...this.selection.selected
    ]
    this.selection.clear();
    this.toggleActions();

    performance.mark('start');
    this.usersStore.deleteUsers(toBeDeleted)
  }
}
