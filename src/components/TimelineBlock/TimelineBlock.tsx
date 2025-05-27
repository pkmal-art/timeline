import React, { useState, useRef, useEffect } from "react";
import { timelineData } from "./data";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation, Pagination } from "swiper/modules";
import { gsap } from "gsap";
import "swiper/css";
import "swiper/css/navigation";
import "./TimelineBlock.scss";

const TimelineBlock = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [radius, setRadius] = useState(267);
  const circleWrapperRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLDivElement>(null!);
  const toRef = useRef<HTMLDivElement>(null!);
  const swiperRef = useRef<SwiperCore | null>(null);
  const activePeriod = timelineData[activeIndex];

  useEffect(() => {
    const updateRadius = () => {
      if (circleWrapperRef.current) {
        const size = circleWrapperRef.current.offsetWidth;
        setRadius(size / 2);
      }
    };
    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

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

    gsap.to(circleRef.current, {
      rotate: -angle,
      duration: 1,
      ease: "power2.out",
    });

    animateCounter(fromRef, Number(currentPeriod.beginningTimePeriod), Number(newPeriod.beginningTimePeriod));
    animateCounter(toRef, Number(currentPeriod.endTimePeriod), Number(newPeriod.endTimePeriod));

    swiperRef.current?.slideTo(0);

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
        <div className="timeline__line--center" />
        <div className="timeline__headerBlock">
          <h1 className="timeline__title">Исторические даты</h1>
        </div>

        <div className="timeline__block">
          <div className="timeline__circle" ref={circleWrapperRef}>
            <div className="timeline__years">
              <div className="from" ref={fromRef}>{activePeriod.beginningTimePeriod}</div>
              <div className="to" ref={toRef}>{activePeriod.endTimePeriod}</div>
            </div>

            <div className="time__circle" ref={circleRef}>
              {timelineData.map((_, index) => {
                const angle = (360 / timelineData.length) * index - 60;
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
                      className="time__point--content"
                      style={{
                        transform: `rotate(${(360 / timelineData.length) * activeIndex}deg) ${
                          isActive && timelineData[index].category ? "translateY(-20px)" : ""
                        }`,
                      }}
                    >
                      <div className="time__point--number">{isActive ? index + 1 : ""}</div>
                      {isActive && timelineData[index].category && (
                        <div className="time__point--category">{timelineData[index].category}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="slider__block">
          <div className="slider__navigation">
            <div className="slider__controls">
              <div className="slider__counter">
                {String(activeIndex + 1).padStart(2, "0")}/<span>{String(timelineData.length).padStart(2, "0")}</span>
              </div>
              <div className="slider__nav--buttons ">
                <button onClick={goPrev} className="circle-btn">
                  <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.49988 0.75L2.24988 7L8.49988 13.25" stroke="#42567A" strokeWidth="2" />
                  </svg>
                </button>
                <button onClick={goNext} className="circle-btn">
                  <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.50012 0.75L7.75012 7L1.50012 13.25" stroke="#42567A" strokeWidth="2" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="custom-pagination" />
          </div>

          <div className="swiper__wrapper">
            <div className="custom-prev swiper-button-prev"></div>
            <div className="custom-next swiper-button-next"></div>
            <Swiper
              slidesPerView={1.5}
              spaceBetween={16}
              navigation={{
                nextEl: ".custom-next",
                prevEl: ".custom-prev",
              }}
              pagination={{
                clickable: true,
                el: ".custom-pagination",
              }}
              modules={[Navigation, Pagination]}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              breakpoints={{
                768: {
                  slidesPerView: 2,
                  centeredSlides: false,
                  spaceBetween: 30,
                },
                1024: {
                  slidesPerView: 3,
                  centeredSlides: false,
                },
              }}
            >
              {activePeriod.events.map((event, idx) => (
                <SwiperSlide key={idx}>
                  <article className="swiper__card">
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
