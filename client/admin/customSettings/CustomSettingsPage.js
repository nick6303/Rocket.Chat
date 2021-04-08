import { Button, ButtonGroup, Icon, Field, ToggleSwitch, Box} from '@rocket.chat/fuselage';
import React, { useState, useCallback, useMemo } from 'react';

import Page from '../../components/basic/Page';
import VerticalBar from '../../components/basic/VerticalBar';
import { useTranslation } from '../../contexts/TranslationContext';
import { useRouteParameter, useRoute } from '../../contexts/RouterContext';
import { useForm } from '../../hooks/useForm';
import { useEndpointDataExperimental, ENDPOINT_STATES } from '../../hooks/useEndpointDataExperimental';
import { useEndpointAction } from '../../hooks/useEndpointAction';

export function CustomSettingsPage() {	

	const { data: customSetting, state: state, error: error } = useEndpointDataExperimental('custom-settings', '') || {};

	if (state === ENDPOINT_STATES.LOADING) {
		return false;
	}

	return <CustomSettingForm  customSetting={customSetting} />;

}

export function CustomSettingForm( { customSetting } ) {

	const t = useTranslation();
	for (var i=0; i < customSetting.CustomSettinglist.length; i++) {
		if (customSetting.CustomSettinglist[i]._id == 'App') {
			AppisEnable = customSetting.CustomSettinglist[i].isEnable;
		}
		if (customSetting.CustomSettinglist[i]._id == 'IpWhiteList') {
			IpWhiteListisEnable = customSetting.CustomSettinglist[i].isEnable;
		}
	}

	const {values, handlers} = useForm({App: AppisEnable, IpWhiteList: IpWhiteListisEnable});
	const {App, IpWhiteList} = values;
	const {handleApp, handleIpWhiteList} = handlers;

	const SaveAction = useEndpointAction('patch', 'custom-settings', values, t('Success'));

	// save
	const saveButtonClick = async() => {
		await SaveAction();
	};

	return <Page flexDirection='row'>
		<Page>
			<Page.Header title={t('客製設定')}>
				<Button primary onClick={saveButtonClick}>{t('Save_changes')}</Button>
			</Page.Header>
			<Page.Content>
				<Box maxWidth='x600' w='full' alignSelf='center'>
					{useMemo(() =>　<Field>	
						<Field.Row>
							<ToggleSwitch checked={App} onChange={handleApp}  />
							<Field.Label >{'開啟限制 App 登入功能'}</Field.Label>   
						</Field.Row>
					</Field>, [App, handleApp])}
				</Box>
				<Box maxWidth='x600' w='full' alignSelf='center'>
					{useMemo(() =>　<Field>	
						<Field.Row>
							<ToggleSwitch checked={IpWhiteList} onChange={handleIpWhiteList}  />
							<Field.Label >{'開啟限制 IP 白名單登入功能'}</Field.Label>   
						</Field.Row>
					</Field>, [IpWhiteList, handleIpWhiteList])}
				</Box>
			</Page.Content>
		</Page>
	</Page>;
}