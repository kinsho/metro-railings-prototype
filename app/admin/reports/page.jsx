import ReportsPage from 'app/admin/reports/client';

import styles from 'public/styles/page/reports.module.scss';

const ReportsServer = () => {

	return (
		<div className={ styles.pageContainer }>
			<div className={ styles.pageHeader }>REPORTING</div>
			<ReportsPage />
		</div>
	);
};

export default ReportsServer;