'use client'

import React, { useState, useRef, useEffect } from 'react';
import dayjs from 'dayjs';

import styles from 'public/styles/page/home.module.scss';
import stats from 'assets/text/stats';

const StatsSection = () => {
	const [projects, setProjects] = useState(0);
	const [linearFeet, setLinearFeet] = useState(0);
	const [satisfactionPercentage, setSatisfactionPercentage] = useState(0);
	const observerTarget = useRef(null);

	const incrementStats = (step, totalIncrements) => {
		setProjects(Math.ceil(stats.projectsCompleted * step / totalIncrements));
		setLinearFeet(Math.ceil(stats.feetOfRailingBuilt * step / totalIncrements));
		setSatisfactionPercentage(Math.ceil(stats.customerHappinessPercentage * step / totalIncrements));
	};

	useEffect(() => {
		// Observer to allow for the stats to be rolled up right when the user scrolls down to the end
		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting) {
					const totalIncrements = 1000;

					for (let i = 1; i <= totalIncrements; i += 1) {
						window.setTimeout(() => incrementStats(i, totalIncrements), 2.5 * i);
					}

					observer.unobserve(observerTarget.current);
				}
			}, { threshold: 0.75 });
		const observedNode = observerTarget?.current || null;

		if (observedNode) {
			observer.observe(observedNode);
		}

		return () => {
			if (observedNode) {
				observer.unobserve(observedNode);
			}
		};

	}, [observerTarget]);

	return (
		<div className={ styles.statsSection }>
			<div className={ styles.statsSectionHeader }>OUR LIFETIME STATS</div>

			<div className={ styles.statsScoreDisplay }>
				<span className={ styles.statContainer }>
					<div className={ styles.statMetric }>{ projects || '--' }</div>
					<div className={ styles.statLabel }>Projects Completed</div>
				</span>
	
				<span className={ styles.statContainer }>
					<div className={ styles.statMetric }>{ linearFeet || '--' } linear feet</div>
					<div className={ styles.statLabel }>Amount of Railing Built</div>
				</span>
	
				<span className={ styles.statContainer } ref={ observerTarget }>
					<div className={ styles.statMetric }>{ satisfactionPercentage || '--' }%</div>
					<div className={ styles.statLabel }>of Customers Fully Satisfied</div>
				</span>
			</div>

			<div className={ styles.statsAsOfDate }>
				All statistics up to date as of { dayjs(stats.dateLastUpdated).format('MMM DD, YYYY') }
			</div>
		</div>
	);
}

export default StatsSection;