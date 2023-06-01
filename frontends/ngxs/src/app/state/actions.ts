import { User } from 'src/app/interfaces/user.interface';

export namespace Users {
    export class Get {
        static readonly type = '[App Component] Get Users';

        constructor(public amount: string) {
        }
    }

    export class Add {
        static readonly type = '[App Component] Add User';

        constructor(public user: User) {
        }
    }
}
