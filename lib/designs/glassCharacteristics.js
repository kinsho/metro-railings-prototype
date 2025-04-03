/**
 * A module listing important information about all the various glass designs
 *
 * @module glassBuilds
 */
// ----------------- MODULE DEFINITION --------------------------

const glassBuilds =
{
	options:
	[
		{
			id: 'GLASS-DESIGN-THIN',
			label: '1/4" Tempered',
			technicalLabel: '1/4" Tempered',
			spanishLabel: '1/4" Templado',
			description: 'All panels of glass used in this project will be 1/4" thick and strengthened through' +
				' heat-treating.'
		},
		{
			id: 'GLASS-DESIGN-LMNTD-3-8',
			label: '3/8" Laminated',
			technicalLabel: '3/8" Laminated',
			spanishLabel: '3/8" Laminado',
			description: 'All panels of glass used in this project will be 3/8" thick and laminated for further' +
				' resiliency.'
		},
		{
			id: 'GLASS-DESIGN-STND-3-8',
			label: '3/8" Tempered',
			technicalLabel: '3/8" Tempered',
			spanishLabel: '3/8" Templado',
			description: 'All panels of glass used in this project will be 3/8" thick and strengthened through' +
				' heat-treating.'
		},
		{
			id: 'GLASS-DESIGN-STND',
			label: '1/2" Tempered',
			technicalLabel: '1/2" Tempered',
			spanishLabel: '1/2" Templado',
			description: 'All panels of glass used in this project will be 1/2" thick and strengthened through' +
				' heat-treating.'
		},
		{
			id: 'GLASS-DESIGN-LMNTD',
			label: '1/2" Laminated',
			technicalLabel: '1/2" Laminated',
			spanishLabel: '1/2" Laminado',
			description: 'All panels of glass used in this project will be 1/2" thick and laminated for further' +
				' resiliency.'
		},
		{
			id: 'GLASS-DESIGN-ENHNCED',
			label: '1/2" Tempered-Laminated',
			technicalLabel: '1/2" Tempered-Laminated',
			spanishLabel: '1/2" Templado-Laminado',
			description: 'All panels of glass used in this project will be 1/2" thick. Each panel of glass' +
				' will actually be constructed from two sheets of glass that will be bound together with' +
				' specialized plastic resin. All sheets of glass will be heat-treated as well for additional' +
				' durability.'
		}
	],
	designMetadata: [],
	technicalLabel: 'Glass Characteristics',
	spanishLabel: 'Vidrio'
};

// ----------------- EXPORT --------------------------

module.exports = glassBuilds;