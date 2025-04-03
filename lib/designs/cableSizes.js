/**
 * A module listing important information about all the various cable sizes
 *
 * @module cableSizes
 */
// ----------------- MODULE DEFINITION --------------------------

const cableSizes =
{
	options:
	[
		{
			id: 'CBL-SIZE-3/32',
			label: '3/32"',
			technicalLabel: '3/32"',
			spanishLabel: '3/32"',
			description: 'All cables will be 3/32" of an inch in diameter.'
		},
		{
			id: 'CBL-SIZE-1/8',
			label: '1/8"',
			technicalLabel: '1/8"',
			spanishLabel: '1/8"',
			description: 'All cables will be 1/8" of an inch in diameter.'
		},
		{
			id: 'CBL-SIZE-3/16',
			label: '3/16"',
			technicalLabel: '3/16"',
			spanishLabel: '3/16"',
			description: 'All cables will be 3/16" of an inch in diameter.'
		},
		{
			id: 'CBL-SIZE-1/4',
			label: '1/4"',
			technicalLabel: '1/4"',
			spanishLabel: '1/4"',
			description: 'All cables will be 1/4" of an inch in diameter.'
		}
	],
	designMetadata: [],
	technicalLabel: 'Cable Size',
	spanishLabel: 'Tamaños de Cable'
};

// ----------------- EXPORT --------------------------

module.exports = cableSizes;