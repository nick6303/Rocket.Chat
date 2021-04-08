import { Box, Table, TextInput, Icon } from '@rocket.chat/fuselage';
import { useDebouncedValue, useMediaQuery } from '@rocket.chat/fuselage-hooks';
import React, { useMemo, useCallback, useState, useEffect } from 'react';
import UserAvatar from '../../components/basic/avatar/UserAvatar';
import GenericTable from '../../components/GenericTable';
import { useTranslation } from '../../contexts/TranslationContext';
import { useRoute } from '../../contexts/RouterContext';
import { useEndpointData } from '../../hooks/useEndpointData';
import { useEndpointAction } from '../../hooks/useEndpointAction';

const style = { whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' };

const FilterByText = ({ setFilter, ...props }) => {
	const t = useTranslation();
	const [text, setText] = useState('');
	const handleChange = useCallback((event) => setText(event.currentTarget.value), []);

	useEffect(() => {
		setFilter({ text });
	}, [setFilter, text]);
	return <Box mb='x16' is='form' onSubmit={useCallback((e) => e.preventDefault(), [])} display='flex' flexDirection='column' {...props}>
		<TextInput flexShrink={0} placeholder={t('Search_IP')} addon={<Icon name='magnifier' size='x20'/>} onChange={handleChange} value={text} />
	</Box>;
};

const sortDir = (sortDir) => (sortDir === 'asc' ? 1 : -1);
const IpWhiteListRow = ({ _id, ip, content, detail, onClick }) => {
	const t = useTranslation();
	return <Table.Row onKeyDown={onClick(_id)} onClick={onClick(_id)} tabIndex={0} role='link' action qa-user-id={_id}>
		<Table.Cell>{ip}</Table.Cell>
		<Table.Cell color='hint'>{detail}</Table.Cell>
		<Table.Cell>{content}</Table.Cell>
	</Table.Row>;
};

const useQuery = ({ text, itemsPerPage, current }, [column, direction], cache) => useMemo(() => ({
	fields: JSON.stringify({ ip: 1, content: 1}),
	query: JSON.stringify({
		$or: [
			{ ip: { $regex: text || '', $options: 'i' } },
			{ content: { $regex: text || '', $options: 'i' } },
		],
	}),
	sort: JSON.stringify({ [column]: sortDir(direction) }),
	...itemsPerPage && { count: itemsPerPage },
	...current && { offset: current },
}), [text, itemsPerPage, current, column, direction, cache]);

export function IpWhiteListTable(cache) {
	const t = useTranslation();

	const [params, setParams] = useState({ text: '', current: 0, itemsPerPage: 25 }); // 搜尋狀態
	const [sort, setSort] = useState(['ip', 'asc']); // 排序

	const debouncedParams = useDebouncedValue(params, 500);
	const debouncedSort = useDebouncedValue(sort, 500);
	const query = useQuery(debouncedParams, debouncedSort,cache);

	const data = useEndpointData('ip-white-list', query) || {};
	
	const ipWhiteListsRoute = useRoute('ip-white-list');

	const onClick = useCallback((_id) => () => ipWhiteListsRoute.push({
		context: 'edit',
		id: _id,
	}), [ipWhiteListsRoute]);

	const onHeaderClick = useCallback((id) => {
		const [sortBy, sortDirection] = sort;

		if (sortBy === id) {
			setSort([id, sortDirection === 'asc' ? 'desc' : 'asc']);
			return;
		}
		setSort([id, 'asc']);
	}, [sort]);

	const mediaQuery = useMediaQuery('(min-width: 1024px)');

	return <GenericTable
		FilterComponent={FilterByText}
		header={<>
			<GenericTable.HeaderCell key={'ip'} direction={sort[1]} active={sort[0] === 'ip'} onClick={onHeaderClick} sort='ip'>
				{t('IP')}
			</GenericTable.HeaderCell>
			<GenericTable.HeaderCell onClick={onHeaderClick}>IP範圍</GenericTable.HeaderCell>
			<GenericTable.HeaderCell key={'content'} direction={sort[1]} active={sort[0] === 'content'} onClick={onHeaderClick} sort='content'>
				{t('IP_Content')}
			</GenericTable.HeaderCell>
		</>}
		results={data.ipwhitelist}
		total={data.total}
		setParams={setParams}
		params={params}
		> 
		{(props) => <IpWhiteListRow key={props._id} onClick={onClick} {...props}/>}
	</GenericTable>;
}

export default IpWhiteListTable;
