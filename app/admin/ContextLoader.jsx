'use client'

import React, { useState, useEffect } from 'react';

import { buildUserMap, getUserSession } from 'lib/userInfo';

import { UserContext, UserMapContext } from 'app/admin/userContext';

import Header from 'components/admin/Header';
import EventOrganizer from 'components/EventOrganizer';
import CustomToaster from 'components/CustomToaster';

export default function AdminContextLoader({ children }) {
	const [user, setUser] = useState(null);
	const [userMap, setUserMap] = useState({});

	useEffect(() => {
		setUser(getUserSession());

		const userLoader = async () => {
			const users = await buildUserMap();
			setUserMap(users);
		}
		userLoader();
	}, []);

	return (
		<>
			<UserContext.Provider value={ user }>
				<UserMapContext.Provider value={ userMap }>
					<Header />
					{ children }

					<EventOrganizer />
					<CustomToaster />
				</UserMapContext.Provider>
			</UserContext.Provider>
		</>
	);
}