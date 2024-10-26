import { Difficulty } from "@/enum/difficulty";
import { getAuthenticatedUserId } from "@/helpers/auth";
import { FlashCardModel } from "@/models/flash-card/flashCardModel";
import { initUserCardDataModel } from "@/models/user-card-data/userCardDataModel";
import FlashCardService from "@/services/flashCard";
import UserCardDataService from "@/services/userCardData";
import { useClientAuthStore } from "@/stores/authentication";

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

    const dueCards = this.cards.filter((card) => {
      const userCardData = card.user_card_datas[0];
      if (!userCardData) return true;
      const next_review_time = userCardData.next_review_time;
      const interval = userCardData.interval;
      return next_review_time
        ? new Date(next_review_time)
        : new Date() <= currentTime &&
            (interval == null || (interval && interval < 1000));
    });
    // Step 2: Sort by next_review_time (null first -> oldest)
    // dueCards.sort((a, b) => a.next_review_time.getTime() - b.next_review_time.getTime());
    dueCards.sort((a, b) => {
      const a_userCardData = a.user_card_datas[0];
      const b_userCardData = b.user_card_datas[0];
      if (!a_userCardData) return -1;
      if (!b_userCardData) return 1;
      const a_next_review_time = a_userCardData.next_review_time;
      const b_next_review_time = b_userCardData.next_review_time;
      return a_next_review_time
        ? new Date(a_next_review_time).getTime() -
            (b_next_review_time
              ? new Date(b_next_review_time).getTime()
              : new Date().getTime())
        : -1;
    });
    nextIndex = this.cards.indexOf(dueCards[0]);
    return nextIndex;
  }
  async updateCard(index: number, difficulty: Difficulty) {
    const currentCard = this.cards[index];
    const userCardData =
      currentCard.user_card_datas[0] ||
      initUserCardDataModel(getAuthenticatedUserId() || "", currentCard.id);
    const interval = userCardData.interval || 1;
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
        newInterval = Math.ceil(interval * 1.5); // Increase by 50%
        break;
      case Difficulty.HARD:
        newInterval = Math.max(Math.ceil(interval * 0.5), 1); // Half the interval but minimum of 1 minute
        break;
      default:
        throw new Error("Invalid difficulty");
    }
    const newNextReviewTime = new Date(
      currentTime.getTime() + newInterval * 60000
    ); // Convert minutes to milliseconds

    userCardData.interval = newInterval;
    userCardData.next_review_time = newNextReviewTime.toUTCString();
    const result = await UserCardDataService.upsertOne(userCardData);
    console.log("cards[index] result.data", result.data);

    this.cards[index].user_card_datas = result.data || [];
    console.log("cards[index]", this.cards[index]);
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
