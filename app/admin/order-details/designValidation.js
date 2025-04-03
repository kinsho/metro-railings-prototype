/**
 * A module dictating which design fields can and cannot co-exist
 **/

// ----------------- CONSTANTS --------------------------

const designValidationRules= {
	type: {},
	post: { type: ['T-TRA', 'T-MOD', 'T-IRON', 'T-FENCE', 'T-GATE', 'T-SAMPLE', 'T-CABLE', 'T-GLASS'] },
	handrailing: { type: ['T-TRA', 'T-MOD', 'T-IRON', 'T-FENCE', 'T-GATE', 'T-SAMPLE', 'T-CABLE', 'T-GLASS'] },
	postEnd: { type: ['T-TRA', 'T-MOD', 'T-IRON', 'T-FENCE', 'T-GATE', 'T-SAMPLE', 'T-CABLE', 'T-GLASS'] },
	postCap: { type: ['T-TRA', 'T-MOD', 'T-IRON', 'T-FENCE', 'T-GATE', 'T-SAMPLE', 'T-CABLE', 'T-GLASS'] },
	ada: { type: ['T-TRA', 'T-MOD', 'T-IRON', 'T-FENCE', 'T-GATE', 'T-SAMPLE', 'T-CABLE', 'T-GLASS'] },
	color: { type: ['T-TRA', 'T-MOD', 'T-IRON', 'T-FENCE', 'T-GATE', 'T-SAMPLE', 'T-CABLE', 'T-GLASS'] },
	picketSize: { type: ['T-TRA', 'T-MOD', 'T-IRON', 'T-FENCE', 'T-GATE', 'T-SAMPLE'] },
	picketStyle: { type: ['T-TRA', 'T-MOD', 'T-IRON', 'T-FENCE', 'T-GATE', 'T-SAMPLE'] },
	centerDesign: { type: ['T-TRA', 'T-MOD', 'T-IRON', 'T-FENCE', 'T-GATE', 'T-SAMPLE'] },
	collars: { type: ['T-TRA', 'T-MOD', 'T-IRON', 'T-FENCE', 'T-GATE', 'T-SAMPLE'] },
	baskets: { type: ['T-TRA', 'T-MOD', 'T-IRON', 'T-FENCE', 'T-GATE', 'T-SAMPLE'] },
	valence: { type: ['T-TRA', 'T-MOD', 'T-IRON', 'T-FENCE', 'T-GATE', 'T-SAMPLE'] },
	cableSize: { type: ['T-CABLE', 'T-SAMPLE'] },
	glassType: { type: ['T-GLASS', 'T-SAMPLE'] },
	glassBuild: { type: ['T-GLASS', 'T-SAMPLE'] }
};

// ----------------- MODULE DEFINITION --------------------------

// Function assesses all design fields to determine which ones need to be disabled and which ones need to be enabled
export function validateAllDesignFields(design, designDescription) {
	const designProps = Object.keys(design);

	for (let i = 0; i < designProps.length; i += 1) {
		if (validateDesignProp(design, designProps[i]) === false) {
			design[designProps[i]] = '';
			designDescription[designProps[i]] = '';
		}
	}
}

// Function assesses whether a particular design fields needs to be disabled depending on the values of certain design
// properties
export function validateDesignProp(design, propName) {
	const validationRules = designValidationRules[propName];
	const validationProps = Object.keys(validationRules);

	// If the design field is meant to be disabled, blank out all the values as well
	for (let i = 0; i < validationProps.length; i += 1) {
		const propToTest = validationProps[i];
		if (validationRules[propToTest].find(element => element === design[propToTest]) === undefined) {
			return false;
		}
	}

	return true;
}