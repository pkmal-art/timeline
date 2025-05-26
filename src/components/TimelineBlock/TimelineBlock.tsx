import React, { useState, useRef } from "react";
import { timelineData } from "./data";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import { gsap } from "gsap";
import "swiper/css";
import "swiper/css/navigation";
import "./TimelineBlock.scss";

const TimelineBlock = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const circleRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLDivElement>(null!);
  const toRef = useRef<HTMLDivElement>(null!);
  const swiperRef = useRef<SwiperCore | null>(null);
  const activePeriod = timelineData[activeIndex];

  const animateCounter = (
    ref: React.RefObject<HTMLDivElement>,
    start: number,
    end: number,
    duration = 1
  ) => {
    const obj = { value: start };
    gsap.to(obj, {
      value: end,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = Math.round(obj.value).toString();
        }
      },
    });
  };

  const rotateToIndex = (index: number) => {
    const anglePerItem = 360 / timelineData.length;
    const angle = anglePerItem * index;

    const currentPeriod = timelineData[activeIndex];
    const newPeriod = timelineData[index];

    // Animate rotation
    gsap.to(circleRef.current, {
      rotate: -angle,
      duration: 1,
      ease: "power2.out",
    });

    // Animate numbers
    animateCounter(fromRef, Number(currentPeriod.beginningTimePeriod), Number(newPeriod.beginningTimePeriod));
    animateCounter(toRef, Number(currentPeriod.endTimePeriod), Number(newPeriod.endTimePeriod));

    setActiveIndex(index);
  };

  const goPrev = () => {
    const newIndex = (activeIndex - 1 + timelineData.length) % timelineData.length;
    rotateToIndex(newIndex);
  };

  const goNext = () => {
    const newIndex = (activeIndex + 1) % timelineData.length;
    rotateToIndex(newIndex);
  };

  return (
    <div className="timeline__wrapper container">
      <div className="timeline__container">
        <div className="timeline__headerBlock">
          <h1 className="timeline__title">Исторические даты</h1>
        </div>

        <div className="time__circle-wrapper">
          <div className="center__years">
            <div className="from" ref={fromRef}>
              {activePeriod.beginningTimePeriod}
            </div>
            <div className="to" ref={toRef}>
              {activePeriod.endTimePeriod}
            </div>
          </div>

          <div className="time__circle" ref={circleRef}>
            {timelineData.map((_, index) => {
              const angle = (360 / timelineData.length) * index - 60;
              const radius = 267;
              const rad = (angle * Math.PI) / 180;
              const x = radius * Math.cos(rad);
              const y = radius * Math.sin(rad);
              const isActive = index === activeIndex;

              return (
                <div
                  key={index}
                  className={`time__point ${isActive ? "active" : ""}`}
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                  }}
                  onClick={() => rotateToIndex(index)}
                >
                  <div
                    className="time__point--number-wrapper"
                    style={{
                      transform: `rotate(${(360 / timelineData.length) * activeIndex}deg)`,
                    }}
                  >
                    <div className="time__point--number">
                      {isActive ? index + 1 : ""}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="slider__block">
          <div className="slider__controls">
            <div className="slider__counter">
              {String(activeIndex + 1).padStart(2, "0")}/
              <span>{String(timelineData.length).padStart(2, "0")}</span>
            </div>
            <div className="circle-nav-buttons">
              <button onClick={goPrev} className="circle-btn">
                <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.49988 0.750001L2.24988 7L8.49988 13.25" stroke="#42567A" strokeWidth="2" />
                </svg>
              </button>
              <button onClick={goNext} className="circle-btn">
                <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.50012 0.750001L7.75012 7L1.50012 13.25" stroke="#42567A" strokeWidth="2" />
                </svg>
              </button>
            </div>
          </div>
          <div className="swiper-wrapper">
            <div className="custom-prev swiper-button-prev"></div>
            <div className="custom-next swiper-button-next"></div>
            <Swiper
              slidesPerView={3}
              spaceBetween={20}
              navigation={{
                nextEl: ".custom-next",
                prevEl: ".custom-prev",
              }}
              modules={[Navigation]}
              className="timeline--swiper"
            >
              {activePeriod.events.map((event, idx) => (
                <SwiperSlide key={idx}>
                  <article className="card">
                    <h3>{event.year}</h3>
                    <p>{event.description}</p>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineBlock;
