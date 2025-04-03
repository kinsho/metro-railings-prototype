/**
 * A module listing important information about all the basket designs
 *
 * @module basketDesigns
 */
// ----------------- MODULE DEFINITION --------------------------

const basketDesigns =
{
	options:
	[
		{
			id: 'BSKT-10',
			label: '1-0 Basket Pattern',
			technicalLabel: '1-0 Basket Pattern',
			spanishLabel: '1-0 Patrón de Cesta',
			description: 'Baskets will be fitted along the centers of every alternate picket.'
		},
		{
			id: 'BSKT-11',
			label: '1-1 Basket Pattern',
			technicalLabel: '1-1 Basket Pattern',
			spanishLabel: '1-1 Patrón de Cesta',
			description: 'Baskets will be fitted along the centers of every single picket.'
		},
		{
			id: 'BSKT-12',
			label: '1-2 Basket Pattern',
			technicalLabel: '1-2 Basket Pattern',
			spanishLabel: '1-2 Patrón de Cesta',
			description: 'Baskets will be fitted along every picket in a patterned fashion - every even picket will' +
				' have a basket fitted along its center point while every odd picket will have two baskets, one' +
				' placed low and and one placed high on the picket.'
		},
		{
			id: 'BSKT-CSTM',
			label: 'Custom Basket Pattern',
			technicalLabel: 'Custom Basket Pattern',
			spanishLabel: 'Costumbre Patrón de Cesta',
			description: 'Baskets will be fitted in a way that\'s more unique to the nature of this project.'
		}
	],
	designMetadata: [],
	technicalLabel: 'Baskets',
	spanishLabel: 'Cestas'
};

// ----------------- EXPORT --------------------------

module.exports = basketDesigns;