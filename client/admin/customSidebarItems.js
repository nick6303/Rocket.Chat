import { hasPermission, hasRole } from '../../app/authorization/client';
import { registerAdminSidebarItem } from '../admin';

// 自訂新的目錄
registerAdminSidebarItem({
	icon: 'shield-check',
	href: 'ip-white-list',
	i18nLabel: '白名單', // 暫時
	permissionGranted() {
		return hasPermission('view-ip-white-list'); // 暫時
	},
});

//  客製設定
registerAdminSidebarItem({
	icon: 'cog',
	href: 'custom-settings',
	i18nLabel: '客製設定',
	permissionGranted() {
		return hasPermission('view-custom-settings');
	},
});

/* 所有圖示 */
/*
registerAdminSidebarItem({
    icon: 'arrow-back',
    i18nLabel: '<圖示> arrow-back',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'arrow-collapse',
    i18nLabel: '<圖示> arrow-collapse',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'arrow-down',
    i18nLabel: '<圖示> arrow-down',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'arrow-down-box',
    i18nLabel: '<圖示> arrow-down-box',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'arrow-expand',
    i18nLabel: '<圖示> arrow-expand',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'arrow-fall',
    i18nLabel: '<圖示> arrow-fall',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'arrow-jump',
    i18nLabel: '<圖示> arrow-jump',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'arrow-loop',
    i18nLabel: '<圖示> arrow-loop',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'arrow-return',
    i18nLabel: '<圖示> arrow-return',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'arrow-rise',
    i18nLabel: '<圖示> arrow-rise',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'arrow-up-box',
    i18nLabel: '<圖示> arrow-up-box',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'at',
    i18nLabel: '<圖示> at',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'avatar',
    i18nLabel: '<圖示> avatar',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'backspace',
    i18nLabel: '<圖示> backspace',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'bag',
    i18nLabel: '<圖示> bag',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'ball',
    i18nLabel: '<圖示> ball',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'baloon-ellipsis',
    i18nLabel: '<圖示> baloon-ellipsis',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'baloon-exclamation',
    i18nLabel: '<圖示> baloon-exclamation',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'baloon-text',
    i18nLabel: '<圖示> baloon-text',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'baloons',
    i18nLabel: '<圖示> baloons',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'ban',
    i18nLabel: '<圖示> ban',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'bell',
    i18nLabel: '<圖示> bell',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'bell-off',
    i18nLabel: '<圖示> bell-off',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'bold',
    i18nLabel: '<圖示> bold',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'book',
    i18nLabel: '<圖示> book',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'business',
    i18nLabel: '<圖示> business',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'calendar',
    i18nLabel: '<圖示> calendar',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'camera',
    i18nLabel: '<圖示> camera',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'card',
    i18nLabel: '<圖示> card',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'check',
    i18nLabel: '<圖示> check',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'chevron-down',
    i18nLabel: '<圖示> chevron-down',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'chevron-expand',
    i18nLabel: '<圖示> chevron-expand',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'chevron-left',
    i18nLabel: '<圖示> chevron-left',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'chevron-right',
    i18nLabel: '<圖示> chevron-right',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'chevron-up',
    i18nLabel: '<圖示> chevron-up',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'circle-arrow-down',
    i18nLabel: '<圖示> circle-arrow-down',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'circle-check',
    i18nLabel: '<圖示> circle-check',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'circle-cross',
    i18nLabel: '<圖示> circle-cross',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'clip',
    i18nLabel: '<圖示> clip',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'clipboard',
    i18nLabel: '<圖示> clipboard',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'clock',
    i18nLabel: '<圖示> clock',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'cloud-arrow-up',
    i18nLabel: '<圖示> cloud-arrow-up',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'cloud-plus',
    i18nLabel: '<圖示> cloud-plus',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'code',
    i18nLabel: '<圖示> code',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'cog',
    i18nLabel: '<圖示> cog',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'condensed-view',
    i18nLabel: '<圖示> condensed-view',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'copy',
    i18nLabel: '<圖示> copy',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'cross',
    i18nLabel: '<圖示> cross',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'cube',
    i18nLabel: '<圖示> cube',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'customize',
    i18nLabel: '<圖示> customize',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'desktop',
    i18nLabel: '<圖示> desktop',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'dialpad',
    i18nLabel: '<圖示> dialpad',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'doc',
    i18nLabel: '<圖示> doc',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'doner',
    i18nLabel: '<圖示> doner',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'emoji',
    i18nLabel: '<圖示> emoji',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'emoji-plus',
    i18nLabel: '<圖示> emoji-plus',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'eraser',
    i18nLabel: '<圖示> eraser',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'exit',
    i18nLabel: '<圖示> exit',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'extended-view',
    i18nLabel: '<圖示> extended-view',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'eye',
    i18nLabel: '<圖示> eye',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'eye-off',
    i18nLabel: '<圖示> eye-off',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'file',
    i18nLabel: '<圖示> file',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'fingerprint',
    i18nLabel: '<圖示> fingerprint',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'flag',
    i18nLabel: '<圖示> flag',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'folder',
    i18nLabel: '<圖示> folder',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'globe',
    i18nLabel: '<圖示> globe',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'group-by-type',
    i18nLabel: '<圖示> group-by-type',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'h-bar',
    i18nLabel: '<圖示> h-bar',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'hash',
    i18nLabel: '<圖示> hash',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'headset',
    i18nLabel: '<圖示> headset',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'help',
    i18nLabel: '<圖示> help',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'history',
    i18nLabel: '<圖示> history',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'home',
    i18nLabel: '<圖示> home',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'image',
    i18nLabel: '<圖示> image',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'info',
    i18nLabel: '<圖示> info',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'italic',
    i18nLabel: '<圖示> italic',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'joystick',
    i18nLabel: '<圖示> joystick',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'kebab',
    i18nLabel: '<圖示> kebab',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'key',
    i18nLabel: '<圖示> key',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'keyboard',
    i18nLabel: '<圖示> keyboard',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'language',
    i18nLabel: '<圖示> language',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'link',
    i18nLabel: '<圖示> link',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'live',
    i18nLabel: '<圖示> live',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'lock',
    i18nLabel: '<圖示> lock',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'magnifier',
    i18nLabel: '<圖示> magnifier',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'mail',
    i18nLabel: '<圖示> mail',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'meatballs',
    i18nLabel: '<圖示> meatballs',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'medium-view',
    i18nLabel: '<圖示> medium-view',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'mic',
    i18nLabel: '<圖示> mic',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'mic-off',
    i18nLabel: '<圖示> mic-off',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'mobile',
    i18nLabel: '<圖示> mobile',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'moon',
    i18nLabel: '<圖示> moon',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'musical-note',
    i18nLabel: '<圖示> musical-note',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'new-window',
    i18nLabel: '<圖示> new-window',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'pause',
    i18nLabel: '<圖示> pause',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'pencil',
    i18nLabel: '<圖示> pencil',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'pencil-box',
    i18nLabel: '<圖示> pencil-box',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'phone',
    i18nLabel: '<圖示> phone',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'pin',
    i18nLabel: '<圖示> pin',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'pin-map',
    i18nLabel: '<圖示> pin-map',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'play',
    i18nLabel: '<圖示> play',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'plus',
    i18nLabel: '<圖示> plus',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'podcast',
    i18nLabel: '<圖示> podcast',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'quote',
    i18nLabel: '<圖示> quote',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'rec',
    i18nLabel: '<圖示> rec',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'refresh',
    i18nLabel: '<圖示> refresh',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'send',
    i18nLabel: '<圖示> send',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'send-filled',
    i18nLabel: '<圖示> send-filled',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'sheet',
    i18nLabel: '<圖示> sheet',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'shield',
    i18nLabel: '<圖示> shield',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'shield-check',
    i18nLabel: '<圖示> shield-check',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'signal',
    i18nLabel: '<圖示> signal',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'sort',
    i18nLabel: '<圖示> sort',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'sort-az',
    i18nLabel: '<圖示> sort-az',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'squares',
    i18nLabel: '<圖示> squares',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'stack',
    i18nLabel: '<圖示> stack',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'star',
    i18nLabel: '<圖示> star',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'star-filled',
    i18nLabel: '<圖示> star-filled',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'strike',
    i18nLabel: '<圖示> strike',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'sun',
    i18nLabel: '<圖示> sun',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'team',
    i18nLabel: '<圖示> team',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'trash',
    i18nLabel: '<圖示> trash',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'underline',
    i18nLabel: '<圖示> underline',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'undo',
    i18nLabel: '<圖示> undo',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'user',
    i18nLabel: '<圖示> user',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'user-arrow-right',
    i18nLabel: '<圖示> user-arrow-right',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'user-plus',
    i18nLabel: '<圖示> user-plus',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'video',
    i18nLabel: '<圖示> video',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'video-disabled',
    i18nLabel: '<圖示> video-disabled',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'video-filled',
    i18nLabel: '<圖示> video-filled',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'video-off',
    i18nLabel: '<圖示> video-off',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'volume',
    i18nLabel: '<圖示> volume',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'volume-disabled',
    i18nLabel: '<圖示> volume-disabled',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'volume-off',
    i18nLabel: '<圖示> volume-off',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'warning',
    i18nLabel: '<圖示> warning',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'zip',
    i18nLabel: '<圖示> zip',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'add-reaction',
    i18nLabel: '<圖示> add-reaction',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'add-user',
    i18nLabel: '<圖示> add-user',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'attachment',
    i18nLabel: '<圖示> attachment',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'audio',
    i18nLabel: '<圖示> audio',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'back',
    i18nLabel: '<圖示> back',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'cancel',
    i18nLabel: '<圖示> cancel',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'canned-response',
    i18nLabel: '<圖示> canned-response',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'chat',
    i18nLabel: '<圖示> chat',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'checkmark-circled',
    i18nLabel: '<圖示> checkmark-circled',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'circled-arrow-down',
    i18nLabel: '<圖示> circled-arrow-down',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'computer',
    i18nLabel: '<圖示> computer',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'discover',
    i18nLabel: '<圖示> discover',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'discussion',
    i18nLabel: '<圖示> discussion',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'download',
    i18nLabel: '<圖示> download',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'edit',
    i18nLabel: '<圖示> edit',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'edit-rounded',
    i18nLabel: '<圖示> edit-rounded',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'file-document',
    i18nLabel: '<圖示> file-document',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'file-generic',
    i18nLabel: '<圖示> file-generic',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'file-google-drive',
    i18nLabel: '<圖示> file-google-drive',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'file-pdf',
    i18nLabel: '<圖示> file-pdf',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'file-sheets',
    i18nLabel: '<圖示> file-sheets',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'files-audio',
    i18nLabel: '<圖示> files-audio',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'files-video',
    i18nLabel: '<圖示> files-video',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'files-zip',
    i18nLabel: '<圖示> files-zip',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'game',
    i18nLabel: '<圖示> game',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'hashtag',
    i18nLabel: '<圖示> hashtag',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'import',
    i18nLabel: '<圖示> import',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'info-circled',
    i18nLabel: '<圖示> info-circled',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'jump',
    i18nLabel: '<圖示> jump',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'jump-to-message',
    i18nLabel: '<圖示> jump-to-message',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'livechat',
    i18nLabel: '<圖示> livechat',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'map-pin',
    i18nLabel: '<圖示> map-pin',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'menu',
    i18nLabel: '<圖示> menu',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'modal-warning',
    i18nLabel: '<圖示> modal-warning',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'multiline',
    i18nLabel: '<圖示> multiline',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'permalink',
    i18nLabel: '<圖示> permalink',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'post',
    i18nLabel: '<圖示> post',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'queue',
    i18nLabel: '<圖示> queue',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'reload',
    i18nLabel: '<圖示> reload',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'reply-directly',
    i18nLabel: '<圖示> reply-directly',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'report',
    i18nLabel: '<圖示> report',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'send-active',
    i18nLabel: '<圖示> send-active',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'share',
    i18nLabel: '<圖示> share',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'shield-alt',
    i18nLabel: '<圖示> shield-alt',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'sign-out',
    i18nLabel: '<圖示> sign-out',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'sort-amount-down',
    i18nLabel: '<圖示> sort-amount-down',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'th-list',
    i18nLabel: '<圖示> th-list',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'thread',
    i18nLabel: '<圖示> thread',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'upload',
    i18nLabel: '<圖示> upload',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'user-rounded',
    i18nLabel: '<圖示> user-rounded',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'circle',
    i18nLabel: '<圖示> circle',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'file-keynote',
    i18nLabel: '<圖示> file-keynote',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'hand-pointer',
    i18nLabel: '<圖示> hand-pointer',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'list',
    i18nLabel: '<圖示> list',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'list-alt',
    i18nLabel: '<圖示> list-alt',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'loading',
    i18nLabel: '<圖示> loading',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'message',
    i18nLabel: '<圖示> message',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'play-solid',
    i18nLabel: '<圖示> play-solid',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'reply',
    i18nLabel: '<圖示> reply',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'adobe',
    i18nLabel: '<圖示> adobe',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'facebook',
    i18nLabel: '<圖示> facebook',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'github',
    i18nLabel: '<圖示> github',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'gitlab',
    i18nLabel: '<圖示> gitlab',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'google',
    i18nLabel: '<圖示> google',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'google-drive',
    i18nLabel: '<圖示> google-drive',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'hubot',
    i18nLabel: '<圖示> hubot',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'linkedin',
    i18nLabel: '<圖示> linkedin',
    href: 'link'
});
registerAdminSidebarItem({
    icon: 'twitter',
    i18nLabel: '<圖示> twitter',
    href: 'link'
});
*/