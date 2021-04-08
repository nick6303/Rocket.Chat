import React, { useMemo, useCallback } from 'react';
import { Field, Box, Button } from '@rocket.chat/fuselage';

import { useTranslation } from '../../contexts/TranslationContext';
import { useEndpointAction } from '../../hooks/useEndpointAction';
import { useForm } from '../../hooks/useForm';
import IpWhiteListForm from './IpWhiteListForm';

export function AddIpWhiteList({ goBack, ...props }) {
	// 多國語言
	const t = useTranslation();

	// Form 
	const {values, handlers, hasUnsavedChanges} = useForm({ip: '',content: ''});

	// 新增
	const saveQuery = useMemo(() => values, [JSON.stringify(values)]);
	const saveAction = useEndpointAction('POST', 'ip-white-list', saveQuery, t('WhiteList_created_successfully'));
	const handleSave = useCallback(async () => {
		const result = await saveAction();
		if (result.success) {
			goBack();
		}
	}, [goBack, saveAction]);

	// Append 至 IpWhiteListForm.js
	const append = useMemo(() => <Field>
		<Field.Row>
			<Box display='flex' flexDirection='row' justifyContent='space-between' w='full'>
				<Button flexGrow={1} onClick={goBack} mie='x4'>{t('Cancel')}</Button>
				<Button primary flexGrow={1} disabled={!hasUnsavedChanges} onClick={handleSave}>{t('Save')}</Button>
			</Box>
		</Field.Row>
	</Field>, [t, goBack, handleSave, hasUnsavedChanges]);

	return <IpWhiteListForm formValues={values} formHandlers={handlers} append={append} {...props}/>;
}
