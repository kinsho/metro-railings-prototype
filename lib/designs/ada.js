/**
 * A module listing important information about all the different types of ADA intermediate handrails
 *
 * @module adaDesigns
 */
// ----------------- MODULE DEFINITION --------------------------

const adaDesigns =
{
	label: 'ada',
	options:
	[
		{
			id: 'ADA-P',
			label: 'Pipe',
			technicalLabel: 'Pipe',
			spanishLabel: 'Tubo',
			description: 'A 1.5" diameter pipe will be incorporated into the railing as an intermediate handrail.' +
				' Generally, these handrails are necessary for railings that need to be ADA-compliant. The' +
				' intermediate handrail will end into 12"-long loops at both ends.'
		}
	],
	designMetadata: [],
	technicalLabel: 'ADA',
	spanishLabel: 'Desventaja'
};

// ----------------- EXPORT --------------------------

module.exports = adaDesigns;