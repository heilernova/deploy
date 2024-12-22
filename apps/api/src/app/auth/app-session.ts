import { ITokenAuth } from '@deploy/api/models/tokens';
export class AppSession implements ITokenAuth {
    public readonly id: string;
    public readonly role: 'admin' | 'collaborator';
    public readonly name: string;
    public readonly email: string;
    public readonly exp: Date | null;
    public readonly hostname: string;

    constructor(data: ITokenAuth){
        this.id = data.id;
        this.role = data.role;
        this.name = data.name;
        this.email = data.email;
        this.exp = data.exp;
        this.hostname = data.hostname;
    }

}