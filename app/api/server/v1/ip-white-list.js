import { Meteor } from 'meteor/meteor';
import { Match, check } from 'meteor/check';
import _ from 'underscore';
import s from 'underscore.string';

import { IpWhiteList } from '../../../models/server';
import { API } from '../api';

import { checkIp, getIpRange } from '../../../lib';

API.v1.addRoute('ip-white-list', { authRequired: true }, {
	get() { // 列表
		const { offset, count } = this.getPaginationItems();
		const { sort, fields, query } = this.parseJsonQuery();

		const ipwhitelist = IpWhiteList.find(query, {
			sort: sort || { ip: 1 },
			skip: offset,
			limit: count,
			fields,
		}).fetch();

		for (let i in ipwhitelist) {
			const ipRange = getIpRange(ipwhitelist[i]['ip']);
			if (ipRange.type == 1) {
				ipwhitelist[i]['detail'] = ipRange.start;
			} else {
				ipwhitelist[i]['detail'] = `${ ipRange.start } ~ ${ ipRange.end }`;
			}
		}
		
		return API.v1.success({ipwhitelist});
	},
	post() { // 新增
		check(this.bodyParams, {
			ip: String,
			content: Match.Maybe(String),
		});

		const createWhiteList = {
			ip:  this.bodyParams.ip,
			content:  this.bodyParams.content,
		};


		if (!s.trim(createWhiteList.ip)) {
			throw new Meteor.Error('error-the-field-is-required', 'The field IP is required', {
				method: 'insertOrUpdateWhiteList',
				field: 'IP',
			});
		}

		// 檢查IP正則規範及網段遮罩驗證
		checkIp(createWhiteList.ip);

 		const _id = IpWhiteList.create(createWhiteList);
		const { fields } = this.parseJsonQuery();

		return API.v1.success({ ip: IpWhiteList.findOneById(_id, { fields }) });
	},
	patch() { // 更新
		check(this.bodyParams, {
			_id: String,
			data: Match.ObjectIncluding({
				ip: String,
				content: Match.Maybe(String)
			})
		});

 		const old_ipWhiteListData = IpWhiteList.findOneById(this.bodyParams._id);

		if (!old_ipWhiteListData) {
			return API.v1.failure(`No White List found with the id of "${ this.bodyParams._id}".`);
		}

		if (!s.trim(this.bodyParams.data.ip)) {
			throw new Meteor.Error('error-the-field-is-required', 'The field IP is required', {
				method: 'insertOrUpdateWhiteList',
				field: 'IP',
			});
		}

		// 檢查IP正則規範及網段遮罩驗證
		checkIp(this.bodyParams.data.ip);
		
		const update_rs = IpWhiteList.save(this.bodyParams._id,this.bodyParams.data);
		if (update_rs) {
			return API.v1.success();
		}
		return API.v1.failure('update failure');
	},
	delete() { // 刪除		
		const delete_rs = IpWhiteList.delete(this.queryParams._id);
		if (delete_rs) {
			return API.v1.success();
		}
		return API.v1.failure('delete failure');
	}
});
