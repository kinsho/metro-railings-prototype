import React, { useCallback, useEffect, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleArrowLeft, faCircleArrowRight } from '@fortawesome/free-solid-svg-icons'

export const usePrevNextButtons = (emblaApi, onButtonClick) => {
	const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
	const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

	const onPrevButtonClick = useCallback(() => {
		if (emblaApi) {
			emblaApi.scrollPrev();
			if (onButtonClick) {
				onButtonClick(emblaApi);
			}
		}
	}, [emblaApi, onButtonClick]);

	const onNextButtonClick = useCallback(() => {
		if (emblaApi) {
			emblaApi.scrollNext();
			if (onButtonClick) {
				onButtonClick(emblaApi);
			}
		}
	}, [emblaApi, onButtonClick]);

	const onSelect = useCallback((emblaApi) => {
		setPrevBtnDisabled( !(emblaApi.canScrollPrev()) );
		setNextBtnDisabled( !(emblaApi.canScrollNext()) );
	}, []);

	useEffect(() => {
		if (emblaApi) {
			onSelect(emblaApi);

			emblaApi.on('reInit', onSelect);
			emblaApi.on('select', onSelect);
		}
	}, [emblaApi, onSelect]);

	return {
		prevBtnDisabled,
		nextBtnDisabled,
		onPrevButtonClick,
		onNextButtonClick
	};
}

export const PrevButton = ({ clickHandler, disabled }) => {
	return (
		<button className='embla__button embla__button--prev' type='button' onClick={ clickHandler } disabled={ disabled }>
			<FontAwesomeIcon className='embla__fa_icon' icon={ faCircleArrowLeft } />
		</button>
	);
}

export const NextButton = ({ clickHandler, disabled }) => {
	return (
		<button className='embla__button embla__button--next' type='button' onClick={ clickHandler } disabled={ disabled }>
			<FontAwesomeIcon className='embla__fa_icon' icon={ faCircleArrowRight } />
		</button>
	);
}