import { Role } from './role';

export class User {
    /* id: number;
    username: string;
    token?: string;
    role: Role; */

    authenticationToken: string;
    refreshToken: string;
    expiresAt: Date;
    username: string;
}
