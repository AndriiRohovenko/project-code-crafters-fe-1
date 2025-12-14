import { useEffect, useRef, useState } from 'react';
import { getTestimonials, Testimonial } from '../../api/api.gen';

const AUTO_SLIDE_INTERVAL = 5000;

export const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getTestimonials();
        setTestimonials(data);
        setError(null);
      } catch (err) {
        setError('Failed to load testimonials');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
    indexRef.current = 0;
  }, [testimonials]);

  useEffect(() => {
    if (testimonials.length > 1) {
      intervalRef.current = setInterval(() => {
        const next = (indexRef.current + 1) % testimonials.length;
        setCurrentIndex(next);
        indexRef.current = next;
      }, AUTO_SLIDE_INTERVAL);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [testimonials.length]);

  const handleDotClick = (idx: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrentIndex(idx);
    indexRef.current = idx;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-black">Loading...</div>
    );
  }

  if (error) {
    return <div className="py-20 text-center text-red-500">{error}</div>;
  }

  if (testimonials.length === 0) {
    return (
      <div className="flex items-center justify-center pt-16 md:pt-[100px] 2xl:pt-[120px]">
        <div className="flex items-center justify-center text-black">
          There are no testimonials here yet.
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center pt-16 md:pt-[100px] 2xl:pt-[120px]">
      <div className="relative w-full text-center 2xl:mx-auto 2xl:max-w-[822px]">
        <p className="mb-4 text-sm font-medium leading-5 tracking-[-0.28px] text-black md:text-base md:leading-6 md:tracking-[-0.32px]">
          What our customers say
        </p>
        <h2 className="mb-16 text-center text-[28px] font-extrabold uppercase leading-8 tracking-[-0.56px] text-black md:mb-20 md:text-[40px] md:leading-[44px] md:tracking-[-0.8px]">
          TESTIMONIALS
        </h2>

        <svg
          className="absolute left-2 top-[80px] h-8 w-10 md:left-10 md:top-[76px] md:h-12 md:w-[59px]"
          aria-hidden="true"
        >
          <use href="/sprite.svg#quote" />
        </svg>

        <div className="relative mb-10 w-full overflow-hidden">
          <div
            className="flex w-full"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: 'transform 0.5s ease-in-out',
            }}
            aria-live="polite"
          >
            {testimonials.map(({ id, comment, owner }) => (
              <div
                key={id}
                className="box-border flex w-full flex-none flex-col items-center px-4"
              >
                <p className="mb-16 text-center text-lg font-medium leading-6 tracking-[-0.36px] text-black md:mb-20 md:text-2xl md:leading-9 md:tracking-[-0.48px]">
                  &ldquo;{comment}&rdquo;
                </p>
                <p className="text-base font-extrabold uppercase leading-6 tracking-[-0.32px] text-black md:text-xl md:tracking-[-0.4px]">
                  {owner}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              className={`mx-2 inline-block h-[14px] w-[14px] cursor-pointer rounded-full border-none transition-colors duration-300 md:mx-3 md:h-4 md:w-4 ${
                currentIndex === idx ? 'bg-black' : 'bg-light-grey'
              }`}
              onClick={() => handleDotClick(idx)}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
