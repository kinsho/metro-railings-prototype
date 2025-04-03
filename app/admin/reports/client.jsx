'use client'

import React, { useState } from 'react';

import OptionSet from 'components/admin/OptionSet';
import { toastValidationError } from 'components/CustomToaster';

import { validateEmpty, runValidators } from 'lib/validators/inputValidators';
import { serverActionCall } from 'lib/http/clientHttpRequester';

import { } from '@fortawesome/free-solid-svg-icons'
import styles from 'public/styles/page/reports.module.scss';

const ReportsPage = () => {

	const [currentReport, setCurrentReport] = useState(null);

	const [commissionParams, setCommissionParams] = useState({
		startDate: '',
		endDate: ''
	});

	const [clientParams, setClientParams] = useState({
		name: ''
	});

	const reportMap = {
		prospect: 'Prospect Tracker',
		commission: 'Commission Report',
		client: 'Client Orders'
	};

	// ------- -Validation Logic
	const verifyDates = ({ startDate, endDate }) => new Date(startDate) <= new Date(endDate);

	const commissionReportValidationFields = [
		{ prop: commissionParams.startDate, validator: validateEmpty, errorMsg: 'Specify a start date.' },
		{ prop: commissionParams.endDate, validator: validateEmpty, errorMsg: 'Specify an end date.' },
		{ prop: commissionParams, validator: verifyDates, errorMsg: 'The end date cannot come before the start date.' },
	];

	const clientReportValidationFields = [
		{ prop: clientParams.name, validator: validateEmpty, errorMsg: 'Specify a name.' }
	];

	const updateCurrentReport = (newReport) => {
		setCurrentReport(newReport);
	};

	const updateCommissionReportParam = (event) => {
		setCommissionParams({
			...commissionParams,
			[event.currentTarget.name]: event.currentTarget.value
		});
	}

	const updateClientReportParam = (event) => {
		setClientParams({
			...clientParams,
			[event.currentTarget.name]: event.currentTarget.value
		});
	}


	const generateReport = async () => {
		let serverAction, errors, params;
		if (currentReport === 'commission') {
			errors = runValidators(commissionReportValidationFields);
			params = commissionParams;
		} else if (currentReport === 'client') {
			errors = runValidators(clientReportValidationFields);
			params = clientParams;
		}

		if (errors.length === 0) {
			const serverResponse = await serverActionCall(serverAction, params, {
				loading: 'Generating report...',
				error: 'Something went wrong when trying to generate a report. Please try again. If it doesn\'t work, consult Rickin.'
			});
			console.log(serverResponse);
		} else {
			toastValidationError(errors);
		}
	}

	return (
		<>
			<div className={ styles.test }>Report</div>
			<OptionSet
				labels={ Object.values(reportMap) }
				values={ Object.keys(reportMap) }
				currentValue={ currentReport }
				isDisabled={ false }
				setter={ updateCurrentReport }
			/>

			{ currentReport === 'commission' ? (
				<div className={ styles.test }>
					<span className={ styles.test }>Start Date</span>
					<input
						type='date'
						name='startDate'
						value={ commissionParams.startDate }
						onChange={ updateCommissionReportParam }
					/>
					<span className={ styles.test }>End Date</span>
					<input
						type='date'
						name='endDate'
						value={ commissionParams.endDate }
						onChange={ updateCommissionReportParam }
					/>
				</div>
			) : null }

			{ currentReport === 'client' ? (
				<div className={ styles.test }>
					<span className={ styles.test }>Client Name/Company</span>
					<input
						type='text'
						name='name'
						value={ clientParams.name }
						onChange={ updateClientReportParam }
					/>
				</div>
			) : null }

			<div>
				<button type='button' className={ styles.test } onClick={ generateReport }>Generate Report</button>
			</div>

		</>
	);
};

export default ReportsPage;