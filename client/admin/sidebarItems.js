import { HTML } from 'meteor/htmljs';
import { Meteor } from 'meteor/meteor';

import { hasPermission, hasRole } from '../../app/authorization/client';
import { createTemplateForComponent } from '../reactAdapters';
import { createSidebarItems } from '../lib/createSidebarItems';

createTemplateForComponent('adminFlex', () => import('./sidebar/AdminSidebar'), {
	renderContainerView: () => HTML.DIV({ style: 'height: 100%; position: relative;' }), // eslint-disable-line new-cap
});

export const {
	registerSidebarItem: registerAdminSidebarItem,
	unregisterSidebarItem,
	itemsSubscription,
} = createSidebarItems([
	{
		icon: 'info-circled',
		href: 'admin-info',
		i18nLabel: 'Info', // 資訊
		permissionGranted: () => hasPermission('view-statistics'),
	}, {
		icon: 'import',
		href: 'admin-import',
		i18nLabel: 'Import', // 匯入
		permissionGranted: () => hasPermission('run-import'),
	}, {
		icon: 'team',
		href: 'admin-users',
		i18nLabel: 'Users', // 使用者
		permissionGranted: () => hasPermission('view-user-administration'),
	}, {
		icon: 'hashtag',
		href: 'admin-rooms',
		i18nLabel: 'Rooms', // Room
		permissionGranted: () => hasPermission('view-room-administration'),
	}, {
		icon: 'user-plus',
		href: 'invites',
		i18nLabel: 'Invites',
		permissionGranted: () => hasPermission('create-invite-links'),
	}, {
		icon: 'cloud-plus',
		href: 'cloud',
		i18nLabel: 'Connectivity_Services', // 連線的服務
		permissionGranted: () => hasPermission('manage-cloud'),
	}, {
		icon: 'post',
		href: 'admin-view-logs',
		i18nLabel: 'View_Logs', // 查看日誌
		permissionGranted: () => hasPermission('view-logs'),
	}, {
		icon: 'volume',
		href: 'custom-sounds',
		i18nLabel: 'Custom_Sounds', // 自訂音效
		permissionGranted: () => hasPermission(['manage-sounds']),
	}, {
		icon: 'discover',
		href: 'federation-dashboard',
		i18nLabel: 'Federation Dashboard',
		permissionGranted: () => hasRole(Meteor.userId(), 'admin'),
	}, {
		icon: 'cube',
		href: 'admin-apps',
		i18nLabel: 'Apps', // 應用程式
		permissionGranted: () => hasPermission(['manage-apps']),
	}, {
		icon: 'cube',
		href: 'admin-marketplace',
		i18nLabel: 'Marketplace',
		permissionGranted: () => hasPermission(['manage-apps']),
	},
]);