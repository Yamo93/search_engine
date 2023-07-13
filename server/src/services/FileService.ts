import path, { resolve } from 'path';
import { promises } from 'fs';
import Page from '@entities/Page';
import PageDb from '@entities/PageDb';

class FilePath {
  contentFilePath: string;
  linkFilePath: string;

  constructor(contentFilePath = '', linkFilePath = '') {
    this.contentFilePath = contentFilePath;
    this.linkFilePath = linkFilePath;
  }

  public setContentFilePath(path: string) {
    this.contentFilePath = path;
  }

  public setLinkFilePath(path: string) {
    this.linkFilePath = path;
  }
}

export interface Row {
  [key: string]: string;
}

export default class FileService {
  #directoryPath: string;
  #linkDirectoryPath: string;
  #filePaths: Map<string, FilePath>;
  #pageDb: PageDb;

  constructor(pageDb: PageDb) {
    this.#pageDb = pageDb;
    this.#directoryPath = path.join(
      __dirname,
      '..',
      'data',
      'wikipedia',
      'Words'
    );
    this.#linkDirectoryPath = path.join(
      __dirname,
      '..',
      'data',
      'wikipedia',
      'Links'
    );
    this.#filePaths = new Map<string, FilePath>();
  }
  private async *getFiles(dir: string): AsyncGenerator<string> {
    // https://stackoverflow.com/questions/5827612/
    // node-js-fs-readdir-recursive-directory-search/45130990#45130990
    const entries = await promises.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const res = resolve(dir, entry.name);
      if (entry.isDirectory()) {
        yield* this.getFiles(res);
      } else {
        yield res;
      }
    }
  }

  private addContentFilePath(fileName: string, contentFilePath: string) {
    let filePath = this.#filePaths.get(fileName);
    if (filePath) {
      filePath.setContentFilePath(contentFilePath);
    } else {
      filePath = new FilePath(contentFilePath);
      this.#filePaths.set(fileName, filePath);
    }
  }

  private addLinkFilePath(fileName: string, linkFilePath: string) {
    let filePath = this.#filePaths.get(fileName);
    if (filePath) {
      filePath.setLinkFilePath(linkFilePath);
    } else {
      filePath = new FilePath(linkFilePath);
      this.#filePaths.set(fileName, filePath);
    }
  }

  private async collectContentFilePaths() {
    for await (const filePath of this.getFiles(this.#directoryPath)) {
      const fileName = this.getFileName(filePath);
      this.addContentFilePath(fileName, filePath);
    }
  }

  private async collectLinkFilePaths() {
    for await (const filePath of this.getFiles(this.#linkDirectoryPath)) {
      const fileName = this.getFileName(filePath);
      this.addLinkFilePath(fileName, filePath);
    }
  }

  private async getWordIds(filePath: FilePath): Promise<number[]> {
    const contentFilePath = filePath.contentFilePath;
    const contentFile = await promises.readFile(contentFilePath);
    // collect raw words
    const rawWords = contentFile.toString().split(' ');
    // map words to integers
    const words: number[] = [];
    for (const rawWord of rawWords) {
      const word = this.#pageDb.getIdForWord(rawWord);
      words.push(word);
    }
    return words;
  }

  private async getLinks(filePath: FilePath): Promise<string[]> {
    // collect links
    const linkFilePath = filePath.linkFilePath;
    const linkFile = await promises.readFile(linkFilePath);
    const links = linkFile
      .toString()
      .split('\n')
      .filter((link) => Boolean(link));
    return links;
  }

  async readPages(pageDb: PageDb): Promise<Page[]> {
    // if db already has the pages, return them
    if (pageDb.hasPages()) {
      return pageDb.pages;
    }

    // collect file paths
    await this.collectContentFilePaths();
    await this.collectLinkFilePaths();

    // read files
    const pages: Page[] = [];
    for (const [fileName, filePath] of this.#filePaths.entries()) {
      const wordIds = await this.getWordIds(filePath);
      const links = await this.getLinks(filePath);
      const page = new Page(fileName, wordIds, links);
      pages.push(page);
    }

    // cache the results in memory for future searches
    pageDb.save(pages);

    return pages;
  }

  private getFileName(filePath: string) {
    return path.basename(filePath);
  }
}
