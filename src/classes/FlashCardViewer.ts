import { Difficulty } from "@/enum/difficulty";
import { FlashCardModel } from "@/models/flash-card/flashCardModel";
import FlashCardService from "@/services/flashCard";

export default class FlashCardViewer {
  constructor(cards: FlashCardModel[]) {
    this.cards = cards;
  }
  cards: FlashCardModel[];
  reviewedIndexes: Set<number> = new Set();
  // currentIndex: number = 0;
  getNextIndexToView(): number {
    let nextIndex = 0;
    // Step 1: Filter cards that are due for review (next_review_time <= current time)
    // const dueCards = cards.filter(card => card.next_review_time <= currentTime);
    const currentTime = new Date();

    const dueCards = this.cards.filter((card) =>
      card.next_review_time
        ? new Date(card.next_review_time)
        : new Date() <= currentTime &&
          (card.interval == null || (card.interval && card.interval < 1000))
    );
    // Step 2: Sort by next_review_time (null first -> oldest)
    // dueCards.sort((a, b) => a.next_review_time.getTime() - b.next_review_time.getTime());
    dueCards.sort((a, b) =>
      a.next_review_time
        ? new Date(a.next_review_time).getTime() -
          (b.next_review_time
            ? new Date(b.next_review_time).getTime()
            : new Date().getTime())
        : -1
    );
    console.log("dueCards", dueCards.length, dueCards);
    nextIndex = this.cards.indexOf(dueCards[0]);
    return nextIndex;
  }
  async updateCard(index: number, difficulty: Difficulty) {
    const currentCard = this.cards[index];
    const interval = currentCard.interval || 1;
    const currentTime = new Date();
    let newInterval: number;

    // Base interval multiplier logic
    switch (difficulty) {
      case Difficulty.SUPER_EASY:
        newInterval = interval < 1000 ? 1440 : interval * 2; // Double the previous interval if less than 1000
        break;
      case Difficulty.EASY:
        newInterval = interval * 2; // Double the previous interval
        break;
      case Difficulty.MEDIUM:
        newInterval = interval * 1.5; // Increase by 50%
        break;
      case Difficulty.HARD:
        newInterval = Math.max(interval * 0.5, 1); // Half the interval but minimum of 1 minute
        break;
      default:
        throw new Error("Invalid difficulty");
    }
    const newNextReviewTime = new Date(
      currentTime.getTime() + newInterval * 60000
    ); // Convert minutes to milliseconds

    currentCard.interval = newInterval;
    currentCard.next_review_time = newNextReviewTime.toUTCString();
    await FlashCardService.updateOne(currentCard);
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
