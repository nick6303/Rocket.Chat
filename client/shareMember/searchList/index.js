// 210413_nick_shareMember 分享聯絡人資訊功能
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Meteor } from 'meteor/meteor';
import { Sidebar, TextInput, Box, Icon } from '@rocket.chat/fuselage';
import { useMutableCallback, useDebouncedValue, useStableArray, useResizeObserver, useAutoFocus, useUniqueId } from '@rocket.chat/fuselage-hooks';
import memoize from 'memoize-one';

import { useTranslation } from '../../contexts/TranslationContext';
import { usePreventDefault } from '../../sidebar/hooks/usePreventDefault';
import { useSetting } from '../../contexts/SettingsContext';
import { useUserPreference, useUserSubscriptions } from '../../contexts/UserContext';
import { itemSizeMap } from '../../sidebar/RoomList';
import { useTemplateByViewMode } from '../../sidebar/hooks/useTemplateByViewMode';
import { useAvatarTemplate } from '../../sidebar/hooks/useAvatarTemplate';
import shareMember from './shareMember'
import { getUserAvatarURL } from '../../../app/utils/lib/getUserAvatarURL';
import './searchList.css'

const createItemData = memoize((items, t, SideBarItemTemplate, AvatarTemplate, useRealName, extended, sidebarViewMode) => ({
	items,
	t,
	SideBarItemTemplate,
	AvatarTemplate,
	useRealName,
	extended,
	sidebarViewMode,
}));

const shortcut = (() => {
	if (!Meteor.Device.isDesktop()) {
		return '';
	}
	if (window.navigator.platform.toLowerCase().includes('mac')) {
		return '(\u2318+K)';
	}
	return '(\u2303+K)';
})();

const options = {
	sort: {
		lm: -1,
		name: 1,
	},
};

const useSearchItems = (filterText) => {
	const expression = /(@|#)?(.*)/i;
	const teste = filterText.match(expression);

	const [, type, name] = teste;
	const query = useMemo(() => {
		const filterRegex = new RegExp(RegExp.escape(name), 'i');

		return {
			$or: [
				{ name: filterRegex },
				{ fname: filterRegex },
			],
			...type && {
				t: type === '@' ? 'd' : { $ne: 'd' },
			},
		};
	}, [name, type]);

	const localRooms = useUserSubscriptions(query, options);

	const usernamesFromClient = useStableArray([...localRooms?.map(({ t, name }) => (t === 'd' ? name : null))].filter(Boolean));

	return useMemo(() => {
		const resultsFromServer = [];

		const filterUsersUnique = ({ _id }, index, arr) => index === arr.findIndex((user) => _id === user._id);
		const roomFilter = (room) => !localRooms.find((item) => (room.t === 'd' && room.uids.length > 1 && room.uids.includes(item._id)) || [item.rid, item._id].includes(room._id));
		const usersfilter = (user) => !localRooms.find((room) => room.t !== 'd' || (room.uids.length === 2 && room.uids.includes(user._id)));

		const userMap = (user) => ({
			_id: user._id,
			t: 'd',
			name: user.username,
			fname: user.name,
			avatarETag: user.avatarETag,
		});

		const exact = resultsFromServer.filter((item) => [item.usernamame, item.name, item.fname].includes(name));

		return { data: Array.from(new Set([...localRooms])), status };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [localRooms, name]);
};

const useInput = (initial) => {
	const [value, setValue] = useState(initial);
	const onChange = useMutableCallback((e) => {
		setValue(e.currentTarget.value);
	});
	return { value, onChange, setValue };
};

const SearchList = React.forwardRef(function SearchList({ params }, ref) {
	const listId = useUniqueId();
	const t = useTranslation();
	const { setValue: setFilterValue, ...filter } = useInput('');

	const autofocus = useAutoFocus();

	const listRef = useRef();

	const selectedElement = useRef();
	const itemIndexRef = useRef(0);

	const sidebarViewMode = useUserPreference('sidebarViewMode');
	const showRealName = useSetting('UI_Use_Real_Name');

	const sideBarItemTemplate = useTemplateByViewMode();
	const avatarTemplate = useAvatarTemplate();

	const itemSize = itemSizeMap(sidebarViewMode);

	const extended = sidebarViewMode === 'extended';

	const filterText = useDebouncedValue(filter.value, 100);

	const placeholder = [t('Search'), shortcut].filter(Boolean).join(' ');

	const { data: items, status } = useSearchItems(filterText);

	const itemData = createItemData(items, t, sideBarItemTemplate, avatarTemplate, showRealName, extended, sidebarViewMode);

	const { ref: boxRef, contentBoxSize: { blockSize = 750 } = {} } = useResizeObserver({ debounceDelay: 100 });

	usePreventDefault(boxRef);

	return <div id="shareMember">
		<Box ref={ref} position='relative'>
			<Sidebar role='search' is='form' w="100%" className="searchBox">
				<svg>
					<use href="#icon-at" />
				</svg>
				<TextInput aria-owns={listId} data-qa='sidebar-search-input' ref={autofocus} {...filter} placeholder={placeholder}/>
			</Sidebar>
			<ul id="memberList">
			{items.map(item=>{
				if(params.fromSideBar || ( item.t === 'd' && item.uids.length === 2 )){
					return (
						<li key={item.rid}>
							<button className="sendMemberMsg" onClick={()=>{shareMember(params, item)}}>
								<figure className="avatar">
									<img src={getUserAvatarURL(item.name)}/>
								</figure>
								@{item.fname??item.name}
							</button>
						</li>
					)
				}
			})}
			</ul>
		</Box>
	</div>;
});

export default SearchList;
