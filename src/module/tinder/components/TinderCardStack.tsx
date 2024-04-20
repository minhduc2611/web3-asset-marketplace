"use client";
import { useDrag } from "@use-gesture/react";
import { useSprings, animated, to as interpolate } from "@react-spring/web";

import { useTinderStore } from "../store/tinder";
import TinderCard from "./TinderCard";
import { useState } from "react";
import { move } from "formik";
import { BATCH_SIZE } from "../constant/tinder";
import { Batch, MockUser } from "../resource/modal/user";

const SWIPE_THRESHOLD = 70;

// These two are just helpers, they curate spring data, values that are later being interpolated into css
// const to = (i: number) => {
//   return {
//     x: 0,
//     y: 0,
//     scale: 1,
//     rot: i,
//     delay: i,
//   };
// };
// const from = (_i: number) => {
//   return { x: 0, rot: 0, scale: 1, y: 0 };
// };
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
      // console.log("mx", mx);
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
          ? (200 + window.innerWidth) * (right ? 1 : -1)
          : active
          ? mx
          : 0; // When a card is gone it flys out left or right, otherwise goes back to zero
        // console.log("swipe right: mx", mx);
        // console.log("swipe right: xDir", xDir);
        // console.log("swipe right: (200 + window.innerWidth) * xDir", (200 + window.innerWidth) * xDir);
        // console.log("swipe right: x", x);
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
                background: "gray",
                touchAction: "none",
              }}
              id={`card-${i}`}
            >
              {/* {batch.users[i] ? batch.users[i].image : ""} */}
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
                        display: interpolate([rot, scale], (r, s) => {
                          if (r > SWIPE_THRESHOLD / 100) return "flex";
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
                          if (r < -SWIPE_THRESHOLD / 100) return "flex";
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
