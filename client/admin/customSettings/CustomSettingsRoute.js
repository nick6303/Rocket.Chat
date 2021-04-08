import React from 'react';
import { usePermission } from '../../contexts/AuthorizationContext';
import NotAuthorizedPage from '../../components/NotAuthorizedPage';
import { CustomSettingsPage } from './CustomSettingsPage';

function CustomSettingsRoute() {
	const canViewUserAdministration = usePermission('view-custom-settings');

	if (!canViewUserAdministration) {
	 	return <NotAuthorizedPage />;
	}

	return <CustomSettingsPage />;
}

export default CustomSettingsRoute;