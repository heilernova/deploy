import { ApiAuth } from '@deploy/schemas/auth';
import { UserRole } from '@deploy/schemas/users';

export class Session {
    public readonly role: UserRole;
    public readonly name: string;
    public readonly token: string;

    constructor(data: ApiAuth){
        this.role = data.role;
        this.name = data.name;
        this.token = data.token;
    }
}
