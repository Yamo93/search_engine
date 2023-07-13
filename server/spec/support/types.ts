import { Response } from 'supertest';
import { IUser } from '@entities/User';
import { ISearchResult } from '@entities/Search';


export interface IResponse extends Response {
    body: {
        users: IUser[];
        results: ISearchResult[];
        error: string;
    };
}

export interface IReqBody {
    user?: IUser;
}
