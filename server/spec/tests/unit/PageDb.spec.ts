import Page from '@entities/Page';
import PageDb from '@entities/PageDb';

describe('Page', () => {
  let pageDb: PageDb;
  beforeEach(() => {
    pageDb = new PageDb();
    const pages = [
      new Page('Java', [1, 2, 3, 4], []),
      new Page('Software_engineering', [1, 2, 2, 3], []),
      new Page('Software_testing', [1, 1, 1, 2], []),
    ];
    pageDb.save(pages);
  });

  describe('getIdForWord', () => {
    it('should return 1 for the first added word', () => {
      pageDb = new PageDb();
      const words = ['java', 'software'];
      const java = pageDb.getIdForWord(words[0]);
      expect(java).toBe(1);
    });

    it('should return the same id if the word is added twice', () => {
      pageDb = new PageDb();
      const words = ['java', 'software', 'java'];
      const java = pageDb.getIdForWord(words[0]);
      const anotherJava = pageDb.getIdForWord(words[2]);
      expect(java).toBe(anotherJava);
    });
  });

  describe('hasPages', () => {
    it('should return true if the db has pages', () => {
      expect(pageDb.hasPages()).toBeTrue();
    });
  });
});
