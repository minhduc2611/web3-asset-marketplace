"use client";
import { useDrag } from "@use-gesture/react";
import { useSprings, animated, to as interpolate } from "@react-spring/web";

import { useTinderStore } from "../store/tinder";
import TinderCard from "./TinderCard";
import { useState } from "react";
import { move } from "formik";
import { BATCH_SIZE } from "../constant/tinder";
// These two are just helpers, they curate spring data, values that are later being interpolated into css
const to = (i: number) => {
  return {
    x: 0,
    y: 0,
    scale: 1,
    rot: i,
    delay: i,
  };
};
const from = (_i: number) => {
  return { x: 0, rot: 0, scale: 1, y: 0 };
};
const trans = (r: number, scale: number) => {
  console.log('trans r', r);
  console.log('trans Math.abs(r * 10)', Math.abs(r * 10));
  return `perspective(150px) rotateX(0deg) rotateY(0deg) rotateZ(${
    Math.abs(r * 10) > 15 ? (r > 0 ? -15 : 15) : -r * 10
  }deg) scale(${scale})`;
};

const CardStack = () => {
  return (
    <div className="grow h-[100px] relative">
      <Deck />
    </div>
  );
};

export default CardStack;

function Deck() {
  const { flip, userStack } = useTinderStore();
  const [gone] = useState(() => new Set()); // The set flags all the cards that are flicked out
  const [props, api] = useSprings(BATCH_SIZE, (i) => {
    const a = {
      reset: true,
      ...to(i),
      from: from(i),
    };
    console.log('useSprings config a', a);
    return a
  }); // Create a bunch of springs using the helpers above
  // Create a gesture, we're interested in down-state, delta (current-pos - click-pos), direction and velocity
  const bind = useDrag(
    ({
      args: [index],
      active,
      movement: [mx],
      direction: [xDir],
      velocity: [vx],
    }) => {
      const trigger = vx > 0.1; // If you flick hard enough it should trigger the card to fly out
      if (!active && trigger) {
        const right = mx > 100 && xDir === 1;
        gone.add(index); // If button/finger's up and trigger velocity is reached, we flag the card ready to fly out
        flip(index, right);
      }

      api.start((i) => {
        if (index !== i) return; // We're only interested in changing spring-data for the current spring
        const isGone = gone.has(index);
        const x = isGone ? (200 + window.innerWidth) * xDir : active ? mx : 0; // When a card is gone it flys out left or right, otherwise goes back to zero
        const rot = mx / 100 + (isGone ? xDir * 100 * vx : 0); // How much the card tilts, flicking it harder makes it rotate faster
        const scale = active ? 1.1 : 1; // Active cards lift up a bit
        console.log('useDrag rot', rot);
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
  return (
    <>
      {props.map(({ x, y, rot, scale }, i) => {
        return (
          <animated.div
            key={i}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              willChange: "transform",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              touchAction: "none",
              x,
              y,
            }}
          >
            <animated.div
              {...bind(i)}
              style={{
                width: "100%",
                height: "100%",
                color: "white",
                borderRadius: "10px",
                transform: interpolate([rot, scale], trans),
                backgroundImage: `url(${
                  userStack[i] ? userStack[i].image : ""
                })`,
                background: "gray",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "right",
              }}
            >
              <TinderCard
                index={1}
                user={userStack[i]}
                renderBadge={() => (
                  <>
                    <animated.div
                      style={{
                        display: interpolate([rot, scale], (r, s) => {
                          if (r > 0.5) return "flex";
                          return "none";
                        }),
                      }}
                      className="absolute left-[30px] rounded-md text-[#6DFF6A] border-[4px] border-[#6DFF6A] top-16 p-4 h-[50px] w-[100px] bg-opacity-50 align-middle items-center justify-center"
                    >
                      <p>LIKE</p>
                    </animated.div>
                    <animated.div
                      style={{
                        display: interpolate([rot, scale], (r, s) => {
                          if (r < -0.5) return "flex";
                          return "none";
                        }),
                      }}
                      className="absolute right-[30px] rounded-md text-[#FF4E40] border-[4px] border-[#FF4E40] top-16 p-4 h-[50px] w-[100px] bg-opacity-50 align-middle items-center justify-center"
                    >
                      <p>NOPE</p>
                    </animated.div>
                  </>
                )}
              />
            </animated.div>
          </animated.div>
        );
      })}
    </>
  );
}
