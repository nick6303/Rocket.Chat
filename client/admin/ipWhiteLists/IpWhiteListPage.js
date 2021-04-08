import { Button, ButtonGroup, Icon } from '@rocket.chat/fuselage';
import React, { useState, useCallback } from 'react';

import Page from '../../components/basic/Page';
import VerticalBar from '../../components/basic/VerticalBar';
import { useTranslation } from '../../contexts/TranslationContext';
import { useRouteParameter, useRoute } from '../../contexts/RouterContext';
import { EditIpWhiteList } from './EditIpWhiteList';
import { AddIpWhiteList } from './AddIpWhiteList';
import { SetUsersIpWhiteList  } from './SetUsersIpWhiteList ';
import IpWhiteListTable from './IpWhiteListTable';

function IpWhiteListPage() {
	const t = useTranslation();

	const [cache, setCache] = useState();

	const ipWhiteListsRoute = useRoute('ip-white-list');

	const handleCloseButtonClick = () => {
		ipWhiteListsRoute.push({});
	};

	const handleNewButtonClick = () => {
		ipWhiteListsRoute.push({ context: 'new' });
	};

	const context = useRouteParameter('context');
	const id = useRouteParameter('id');
	
	const onChange = useCallback(() => {
		setCache(new Date());
	}, []);

	if(context === 'setUsers'){
		return <SetUsersIpWhiteList id={id} goBack={handleCloseButtonClick}/>;
	}

	return <Page flexDirection='row'>
		<Page>
			<Page.Header title={t('WhiteList')}>
				<ButtonGroup>
					<Button onClick={handleNewButtonClick}>
						<Icon name='plus'/> {t('New_White')}
					</Button>
				</ButtonGroup>
			</Page.Header>
			<Page.Content>
				<IpWhiteListTable cache={cache}/>
			</Page.Content>
		</Page>
		{context && <VerticalBar className={'contextual-bar'}>
			<VerticalBar.Header>
				{context === 'edit' && t('Edit_WhiteList')}
				{context === 'new' && t('Add_WhiteList')}
				<VerticalBar.Close onClick={handleCloseButtonClick} />
			</VerticalBar.Header>
			{context === 'edit' && <EditIpWhiteList goBack={handleCloseButtonClick} id={id} />}
			{context === 'new' && <AddIpWhiteList goBack={handleCloseButtonClick} />}
		</VerticalBar>}
	</Page>;
}
export default IpWhiteListPage;
