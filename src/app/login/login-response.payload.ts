export interface LoginResponse {
    id: number;
    authenticationToken: string;
    refreshToken: string;
    expiresAt: Date;
    username: string;
    cid: string;
    roles: string[];
}
