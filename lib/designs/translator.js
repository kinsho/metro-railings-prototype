import ada from 'lib/designs/ada';
import baskets from 'lib/designs/baskets';
import cableSizes from 'lib/designs/cableSizes';
import centerDesigns from 'lib/designs/centerDesigns';
import collars from 'lib/designs/collars';
import colors from 'lib/designs/colors';
import glassCharacteristics from 'lib/designs/glassCharacteristics';
import glassTypes from 'lib/designs/glassTypes';
import handrailings from 'lib/designs/handrailings';
import picketSizes from 'lib/designs/picketSizes';
import picketStyles from 'lib/designs/picketStyles';
import postCaps from 'lib/designs/postCaps';
import postEnds from 'lib/designs/postEnds';
import posts from 'lib/designs/posts';
import types from 'lib/designs/types';
import valences from 'lib/designs/valences';

const designs = [
	ada,
	baskets,
	cableSizes,
	centerDesigns,
	collars,
	colors,
	glassCharacteristics,
	glassTypes,
	handrailings,
	picketSizes,
	picketStyles,
	postCaps,
	postEnds,
	posts,
	types,
	valences
];

/**
 * Function designed to return the design record that applies to a particular code
 *
 * @param code
 */
export function translateDesignCode(code) {
	for (let i = 0; i < designs.length; i += 1) {
		let designOptions = designs[i].options;
		for (let j = 0; j < designOptions.length; j += 1) {
			if (designOptions[j].id === code) {
				return designOptions[j];
			}
		}
	}
}

/**
 * Function designed to return metadata about design categories
 *
 * @param code
 */
export function fetchDesignMetadata(code) {
	for (let i = 0; i < designs.length; i += 1) {
		let designOptions = designs[i].options;
		for (let j = 0; j < designOptions.length; j += 1) {
			if (designOptions[j].id === code) {
				return designs[i];
			}
		}
	}
}
