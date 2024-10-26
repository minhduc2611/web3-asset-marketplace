import { FlashCardModel } from "@/models/flash-card/flashCardModel";

export const filterAndSortDueCards = (
  cards: FlashCardModel[],
  prioritizeNoReviewTimeCard: boolean
) => {
  const currentTime = new Date();
  const dueCards = [...cards];

  //  cards without next_review_time to start introducing them into the review cycle.
  const noReviewTimeCards = dueCards.filter((card) => {
    const userCardData = card.user_card_datas[0];
    if (!userCardData) return true;
  });

  const hasReviewTimeCards = dueCards.filter((card) => {
    const userCardData = card.user_card_datas[0];
    if (!userCardData) return false;
    const next_review_time = userCardData.next_review_time;
    const interval = userCardData.interval;
    return next_review_time
      ? new Date(next_review_time)
      : new Date() <= currentTime &&
          (interval == null || (interval && interval < 1000));
  });

  hasReviewTimeCards.sort((a, b) => {
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

  // 30% possibility to show a card without next_review_time
  if (prioritizeNoReviewTimeCard) {
    return noReviewTimeCards.concat(hasReviewTimeCards);
  }
  if (hasReviewTimeCards.length === 0) {
    return noReviewTimeCards;
  }
  return hasReviewTimeCards;
};
