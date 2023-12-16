"use client";
import { cn } from "@/lib/utils";
import { ReactFCC } from "@/types/common";
import "./style.scss";
import { ReactNode } from "react";

const CommonFlipCard: ReactFCC<{
  isFlipped: boolean;
  setIsFlipped: (e: boolean) => void;
  renderFrontCard: () => ReactNode;
  renderBackCard: () => ReactNode;
}> = ({
  isFlipped,
  setIsFlipped,
  renderFrontCard,
  renderBackCard,
  children,
}) => {
  return (
    <div
      onClick={() => setIsFlipped(!isFlipped)}
      className={cn(`flip-card ${isFlipped ? "flipped" : ""}`, "")}
    >
      <div className="flip-card-inner">
        <div className="flip-card-front ">{renderFrontCard()}</div>
        <div className="flip-card-back">{renderBackCard()}</div>
      </div>
    </div>
  );
};

export default CommonFlipCard;
