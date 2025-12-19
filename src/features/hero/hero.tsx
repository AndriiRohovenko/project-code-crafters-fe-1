import Typewriter from 'typewriter-effect';

import { OutlineNavButton } from '@/shared/ui/outlinedNavButton.tsx';

export const Hero = () => {
  return (
    <section className="position-relative z-[1] mt-[-60px] pt-1 xs:pt-2 md:mt-[-90px] md:pt-4 2xl:pt-5">
      <div className="mx-auto w-full px-1 xs:w-[100%] xs:px-2 md:px-4 2xl:w-[1440px] 2xl:px-5">
        <div className="max-2xl:pt-[217px] max-2xl:pb-[94px] max-md:pt-[194px] max-md:pb-[100px] relative flex flex-col items-center overflow-hidden rounded-2xl bg-black pb-[81px] pt-[140px] text-center text-white md:pt-[147px]">
          <h1 className="w-[100%] text-center text-[40px] font-extrabold uppercase leading-none xs:min-w-[304px] xs:max-w-[400px] md:max-w-[800px] md:text-[70px] 2xl:w-[80%] 2xl:max-w-[900px] 2xl:text-[90px]">
            <span className="xs-h inline-block whitespace-pre-line md:h-[160px] 2xl:h-[180px]">
              <Typewriter
                onInit={(typewriter) => {
                  typewriter
                    .typeString('IMPROVE YOUR')
                    .pauseFor(500)
                    .deleteAll()
                    .typeString('IMPROVE YOUR CULINARY TALENTS')
                    .pauseFor(500)
                    .callFunction(() => {
                      const cursor = document.querySelector(
                        '.Typewriter__cursor'
                      );
                      if (cursor) cursor.remove();
                    })
                    .start();
                }}
                options={{
                  delay: 50,
                  deleteSpeed: 30,
                  cursor: '',
                }}
              />
            </span>
          </h1>

          <p className="max-md:mb-5 max-md:max-w-full max-md:px-2 max-md:text-sm max-md:leading-5 mx-auto mb-8 mt-[40px] max-w-[480px] px-0 pl-[12px] pr-[12px] text-base font-medium leading-6 text-white 2xl:max-w-[577px]">
            Amazing recipes for beginners in the world of cooking, enveloping
            you in the aromas and tastes of various cuisines.
          </p>
          <div className={'mb-[40px] flex justify-center'}>
            <OutlineNavButton
              to={'/add-recipe'}
              className="px-5 py-2 text-[14px] md:px-8 md:py-5 md:text-[16px]"
              isShowBorder
              variant={'white'}
            >
              Add recipe
            </OutlineNavButton>
          </div>

          <div className="flex items-center justify-center">
            <img
              srcSet="
              /images/hero/hero-dish-2-1x.png 1x,
              /images/hero/hero-dish-2-2x.png 2x"
              src="/images/hero/hero-dish-2-1x.png"
              alt="Meat pie"
              className="w-[77px] max-w-full pb-[26px] md:w-[128px] md:pb-[47px]"
            />
            <img
              srcSet="
              /images/hero/hero-dish-1x.png 1x,
              /images/hero/hero-dish-2x.png 2x"
              src="/images/hero/hero-dish-1x.png"
              alt="Chocolate pudding"
              className="w-[190px] max-w-full md:w-[302px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
