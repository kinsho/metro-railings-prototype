/**
 * A module listing important information about all the center designs
 *
 * @module centerDesigns
 */
// ----------------- MODULE DEFINITION --------------------------

const centerDesigns =
{
	options:
	[
		{
			id: 'CD-S',
			label: 'S Scrolls',
			technicalLabel: 'S Scrolls',
			spanishLabel: 'S Scrolls',
			description: 'S-shaped scrolls will be integrated gracefully at various points along the middle of' +
				' each railing.'
		},
		{
			id: 'CD-SC',
			label: 'S/C Scrolls',
			technicalLabel: 'S/C Scrolls',
			spanishLabel: 'S/C Scrolls',
			description: 'S-shaped and C-shaped scrolls will be integrated gracefully at various' +
				' points along the middle of each railing.'
		},
		{
			id: 'CD-GALE',
			label: 'Gale',
			technicalLabel: 'Gale',
			spanishLabel: 'Vendaval',
			description: 'Scrolls shaped like wind swirls will be integrated gracefully at various' +
				' points along the middle of each railing.'
		},
		{
			id: 'CD-CSTM',
			label: 'Custom Center Design',
			technicalLabel: 'Custom Center Design',
			spanishLabel: 'Costumbre Diseños del Centro',
			description: 'Custom ornamental metalwork will be incorporated into the body of each railing.'
		}
	],
	designMetadata: [],
	technicalLabel: 'Center Designs',
	spanishLabel: 'Diseños del Centro'
};

// ----------------- EXPORT --------------------------

module.exports = centerDesigns;