import Page from '@entities/Page';

describe('Page', () => {
  describe('constructor', () => {
    it('should set initial page rank to 1', () => {
      const page = new Page('A page', [], []);
      expect(page.pageRank).toBe(1);
    });
  });

  describe('generateWikiUrl', () => {
    it('should generate a wiki url ending', () => {
      const page = new Page('Software_engineering', [], []);
      expect(page.url).toBe('/wiki/Software_engineering');
    });
  });

  describe('getNumberOfLinks', () => {
    it('should return number of links', () => {
      const page = new Page(
        'Java',
        [],
        ['/wiki/Software_engineering', '/wiki/Software_testing']
      );
      expect(page.getNumberOfLinks()).toBe(2);
    });
  });

  describe('hasLinkTo', () => {
    it('should return true if the page has the given link', () => {
      const anotherPage = new Page('Software_engineering', [], []);
      const page = new Page('Java', [], [anotherPage.url]);
      expect(page.hasLinkTo(anotherPage)).toBeTrue();
    });
  });

  describe('getWordFrequencyFor', () => {
    it('should return the word frequency of a given word', () => {
        const words = [1, 2, 3, 2, 2];
        const page = new Page('Java', words, []);
        page.storeWordFrequencies();
        expect(page.getWordFrequencyFor(2)).toBe(3);
    });
  });
});
