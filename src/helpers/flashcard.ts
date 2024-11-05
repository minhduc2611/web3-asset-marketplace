import { Difficulty } from "@/enum/difficulty";
import { FlashCardModel } from "@/models/flash-card/flashCardModel";
import timeUtils from "./timeUtils";

export const filterAndSortDueCards = (
  cards: FlashCardModel[],
  options: {
    prioritizeNoReviewTimeCard: boolean,
    newCardADay?: number,
  }
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

  const twoMinutesCards = hasReviewTimeCards.filter((card) => {
    const userCardData = card.user_card_datas[0];
    if (!userCardData) return false;
    const next_review_time = userCardData.next_review_time;
    return next_review_time
      ? new Date(next_review_time).getTime() - currentTime.getTime() < 120000
      : false;
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
  let result: FlashCardModel[] = twoMinutesCards;
  // 30% possibility to show a card without next_review_time
  if (options.prioritizeNoReviewTimeCard) {
    console.log("filterAndSortDueCards 1", options.prioritizeNoReviewTimeCard);
    result = noReviewTimeCards.concat(hasReviewTimeCards);
  }
  if (hasReviewTimeCards.length < 5 || twoMinutesCards.length < 4) {
    console.log("filterAndSortDueCards 2", hasReviewTimeCards.length);
    result = noReviewTimeCards;
  }
  if (noReviewTimeCards.length < 1) {
    console.log("filterAndSortDueCards 3", noReviewTimeCards.length);
    result = hasReviewTimeCards;
  }
  return {
    result,
    hasReviewTimeCards,
    noReviewTimeCards,
  };
};

export const calculateNextReviewTime = (currentInterval: number, difficulty: Difficulty) => {
  const A_DAY = 1440;
  let newInterval: number;
  const currentTime = new Date();

  switch (difficulty) {
    case Difficulty.SUPER_EASY:
      newInterval = currentInterval < A_DAY * 2 ? A_DAY * 2 : currentInterval * 2; // Double the previous interval if less than 1000
      break;
    case Difficulty.EASY:
      newInterval = currentInterval < A_DAY ? A_DAY : currentInterval * 2; // Double the previous interval if less than 1000
      break;
    case Difficulty.MEDIUM:
      newInterval = Math.ceil(currentInterval * 4);
      break;
    case Difficulty.HARD:
      newInterval = Math.max(Math.ceil(currentInterval * 0.5), 2); // Halve the previous interval
      break;
    default:
      newInterval = currentInterval; // Keep the same interval
      break;
  }

  // Calculate next review time
  const nextReviewTime = timeUtils
    .dayjs(currentTime)
    .add(newInterval, "minute")
    .format("YYYY-MM-DD HH:mm:ssZ");
    // Calculate next review time
    const { unit, timeDiffFromNow } = timeUtils.calculateTimeDiff(nextReviewTime);

    return {
      nextReviewTime,
      newInterval,
      timeDiffFromNow,
      unit,
    }
};
