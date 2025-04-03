/**
 * A module listing important information about all the post designs
 *
 * @module postDesigns
 */
// ----------------- MODULE DEFINITION --------------------------

const postDesigns =
{
	options:
	[
		{
			id: 'P-1P',
			label: 'Small Post (1")',
			technicalLabel: '1"',
			spanishLabel: '1"',
			description: 'All posts will be 1" square.'
		},
		{
			id: 'P-SP',
			label: 'Standard Post (1.5")',
			technicalLabel: '1.5"',
			spanishLabel: '1.5"',
			description: 'All posts will be 1.5" square.'
		},
		{
			id: 'P-2P',
			label: 'Laguna Post (2")',
			technicalLabel: '2"',
			spanishLabel: '2"',
			description: 'All posts will be 2" square.'
		},
		{
			id: 'P-BPC',
			label: 'Colonial Post (2.5")',
			technicalLabel: '2.5"',
			spanishLabel: '2.5"',
			description: 'All posts will be 2.5" square.'
		},
		{
			id: 'P-3P',
			label: 'Pillar Post (3")',
			technicalLabel: '3"',
			spanishLabel: '3"',
			description: 'All posts will be 3" square.'
		},
		{
			id: 'P-MIX',
			label: 'Mixed Posts',
			technicalLabel: 'Mixed',
			spanishLabel: 'Mezclado',
			description: 'Post sizes will vary at certain points along the railings.'
		},
		{
			id: 'P-CSTM',
			label: 'Custom Posts',
			technicalLabel: 'Custom',
			spanishLabel: 'Costumbre',
			description: 'Non-standard post sizes will be used to build out these railings.'
		}
	],
	designMetadata: [],
	technicalLabel: 'Post Size',
	spanishLabel: 'Tipo de Poste'
};

// ----------------- EXPORT --------------------------

module.exports = postDesigns;