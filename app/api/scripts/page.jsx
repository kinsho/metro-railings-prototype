import maskSensitiveFiles from 'scripts/maskSensitiveFiles';

const APIServer = async () => {

	await maskSensitiveFiles();

	return (
		<>
			<div>See console</div>
		</>
	);
};

export default APIServer;