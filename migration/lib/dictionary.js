// File meant as a repository for fundamental keywords and platform-wide constraints

/**
 * Function designed to dispatch a custom event
 */
export const acceptableMediaExtensions = {
	'image/jpeg': true,
	'image/jpg': true,
	'image/png': true,
	'video/mp4': true
};

export const acceptableImageExtensions = {
	'image/jpeg': true,
	'image/jpg': true,
	'image/png': true
};

export const suffixToExtensionTranslator = {
	jpg: 'image/jpg',
	jpeg: 'image/jpeg',
	png: 'image/png',
	pdf: 'application/pdf'
};

export const initStatus = {
	key: 'lead',
	label: 'Lead',
	state: 'prospect',
};

export const quoteStatus = {
	key: 'pending',
	label: 'Pending Finalization',
	state: 'prospect'
};

export const shopStatuses = [
	{
		key: 'material',
		label: 'Planning',
		state: 'open'
	},
	{
		key: 'layout',
		label: 'Layout',
		state: 'open'
	},
	{
		key: 'welding',
		label: 'Welding',
		state: 'open'
	},
	{
		key: 'grinding',
		label: 'Grinding',
		state: 'open'
	},
	{
		key: 'painting',
		label: 'Finishing',
		state: 'open'
	},
	{
		key: 'install',
		label: 'Ready for Install',
		state: 'open'
	}
];

export const closingStatus = {
	key: 'closing',
	label: 'Closing',
	state: 'open'
};

export const closedStatus = {
	key: 'closed',
	label: 'Closed',
	state: 'closed'
};

export const cancelledStatus = {
	key: 'cancelled',
	label: 'Cancelled',
	state: 'closed'
};

export const statuses = [
	{ ...initStatus },
	{ ...quoteStatus },
	...shopStatuses,
	{ ...closingStatus },
	{ ...closedStatus },
	{ ...cancelledStatus }
];

// Function meant to return a list of all prospect statuses
export function prospectStatuses() {
	return statuses.filter((status) => status.state === 'prospect');
}

// Function meant to return a list of all open statuses
export function openStatuses() {
	return statuses.filter((status) => status.state === 'open');
}

// Function meant to return a list of all closed statuses
export function closedStatuses() {
	return statuses.filter((status) => status.state === 'closed');
}

// Function meant to return all metadata associated with a particular status
export function getStatusMetadata(statusKey) {
	for (let i = 0; i < statuses.length; i += 1) {
		if (statuses[i].key === statusKey) {
			return statuses[i];
		}
	}
}

// Function meant to bundle and return all status keys
export function getAllStatusKeys() {
	return (statuses.map((status) => status.key));
}