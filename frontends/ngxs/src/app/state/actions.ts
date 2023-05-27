import { User } from 'src/app/interfaces/user.interface';

export namespace Users {
    export class Get {
        static readonly type = '[App Component] Get Users';

        constructor(public amount: string) {
        }
    }

    export class Update {
        static readonly type = '[App Component] Update Users';

        constructor(public users: User[]) {
        }
    }

    export class Delete {
        static readonly type = '[App Component] Delete Users';

        constructor(public users: User[]) {
        }
    }
}
