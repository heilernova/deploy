import { ITokenAuth, TokensService } from '@deploy/api/models/tokens';
import { getService } from '../utils/get-service';
export class AppSession implements ITokenAuth {
    public readonly id: string;
    public readonly role: 'admin' | 'collaborator';
    public readonly name: string;
    public readonly email: string;
    public readonly exp: Date | null;
    public readonly hostname: string;
    public readonly token: string;
    public readonly type: "cli" | "web"

    constructor(data: ITokenAuth&{ token: string, type: "cli" | "web" }){
        this.id = data.id;
        this.role = data.role;
        this.name = data.name;
        this.email = data.email;
        this.exp = data.exp;
        this.hostname = data.hostname;
        this.token = data.token;
        this.type = data.type;
    }

    public async keepSessionOpen(): Promise<void> {
        const s = await getService(TokensService);
        await s.update(this.token, { exp: null });
    }
}