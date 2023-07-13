import supertest from 'supertest';
import StatusCodes from 'http-status-codes';
import { SuperTest, Test } from 'supertest';

import app from '@server';
import { pErr } from '@shared/functions';
import { IResponse } from '../../support/types';
import { ISearchResult } from '@entities/Search';

describe('Search Routes', () => {
  const searchPath = '/api/search/search';

  const { BAD_REQUEST, OK } = StatusCodes;
  let agent: SuperTest<Test>;

  beforeAll((done) => {
    agent = supertest.agent(app);
    done();
  });

  describe(`POST:${searchPath}`, () => {
    it('should throw error if no query is provided', (done) => {
      agent.post(searchPath)
      .send({ query: '', mode: 'basic' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .end((err: Error, res: IResponse) => {
        pErr(err);
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body.results).toBeUndefined();
        done();
      });
    });
  });

  describe(`POST:${searchPath}`, () => {
    it('should throw error if mode is basic and query contains more than one word', (done) => {
      agent.post(searchPath)
      .send({ query: 'java programming', mode: 'basic' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .end((err: Error, res: IResponse) => {
        pErr(err);
        expect(res.status).toBe(BAD_REQUEST);
        expect(res.body.results).toBeUndefined();
        done();
      });
    });
  });

  describe(`POST:${searchPath}`, () => {
    it('should return a list for query "java" and mode "basic"', (done) => {
      agent.post(searchPath)
      .send({ query: 'java', mode: 'basic' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .end((err: Error, res: IResponse) => {
        pErr(err);
        expect(res.status).toBe(OK);
        // cast instance objects to SearchResult objects
        const actualResults: ISearchResult[] = res.body.results;
        expect(actualResults).toEqual([]);
        expect(res.body.error).toBeUndefined();
        done();
      });
    });
  });
});
