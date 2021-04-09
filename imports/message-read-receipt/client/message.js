import { Template } from 'meteor/templating';
// 201022_nick_red 查看已讀人員 & 圖示改進
import { settings } from '../../../app/settings';
import { modal } from '../../../app/ui-utils';
import { t } from '../../../app/utils';

// 201022_nick_red 查看已讀人員 & 圖示改進
Template.message.events({
	'click .whoRead':(e)=>{
		const messageId = Template.instance().data.msg._id
		modal.open({
			title: t('Info'),
			content: 'readReceipts',
			data: {
				messageId: messageId,
			},
			showConfirmButton: true,
			showCancelButton: false,
			confirmButtonText: t('Close'),
		});
	}
})



Template.message.helpers({
	readReceipt() {
		const { msg ,room } = this //201022_nick_red 查看已讀人員 & 圖示改進
		const isGroup = room.usersCount > 2 //201022_nick_red 查看已讀人員 & 圖示改進
		if (!settings.get('Message_Read_Receipt_Enabled')) {
			return;
		}

		return {
			// 201022_nick_red 查看已讀人員 & 圖示改進
			readByEveryone: (!msg.unread && 'read') || '',
			isGroup,
			readed: !msg.unread,
		};
	},
});
