"use client";
import { cn } from "@/lib/utils";
import { ReactFCC } from "@/types/common";
import "./style.scss";
import { ReactNode } from "react";

const CARD_HEIGHT = '500px'
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
        className={cn(`flip-card ${isFlipped ? "flipped" : ""} h-[350px] lg:h-[500px]`, "")}
      >
        <div className="flip-card-inner">
          <div className="flip-card-front p-10">{renderFrontCard()}</div>
          <div className="flip-card-back p-10 overflow-y-scroll">{renderBackCard()}</div>
        </div>
      </div>
    );
  };

export default CommonFlipCard;
