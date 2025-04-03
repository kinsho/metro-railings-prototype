import React, { useCallback } from 'react'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'

import { DotButton, useDotButton } from 'lib/carousel/EmblaCarouselDotButton'
import { PrevButton, NextButton, usePrevNextButtons } from 'lib/carousel/EmblaCarouselArrowButtons'

const EmblaCarousel = ({ options, children }) => {
	const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()]);

	const onNavButtonClick = useCallback((emblaApi) => {
		const autoplay = emblaApi?.plugins()?.autoplay;
		if (autoplay) {
			if (autoplay.options.stopOnInteraction) {
				autoplay.stop();
			} else {
				autoplay.reset();
			}
		}
	}, []);

	const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi, onNavButtonClick);

	const {
		prevBtnDisabled,
		nextBtnDisabled,
		onPrevButtonClick,
		onNextButtonClick
	} = usePrevNextButtons(emblaApi, onNavButtonClick);

	return (
		<section className='embla'>
			<div className='embla__viewport' ref={ emblaRef }>
				<div className='embla__container'>
					{ children }
				</div>
			</div>

			<div className='embla__controls'>
				<div className='embla__buttons'>
					<PrevButton clickHandler={ onPrevButtonClick } disabled={ prevBtnDisabled } />
					<NextButton clickHandler={ onNextButtonClick } disabled={ nextBtnDisabled } />
				</div>

				<div className='embla__dots'>
					{ scrollSnaps.map((_, index) => (
						<DotButton
							key={ index }
							onClick={ () => onDotButtonClick(index) }
							className={'embla__dot'.concat(
								index === selectedIndex ? ' embla__dot--selected' : ''
							)}
						/>
					))}
				</div>
			</div>
		</section>
	);
}

export default EmblaCarousel;