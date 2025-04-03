/**
 * A module listing important information about all the picket styles
 *
 * @module picketStyles
 */
// ----------------- MODULE DEFINITION --------------------------

const picketStyles =
{
	options:
	[
		{
			id: 'PCKT-STY-PLAIN',
			label: 'Plain Pickets',
			technicalLabel: 'Plain',
			spanishLabel: 'Simple',
			description: 'All pickets will be square in appearance.'
		},
		{
			id: 'PCKT-STY-PIPE',
			label: 'Pipe Pickets',
			technicalLabel: 'Pipe',
			spanishLabel: 'Tubo',
			description: 'All pickets will be cylindrical in appearance.'
		},
		{
			id: 'PCKT-STY-TWST',
			label: 'Twisted Pickets',
			technicalLabel: 'Twisted',
			spanishLabel: 'Retorcido',
			description: 'At least some pickets will be twisted along the shaft for decorative effect.'
		},
		{
			id: 'PCKT-STY-BOW',
			label: 'Bowed Pickets',
			technicalLabel: 'Bowed',
			spanishLabel: 'Arco',
			description: 'At least some pickets will curve outward like a bow.'
		},
		{
			id: 'PCKT-STY-CSTM',
			label: 'Customized Pickets',
			technicalLabel: 'Custom',
			spanishLabel: 'Costumbre',
			description: 'A non-standard style of picket will be used to build out the railings.'
		}
	],
	designMetadata: [],
	technicalLabel: 'Picket Styling',
	spanishLabel: 'Estilo de Piquete'
};

// ----------------- EXPORT --------------------------

module.exports = picketStyles;