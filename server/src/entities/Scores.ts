export default class Scores {
  #content: number[];
  #location: number[];
  #pageRanks: number[];

  constructor() {
    this.#content = [];
    this.#location = [];
    this.#pageRanks = [];
  }

  get content(): number[] {
      return this.#content;
  }

  get location(): number[] {
      return this.#location;
  }

  get pageRanks(): number[] {
      return this.#pageRanks;
  }
}
