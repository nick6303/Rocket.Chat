import React, { useMemo, useCallback } from 'react';
import { Box, Field, FieldGroup, Margins, Button, Callout, Skeleton, InputBox, ButtonGroup, Throbber, Icon, Modal} from '@rocket.chat/fuselage';
import { useTranslation } from '../../contexts/TranslationContext';
import { useEndpointDataExperimental, ENDPOINT_STATES } from '../../hooks/useEndpointDataExperimental';
import { useEndpointAction } from '../../hooks/useEndpointAction';
import { useRoute } from '../../contexts/RouterContext';
import { useForm } from '../../hooks/useForm';
import { useSetModal } from '../../contexts/ModalContext';
import IpWhiteListForm from './IpWhiteListForm';

export function EditIpWhiteList({ id, ...props }) {

	// 多國語言
	const t = useTranslation();

	// 取得單筆資料
	const query = useMemo(() => ({
		query: JSON.stringify({ '_id' : id })
	}), [id]);
	const { data, state, error } = useEndpointDataExperimental('ip-white-list', query);


	// state 分為 LOADING, DONE, ERROR
	// LOADING 時顯示 載入效果
	if (state === ENDPOINT_STATES.LOADING) {
		return <Box pb='x20'>
			<Skeleton mbs='x8'/>
			<InputBox.Skeleton w='full'/>
			<Skeleton mbs='x8'/>
			<InputBox.Skeleton w='full' mbs='x8'/>
			<ButtonGroup stretch w='full' mbs='x8'>
				<Button disabled><Throbber inheritColor/></Button>
				<Button primary disabled><Throbber inheritColor/></Button>
			</ButtonGroup>
			<ButtonGroup stretch w='full' mbs='x8'>
				<Button primary disabled><Throbber inheritColor/></Button>
			</ButtonGroup>
			<ButtonGroup stretch w='full' mbs='x8'>
				<Button primary danger disabled><Throbber inheritColor/></Button>
			</ButtonGroup>
		</Box>;
	}

	// 取得資料異常
	if (error) {
		return <Callout m='x16' type='danger'>{t('White_list_not_found')}</Callout>;
	}

	// 正常狀態
	return <EditWhiteList data={data.ipwhitelist[0]} {...props}/>;
}

// 初始化資料 (此步可略過)
const getInitialValue = (data) => ({
	ip: data.ip,
	content: data.content ?? ''
});


export function EditWhiteList({ goBack, data, ...props }) {
	// 多國語言
	const t = useTranslation();

	// Form 
	const { values, handlers, reset, hasUnsavedChanges } = useForm(getInitialValue(data));

	// Modal
	const setModal = useSetModal();

	// Route
	const ipWhiteListsRoute = useRoute('ip-white-list');

	// 設定至使用者
	const handleSetUsersButtonClick = useCallback((_id) => () => ipWhiteListsRoute.push({
		context: 'setUsers',
		id: _id,
	}), [ipWhiteListsRoute]);
	
	// 儲存
	const saveQuery = useMemo(() => ({_id: data._id, data: values}),[data._id, JSON.stringify(values)]);
	const saveAction = useEndpointAction('PATCH', 'ip-white-list', saveQuery, t('WhiteList_updated_successfully'));
	const handleSave = useCallback(async () => {
		const save_result = await saveAction();
		if (save_result.success) {
			goBack();
		}
	}, [goBack, saveAction]);

	// 刪除
	const deleteQuery = useMemo(() => ({_id: data._id}), [data._id]);
	const deleteAction = useEndpointAction('DELETE', 'ip-white-list', deleteQuery);
	const handleDelete = useCallback(async () => {
		const delete_result = await deleteAction();
		if (delete_result.success) {
			//刪除成功Modal
			setModal(() => <SuccessModal onClose={() => { setModal(undefined); goBack();}}/>);
		}
	}, [setModal, goBack, deleteAction]);

	// 刪除Modal
	const openConfirmDelete = () => setModal(() => <DeleteWarningModal onDelete={handleDelete} onCancel={() => setModal(undefined)}/>);

	// Append 至 IpWhiteListForm.js
	const append = useMemo(() => <Field>
		<Field.Row>
			<Box display='flex' flexDirection='row' justifyContent='space-between' w='full'>
				<Margins inlineEnd='x4'>
					<Button flexGrow={1} onClick={goBack}>{t('Cancel')}</Button>
					<Button primary mie='none' flexGrow={1} disabled={!hasUnsavedChanges} onClick={handleSave}>{t('Save')}</Button>
				</Margins>
			</Box>
		</Field.Row>
		<Field.Row>
			<ButtonGroup stretch w='full'>
				<Button primary onClick={handleSetUsersButtonClick(data._id)} ><Icon name='import' mie='x4'/>{t('SetUsers_WhiteList')}</Button>
			</ButtonGroup>
		</Field.Row>
		<Field.Row>
			<ButtonGroup stretch w='full'>
				<Button primary danger onClick={openConfirmDelete}><Icon name='trash' mie='x4'/>{t('Delete')}</Button>
			</ButtonGroup>
		</Field.Row>
	</Field>, [goBack, handleSave, hasUnsavedChanges, reset, t, handleSetUsersButtonClick, openConfirmDelete]);

	return <IpWhiteListForm formValues={values} formHandlers={handlers} append={append} {...props}/>;
}

// 刪除Modal
const DeleteWarningModal = ({ onDelete, onCancel, ...props }) => {
	const t = useTranslation();
	return <Modal {...props}>
		<Modal.Header>
			<Icon color='danger' name='modal-warning' size={20}/>
			<Modal.Title>{t('Are_you_sure')}</Modal.Title>
			<Modal.Close onClick={onCancel}/>
		</Modal.Header>
		<Modal.Content fontScale='p1'>
			{t('WhiteList_Delete_Warning')}
		</Modal.Content>
		<Modal.Footer>
			<ButtonGroup align='end'>
				<Button ghost onClick={onCancel}>{t('Cancel')}</Button>
				<Button primary danger onClick={onDelete}>{t('Delete')}</Button>
			</ButtonGroup>
		</Modal.Footer>
	</Modal>;
};
// 刪除成功Modal
const SuccessModal = ({ onClose, ...props }) => {
	const t = useTranslation();
	return <Modal {...props}>
		<Modal.Header>
			<Icon color='success' name='checkmark-circled' size={20}/>
			<Modal.Title>{t('Deleted')}</Modal.Title>
			<Modal.Close onClick={onClose}/>
		</Modal.Header>
		<Modal.Content fontScale='p1'>
			{t('WhiteList_Has_Been_Deleted')}
		</Modal.Content>
		<Modal.Footer>
			<ButtonGroup align='end'>
				<Button primary onClick={onClose}>{t('Ok')}</Button>
			</ButtonGroup>
		</Modal.Footer>
	</Modal>;
};
