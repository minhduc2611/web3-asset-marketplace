import { FlashCardModel } from "@/models/flash-card/flashCardModel";

export default class FlashCardViewer {
  constructor(cards: FlashCardModel[]) {
    this.cards = cards;
  }
cards: FlashCardModel[];
  reviewedIndexes: Set<number> = new Set();
  getRandomIndexToView(): number {
    const randomIndex = Math.floor(Math.random() * this.cards.length);
    if (this.cards.length === this.reviewedIndexes.size) {
      this.reviewedIndexes = new Set();
    }
    if (this.reviewedIndexes.has(randomIndex)) {
      return this.getRandomIndexToView();
    }
    this.reviewedIndexes.add(randomIndex);
    return randomIndex;
  }
  getPercentage(): number {
    console.log(
      this.reviewedIndexes.size,
      this.cards.length,
      (100 * this.reviewedIndexes.size) / this.cards.length
    );
    return (100 * this.reviewedIndexes.size) / this.cards.length || 0;
  }
}
