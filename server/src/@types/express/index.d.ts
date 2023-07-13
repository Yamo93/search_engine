// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IUser } from "@entities/User";
declare module 'express' {
    export interface Request  {
        body: {
            query: string,
            mode: string
        };
    }
}
