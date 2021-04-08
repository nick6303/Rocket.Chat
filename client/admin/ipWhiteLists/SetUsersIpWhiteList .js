import React, { useMemo, useCallback } from 'react';
import { Box, Field, FieldGroup, Button, Callout, Skeleton, InputBox, ButtonGroup, Throbber, MultiSelectFiltered} from '@rocket.chat/fuselage';
import { useTranslation } from '../../contexts/TranslationContext';
import { useEndpointDataExperimental, ENDPOINT_STATES } from '../../hooks/useEndpointDataExperimental';
import { useEndpointAction } from '../../hooks/useEndpointAction';
import { useEndpointData } from '../../hooks/useEndpointData';
import { useForm } from '../../hooks/useForm';
import IpWhiteListForm from './IpWhiteListForm';
import VerticalBar from '../../components/basic/VerticalBar';
import Page from '../../components/basic/Page';
import './style.css';

export function SetUsersIpWhiteList({ id, ...props }) {

	// 多國語言
	const t = useTranslation();

	// 取得使用者清單
	const query = useMemo(() => ({
		whiteList_id :  id 
	}), [id]);
	const userData = useEndpointData('users.whiteList', query);
	const inWhiteListUsers = useMemo(() => (userData && userData.inWhiteListUsers ? userData.inWhiteListUsers.map(({ _id}) => _id) : null), [userData]);
	const availableUser = useMemo(() => (userData && userData.users ? userData.users.map(({ _id, name, username}) => [_id, name+' ('+username+')' || _id]) : []), [userData]);
	
	// 取得單筆白名單資料
	const query2 = useMemo(() => ({
		query: JSON.stringify({ '_id' : id })
	}), [id]);
	const { data, state, error } = useEndpointDataExperimental('ip-white-list', query2);

	// state 分為 LOADING, DONE, ERROR
	// LOADING 時顯示 載入效果
	if (state === ENDPOINT_STATES.LOADING || availableUser.length == 0) {
		return <Page flexDirection='row'>
			<Page>
				<Page.Header title={t('SetUsers_WhiteList')}>
					<ButtonGroup>
						<Button primary disabled><Throbber inheritColor/></Button>
						<Button ><Throbber inheritColor/></Button>
					</ButtonGroup>
				</Page.Header>
				<Page.Content>
					<FieldGroup>
						<Field>
							<Field.Label>{t('IP')}</Field.Label>
							<Field.Row>
								<Skeleton w='full' mbs='x8'/>
							</Field.Row>
						</Field>
						<Field>
							<Field.Label>{t('IP_Content')}</Field.Label>
							<Field.Row>
								<Skeleton w='full' mbs='x8'/>
							</Field.Row>
						</Field>
						<Field>
						<Field.Label>{t('Users')}</Field.Label>
							<Field.Row>
								<InputBox.Skeleton w='full' mbs='x8'/>
							</Field.Row>
						</Field>
					</FieldGroup>
				</Page.Content>
			</Page>
		</Page>;
	}

	// 取得資料異常
	if (error) {
		return <Callout m='x16' type='danger'>{t('White_list_not_found')}</Callout>;
	}

	return <SetUsersWhiteList data={data.ipwhitelist[0]} availableUser={availableUser} inWhiteListUsers={inWhiteListUsers} {...props}/>;
}

// 初始化資料 (此步可略過)
const getInitialValue = (data,inWhiteListUsers) => ({
	ip: data.ip,
	content: data.content ?? '',
	users:inWhiteListUsers
});


export function SetUsersWhiteList({ goBack, data, availableUser, inWhiteListUsers, ...props }) {
	// 多國語言
	const t = useTranslation();
	// Form 
	const { values, handlers, reset, hasUnsavedChanges } = useForm(getInitialValue(data,inWhiteListUsers));
	const {ip, content, users} = values;
	const {handleUsers} = handlers;

	// 儲存
	const saveQuery = useMemo(() => ({_id: data._id, addUsers: users}),[data._id,users]);
	const saveAction = useEndpointAction('PATCH', 'users.whiteList', saveQuery, t('WhiteList_updated_successfully'));
	const handleSave = useCallback(async () => {
		const save_result = await saveAction();
		if (save_result.success) {
		 	goBack();
		}
	}, [goBack, saveAction]);

	return <Page flexDirection='row'>
			<Page>
				<Page.Header title={t('SetUsers_WhiteList')}>
					<ButtonGroup>
						{useMemo(() => <Button primary disabled={!hasUnsavedChanges} onClick={handleSave}>
							{t('Setting')}
						</Button>, [handleSave, hasUnsavedChanges, t])}
						{useMemo(() => <Button onClick={goBack}>
							{t('返回')}
						</Button>, [goBack, t])}
					</ButtonGroup>
				</Page.Header>
				<Page.Content>
					<FieldGroup>
						{useMemo(() => <Field>
							<Field.Label>{t('IP')}</Field.Label>
							<Field.Row>
								<Field.Label>{ip}</Field.Label>
							</Field.Row>
						</Field>, [t, ip])}
						{useMemo(() => <Field>
							<Field.Label>{t('IP_Content')}</Field.Label>
							<Field.Row>
								<Field.Label>{content}</Field.Label>
							</Field.Row>
						</Field>, [t,content])}
						{useMemo(() => <Field>
						<Field.Label>{t('Users')}</Field.Label>
							<Field.Row>
								<MultiSelectFiltered options={availableUser} value={users} onChange={handleUsers} placeholder={t('Select_users')} flexShrink={1} custom={"ipwhitelist"}/>
							</Field.Row>
						</Field>, [t, users, handleUsers, availableUser])}
					</FieldGroup>
				</Page.Content>
			</Page>
		</Page>;
}