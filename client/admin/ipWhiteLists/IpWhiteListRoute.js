import React from 'react';

import { usePermission } from '../../contexts/AuthorizationContext';
import NotAuthorizedPage from '../../components/NotAuthorizedPage';
import IpWhiteListPage from './IpWhiteListPage';

function IpWhiteListRoute() {
	const canViewUserAdministration = usePermission('view-ip-white-list');

	if (!canViewUserAdministration) {
	 	return <NotAuthorizedPage />;
	}

	return <IpWhiteListPage />;
}

export default IpWhiteListRoute;
