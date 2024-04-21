"use client";
import { animated, to as interpolate, useSprings } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

import { Icons } from "@/components/common/icons";
import { useState } from "react";
import { BATCH_SIZE } from "@/module/tinder/constant/tinder";
import { Batch } from "@/module/tinder/resource/modal/user";
import { useTinderStore } from "@/module/tinder/store/tinder";
import TinderCard from "@/module/tinder/components/TinderCard";

const SWIPE_THRESHOLD = 70;

const trans = (r: number, scale: number) => {
  return `perspective(150px) rotateX(0deg) rotateY(0deg) rotateZ(${
    Math.abs(r * 10) > 15 ? (r > 0 ? -15 : 15) : -r * 10
  }deg) scale(${scale})`;
};

const TinderCardStack = () => {
  const { userStackMap } = useTinderStore();
  return (
    <div className="grow h-[100px] relative">
      {Object.keys(userStackMap).map((key) => {
        return <CardStack key={key} batch={userStackMap[key]} />;
      })}
    </div>
  );
};

export default TinderCardStack;

function CardStack({ batch }: { batch: Batch }) {
  const { flip } = useTinderStore();
  const [gone] = useState(() => new Set()); // The set flags all the cards that are flicked out
  const [props, api] = useSprings(batch.users.length || BATCH_SIZE, (i) => {
    const a = {
      reset: true,
      x: 0,
      y: 0,
      scale: 1,
      rot: 0,
      delay: 0,
      from: { x: 0, rot: 0, scale: 1, y: 0, delay: 0 },
    };
    return a;
  });
  const bind = useDrag(
    ({
      args: [index],
      active,
      movement: [mx],
      direction: [xDir],
      velocity: [vx],
    }) => {
      const right = mx > 0;

      const trigger = vx > 0.1; // If you flick hard enough it should trigger the card to fly out
      if (!active && trigger) {
        gone.add(index); // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
        flip({
          userId: batch.users[index].id.toString(),
          like: right,
          batchId: batch.id,
        });
      } else if (Math.abs(mx) > SWIPE_THRESHOLD && active == false) {
        gone.add(index); // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
        flip({
          userId: batch.users[index].id.toString(),
          like: right,
          batchId: batch.id,
        });
      }

      api.start((i) => {
        if (index !== i) return; // We're only interested in changing spring-data for the current spring
        const isGone = gone.has(index);
        // console.log("swipe right: isGone", isGone);
        const x = isGone
          ? (300 + window.innerWidth) * (right ? 1 : -1)
          : active
          ? mx
          : 0; // When a card is gone it flys out left or right, otherwise goes back to zero
        const rot = mx / 100 + (isGone ? xDir * 100 * vx : 0); // How much the card tilts, flicking it harder makes it rotate faster
        const scale = active ? 1.1 : 1; // Active cards lift up a bit
        return {
          x,
          rot: active ? rot : 0,
          scale,
          delay: undefined,
          config: { friction: 50, tension: active ? 800 : isGone ? 200 : 500 },
        };
      });

      // if (!active && gone.size === cards.length) {
      //   gone.clear();
      //   api.start((i) => to(i));
      // }
    }
  );

  const move = (index: number, dir: -1 | 0 | 1) => {
    api.start((i) => {
      if (index !== i) return;
      if (dir === 0) return;

      gone.add(index); 

      const right = dir === 1;
      flip({
        userId: batch.users[index].id.toString(),
        like: right,
        batchId: batch.id,
      });
      const x = (300 + window.innerWidth) * (right ? 1 : -1);
      return {
        x,
        rot: 10,
        scale: 1.05,
        delay: 0,
        config: { friction: 50, tension: 800 },
      };
    });
  };
  return (
    <>
      {props.map(({ x, y, rot, scale }, i) => {
        return (
          <animated.div
            key={i}
            className={`absolute w-full h-full flex flex-col items-center justify-end`}
            style={{
              display: interpolate([x], () => {
                return Math.abs(x.get()) < window.innerWidth ? "block" : "none";
              }),
            }}
          >
            <div className="h-full w-full flex flex-col justify-start flex-grow relative">
              <div className="z-100 w-full h-[100px] flex flex-col items-center justify-center grow relative">
                <animated.div
                  className={`w-full h-full flex flex-col items-center justify-center grow`}
                  style={{
                    willChange: "transform",
                    touchAction: "none",
                    x,
                    y,
                    zIndex: 10000,
                  }}
                >
                  <animated.div
                    {...bind(i)}
                    style={{
                      width: "100%",
                      height: "100%",
                      color: "white",
                      borderRadius: "1.7rem",
                      transform: interpolate([rot, scale], trans),
                      background: "gray",
                      touchAction: "none",
                    }}
                    id={`card-${i}`}
                  >
                    <TinderCard
                      style={{
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url(${
                          batch.users[i] ? batch.users[i].image : ""
                        })`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "right",
                      }}
                      index={1}
                      user={batch.users[i]}
                      renderBadge={() => (
                        <>
                          <animated.div
                            style={{
                              boxShadow:
                                "rgb(109, 255, 106, 0.3) 0px 3px 12px 1px",
                              display: interpolate([x], (x) => {
                                if (x > SWIPE_THRESHOLD) return "flex";
                                return "none";
                              }),
                            }}
                            className="absolute left-[30px] rounded-lg text-[1.55rem] font-bold text-[#6DFF6A] border-[4px] border-[#6DFF6A] top-16 p-4 h-[50px] w-[100px] bg-opacity-50 align-middle items-center justify-center"
                          >
                            <p>LIKE</p>
                          </animated.div>
                          <animated.div
                            style={{
                              boxShadow:
                                "rgb(255, 78, 64, 0.4) 0px 3px 12px 1px",
                              display: interpolate([x], (x) => {
                                if (x < -SWIPE_THRESHOLD) return "flex";
                                return "none";
                              }),
                            }}
                            className="absolute right-[30px] rounded-lg text-[1.55rem] font-bold text-[#FF4E40] border-[4px] border-[#FF4E40] top-16 p-4 h-[50px] w-[100px] bg-opacity-50 align-middle items-center justify-center"
                          >
                            <p>NOPE</p>
                          </animated.div>
                        </>
                      )}
                    />
                  </animated.div>
                </animated.div>
              </div>
              <div className="z-0 h-24 w-full flex items-center gap-9 justify-center relative">
                <animated.div
                  style={{
                    transform: interpolate([x, scale], (x, scle) =>
                      x < 0 && Math.abs(x) > SWIPE_THRESHOLD
                        ? `scale(${scle})`
                        : ""
                    ),
                    borderRadius: "50%",
                    boxShadow: interpolate([x], (x) =>
                      x < 0 && Math.abs(x) > SWIPE_THRESHOLD
                        ? "rgb(255, 78, 64, 0.4) 0px 3px 12px 1px"
                        : ""
                    ),
                  }}
                  className="flex items-center justify-center relative bg-white"
                >
                  <Icons.tinderUnlike
                    onClick={() => move(i, -1)}
                    className="hover:scale-105 active:animate-[wiggle_1s_ease-in-out_infinite]"
                  />
                </animated.div>
                <Icons.tinderSuperLike className="hover:scale-105 active:animate-[wiggle_1s_ease-in-out_infinite]" />
                <animated.div
                  style={{
                    transform: interpolate([x, scale], (x, scle) =>
                      x > 0 && Math.abs(x) > SWIPE_THRESHOLD
                        ? `scale(${scle})`
                        : ""
                    ),
                    borderRadius: "50%",
                    boxShadow: interpolate([x], (x) =>
                      x > 0 && Math.abs(x) > SWIPE_THRESHOLD
                        ? "rgb(109, 255, 106, 0.3) 0px 3px 12px 1px"
                        : ""
                    ),
                  }}
                  className="flex items-center justify-center  bg-white"
                >
                  <Icons.tinderLike
                    onClick={() => move(i, 1)}
                    className="hover:scale-105 active:animate-[wiggle_1s_ease-in-out_infinite]"
                  />
                </animated.div>
              </div>
            </div>
          </animated.div>
        );
      })}
    </>
  );
}
