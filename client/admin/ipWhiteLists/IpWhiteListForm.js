import React, { useCallback, useMemo } from 'react';
import { Field, TextInput, TextAreaInput, Icon, FieldGroup } from '@rocket.chat/fuselage';

import { useTranslation } from '../../contexts/TranslationContext';
import VerticalBar from '../../components/basic/VerticalBar';

export default function IpWhiteListForm({ formValues, formHandlers, prepend, append, ...props }) {
	const t = useTranslation();
	const {ip, content} = formValues;
	const {handleIp, handleContent} = formHandlers;
	
	return <VerticalBar.ScrollableContent is='form' onSubmit={useCallback((e) => e.preventDefault(), [])} { ...props }>
		<FieldGroup>
			{ prepend }
			{useMemo(() => <Field>
				<Field.Label>{t('IP')}</Field.Label>
				<Field.Row>
					<TextInput flexGrow={1} value={ip} onChange={handleIp}/>
				</Field.Row>
				<Field.Label>輸入範例</Field.Label>
				<Field.Label>IPv4</Field.Label>
				<Field.Label>210.68.95.162</Field.Label>
				<Field.Label>210.68.95.160/29</Field.Label>
				<Field.Label>IPv6</Field.Label>
				<Field.Label>2001:b030:8136:ff03::1</Field.Label>
				<Field.Label>2001:b030:8136:ff03::0/124</Field.Label>
			</Field>, [t, ip, handleIp])}
			{useMemo(() => <Field>
				<Field.Label>{t('IP_Content')}</Field.Label>
				<Field.Row>
					<TextAreaInput rows={3} flexGrow={1} value={content} onChange={handleContent}
					 addon={<Icon name='edit' size='x20' alignSelf='center'/>}/>
				</Field.Row>
			</Field>, [t,content, handleContent])}
			{ append }
		</FieldGroup>
	</VerticalBar.ScrollableContent>;
}