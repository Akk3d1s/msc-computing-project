import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngrx/store';
import * as UserActions from './state/actions';
import * as UserSelectors from './state/selectors';
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

                        if (this.action === 'add') {
                            // cleanup
                            performance.clearMeasures('diff');

                            performance.clearMarks('start');
                            performance.clearMarks('end');


                            this.usersEndpoint.updateLog(totalMeasure.duration, this.action).subscribe(() => {
                                this.dataSource.data = users;
                            });
                        } else {
                            const apiMeasure = performance.measure('api_diff', 'fetch_api_start', 'fetch_api_end');

                            // cleanup
                            performance.clearMeasures('api_diff');
                            performance.clearMeasures('diff');

                            performance.clearMarks('start');
                            performance.clearMarks('end');
                            performance.clearMarks('fetch_api_start');
                            performance.clearMarks('fetch_api_end');


                            this.usersEndpoint.updateLog(totalMeasure.duration - apiMeasure.duration, this.action).subscribe(() => {
                                this.dataSource.data = users;
                            });
                        }
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

    handleFetchingResource(): void {
        if (this.resourceSelected) {
            this.action = `fetch_${this.resourceSelected}`;
            performance.mark('start');
            this.store.dispatch(UserActions.getUsers({ amount: this.resourceSelected }));
        }
    }

    addUser(): void {
        this.action = 'add';

        const user: User = {
            userId: this.generateUUID(),
            status: 'PENDING',
            username: 'test-user',
            email: 'test@mail.com',
            name: 'John',
            surname: 'Doe',
            birthdate: '1980-01-01',
            registeredAt: this.getRegisteredDate()
        };

        performance.mark('start');
        this.store.dispatch(UserActions.addUser(user));
    }

    private generateUUID() {
        const hexDigits = '0123456789abcdef';
        let uuid = '';

        for (let i = 0; i < 36; i++) {
            if (i === 8 || i === 13 || i === 18 || i === 23) {
                uuid += '-';
            } else if (i === 14) {
                uuid += '4';
            } else if (i === 19) {
                uuid += hexDigits[(Math.random() * 4 | 8)];
            } else {
                uuid += hexDigits[(Math.random() * 16) | 0];
            }
        }

        return uuid;
    }

    private getRegisteredDate(): string {
        const currentDate = new Date();
        return currentDate.toISOString();
    }
}
