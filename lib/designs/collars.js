/**
 * A module listing important information about all the collar designs
 *
 * @module collarDesigns
 */
// ----------------- MODULE DEFINITION --------------------------

const collarDesigns =
{
	options:
	[
		{
			id: 'CLLR-10',
			label: '1-0 Collar Pattern',
			technicalLabel: '1-0 Collar Pattern',
			spanishLabel: '1-0 Patrón de Cuello',
			description: 'Collars will be fitted along the centers of every alternate picket.'
		},
		{
			id: 'CLLR-11',
			label: '1-1 Collar Pattern',
			technicalLabel: '1-1 Collar Pattern',
			spanishLabel: '1-1 Patrón de Cuello',
			description: 'Collars will be fitted along the centers of every single picket.'
		},
		{
			id: 'CLLR-12',
			label: '1-2 Collar Pattern',
			technicalLabel: '1-2 Collar Pattern',
			spanishLabel: '1-2 Patrón de Cuello',
			description: 'Collars will be fitted along every picket in a patterned fashion - every even picket will' +
				' have a collar fitted along its center point while every odd picket will have two collars, one' +
				' placed low and and one placed high on the picket.'
		},
		{
			id: 'CLLR-CSTM',
			label: 'Custom Collar Pattern',
			technicalLabel: 'Custom Collar Pattern',
			spanishLabel: 'Costumbre Patrón de Cuello',
			description: 'Collars will be fitted in a way that\'s more unique to the nature of this project.'
		}
	],
	designMetadata: [],
	technicalLabel: 'Collars',
	spanishLabel: 'Collares'
};

// ----------------- EXPORT --------------------------

module.exports = collarDesigns;