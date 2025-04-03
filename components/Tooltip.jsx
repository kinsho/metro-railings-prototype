'use client'

import { Tooltip } from 'react-tooltip'

const MRToolTip = ({ tooltipMessage, tooltipPlacement, turnOffTooltip, children }) => {

	return (
		<>
			<span
				data-tooltip-id='mr-tooltip'
				data-tooltip-place={ tooltipPlacement || 'top' }
				data-tooltip-content={ tooltipMessage }
				data-tooltip-hidden={ turnOffTooltip || false }
			>
				{ children }
			</span>

			<Tooltip id='mr-tooltip' />
		</>
	);
};

export default MRToolTip;