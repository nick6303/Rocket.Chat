import { Meteor } from 'meteor/meteor';
import { Match, check } from 'meteor/check';
import _ from 'underscore';
import s from 'underscore.string';

import { CustomSettings } from '../../../models/server';
import { API } from '../api';

API.v1.addRoute('custom-settings', { authRequired: true }, {
	get() { // 列表
		const { offset, count } = this.getPaginationItems();
		const { sort, fields, query } = this.parseJsonQuery();

		const CustomSettinglist = CustomSettings.find(query, {
			sort: sort || { isEnable: 1 },
			skip: offset,
			limit: count,
			fields,
		}).fetch();		

		return API.v1.success({
			CustomSettinglist,
		});
	},
	patch() { // 更新
		const keys = Object.keys(this.bodyParams);
		const values = Object.values(this.bodyParams);
		var status = false;

		for (var i=0; i < keys.length; i++) {
			const old_CustomSettingData = CustomSettings.findOneById(keys[i]);

			if (!old_CustomSettingData) {
				return API.v1.failure(`No White List found with the id of "${ keys[i] }".`);
			}

			const update_rs = CustomSettings.save(keys[i], values[i]);
			if (update_rs) { 	
				status = true;
			}
		}

		if (status) {
			return API.v1.success();
		}

		return API.v1.failure('update failure');
	}
});
