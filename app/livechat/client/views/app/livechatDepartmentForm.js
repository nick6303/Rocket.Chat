import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Template } from 'meteor/templating';
import _ from 'underscore';
import toastr from 'toastr';

import { TabBar, RocketChatTabBar } from '../../../../ui-utils';
import { t, handleError } from '../../../../utils';
import { hasPermission } from '../../../../authorization';
import { getCustomFormTemplate } from './customTemplates/register';
import './livechatDepartmentForm.html';
import { APIClient, roomTypes } from '../../../../utils/client';

const LIST_SIZE = 50;

const saveDepartmentsAgents = async (_id, instance) => {
	const upsert = [...instance.agentsToUpsert.values()];
	const remove = [...instance.agentsToRemove.values()];
	if (!upsert.length && !remove.length) {
		return;
	}
	return APIClient.v1.post(`livechat/department/${ _id }/agents`, {
		upsert,
		remove,
	});
};

Template.livechatDepartmentForm.helpers({
	department() {
		return Template.instance().department.get();
	},
	agents() {
		return Template.instance().department && !_.isEmpty(Template.instance().department.get()) ? Template.instance().department.get().agents : [];
	},
	departmentAgents() {
		return _.sortBy(Template.instance().departmentAgents.get(), 'username');
	},
	showOnRegistration(value) {
		const department = Template.instance().department.get();
		return department.showOnRegistration === value || (department.showOnRegistration === undefined && value === true);
	},
	showOnOfflineForm(value) {
		const department = Template.instance().department.get();
		return department.showOnOfflineForm === value || (department.showOnOfflineForm === undefined && value === true);
	},
	requestTagBeforeClosingChat() {
		const department = Template.instance().department.get();
		return !!(department && department.requestTagBeforeClosingChat);
	},
	customFieldsTemplate() {
		return getCustomFormTemplate('livechatDepartmentForm');
	},
	data() {
		return { id: FlowRouter.getParam('_id') };
	},
	exceptionsAgents() {
		return _.pluck(Template.instance().departmentAgents.get(), 'username');
	},
	agentModifier() {
		return (filter, text = '') => {
			const f = filter.get();
			return `@${
				f.length === 0
					? text
					: text.replace(
						new RegExp(filter.get()),
						(part) => `<strong>${ part }</strong>`,
					)
			}`;
		};
	},
	agentConditions() {
		return { roles: 'livechat-agent' };
	},
	onSelectAgents() {
		return Template.instance().onSelectAgents;
	},
	selectedAgents() {
		return Template.instance().selectedAgents.get();
	},
	onClickTagAgents() {
		return Template.instance().onClickTagAgents;
	},
	flexData() {
		return {
			tabBar: Template.instance().tabBar,
			data: Template.instance().tabBarData.get(),
		};
	},
	tabBarVisible() {
		return Object.values(TabBar.buttons.get())
			.some((button) => button.groups
				.some((group) => group.startsWith('livechat-department')));
	},
	chatClosingTags() {
		return Template.instance().chatClosingTags.get();
	},
	availableDepartmentTags() {
		return Template.instance().availableDepartmentTags.get();
	},
	hasAvailableTags() {
		return [...Template.instance().availableTags.get()].length > 0;
	},
	hasChatClosingTags() {
		return [...Template.instance().chatClosingTags.get()].length > 0;
	},
	onTableScroll() {
		const instance = Template.instance();
		return function(currentTarget) {
			if (currentTarget.offsetHeight + currentTarget.scrollTop < currentTarget.scrollHeight - 100) {
				return;
			}
			const agents = instance.departmentAgents.get();
			if (instance.total.get() > agents.length) {
				instance.offset.set(instance.offset.get() + LIST_SIZE);
			}
		};
	},
	onClickTagOfflineMessageChannel() {
		return Template.instance().onClickTagOfflineMessageChannel;
	},
	selectedOfflineMessageChannel() {
		return Template.instance().offlineMessageChannel.get();
	},
	onSelectOfflineMessageChannel() {
		return Template.instance().onSelectOfflineMessageChannel;
	},
	offlineMessageChannelModifier() {
		return (filter, text = '') => {
			const f = filter.get();
			return `#${ f.length === 0 ? text : text.replace(new RegExp(filter.get()), (part) => `<strong>${ part }</strong>`) }`;
		};
	},
	channelSelector() {
		return (expression) => ({ name: expression });
	},
});

Template.livechatDepartmentForm.events({
	'submit #department-form'(e, instance) {
		e.preventDefault();
		const $btn = instance.$('button.save');

		let departmentData;

		const _id = $(e.currentTarget).data('id');

		if (hasPermission('manage-livechat-departments')) {
			const enabled = instance.$('input[name=enabled]:checked').val();
			const name = instance.$('input[name=name]').val();
			const description = instance.$('textarea[name=description]').val();
			const showOnRegistration = instance.$('input[name=showOnRegistration]:checked').val();
			const email = instance.$('input[name=email]').val();
			const showOnOfflineForm = instance.$('input[name=showOnOfflineForm]:checked').val();
			const requestTagBeforeClosingChat = instance.$('input[name=requestTagBeforeClosingChat]:checked').val();
			const chatClosingTags = instance.chatClosingTags.get();
			const [offlineMessageChannel] = instance.offlineMessageChannel.get();
			const offlineMessageChannelName = (offlineMessageChannel && roomTypes.getRoomName(offlineMessageChannel.t, offlineMessageChannel)) || '';

			if (enabled !== '1' && enabled !== '0') {
				return toastr.error(t('Please_select_enabled_yes_or_no'));
			}

			if (name.trim() === '') {
				return toastr.error(t('Please_fill_a_name'));
			}

			if (email.trim() === '' && showOnOfflineForm === '1') {
				return toastr.error(t('Please_fill_an_email'));
			}

			departmentData = {
				enabled: enabled === '1',
				name: name.trim(),
				description: description.trim(),
				showOnRegistration: showOnRegistration === '1',
				showOnOfflineForm: showOnOfflineForm === '1',
				requestTagBeforeClosingChat: requestTagBeforeClosingChat === '1',
				email: email.trim(),
				chatClosingTags,
				offlineMessageChannelName,
			};
		}

		const oldBtnValue = $btn.html();
		$btn.html(t('Saving'));

		instance.$('.customFormField').each((i, el) => {
			const elField = instance.$(el);
			const name = elField.attr('name');
			departmentData[name] = elField.val();
		});

		if (hasPermission('manage-livechat-departments')) {
			Meteor.call('livechat:saveDepartment', _id, departmentData, [], async function(err, result) {
				$btn.html(oldBtnValue);
				if (err) {
					return handleError(err);
				}

				await saveDepartmentsAgents(result._id, instance);
				toastr.success(t('Saved'));
				FlowRouter.go('livechat-departments');
			});
		} else if (hasPermission('add-livechat-department-agents')) {
			saveDepartmentsAgents(_id, instance);
		} else {
			throw new Error(t('error-not-authorized'));
		}
	},

	'click .add-agent'(e, instance) {
		e.preventDefault();

		const users = instance.selectedAgents.get();
		users.forEach(async (user) => {
			const { _id, username } = user;

			const departmentAgents = instance.departmentAgents.get();
			if (departmentAgents.find(({ agentId }) => agentId === _id)) {
				return toastr.error(t('This_agent_was_already_selected'));
			}
			const newAgent = _.clone(user);
			newAgent.agentId = _id;
			delete newAgent._id;
			if (instance.agentsToRemove.has(newAgent.agentId)) {
				instance.agentsToRemove.delete(newAgent.agentId);
			}
			instance.agentsToUpsert.set(newAgent.agentId, { ...newAgent, count: 0, order: 0 });
			departmentAgents.push(newAgent);
			instance.departmentAgents.set(departmentAgents);
			instance.selectedAgents.set(instance.selectedAgents.get().filter((user) => user.username !== username));
		});
	},

	'click button.back'(e/* , instance*/) {
		e.preventDefault();
		FlowRouter.go('livechat-departments');
	},

	'click .remove-agent'(e, instance) {
		e.preventDefault();
		if (instance.agentsToUpsert.has(this.agentId)) {
			instance.agentsToUpsert.delete(this.agentId);
		}
		instance.agentsToRemove.set(this.agentId, this);

		instance.departmentAgents.set(instance.departmentAgents.get().filter((agent) => agent.agentId !== this.agentId));
	},

	'keyup .count'(event, instance) {
		const agent = instance.agentsToUpsert.get(this.agentId) || this;
		instance.agentsToUpsert.set(this.agentId, { ...agent, count: parseInt(event.currentTarget.value) || 0 });
	},

	'keyup .order'(event, instance) {
		const agent = instance.agentsToUpsert.get(this.agentId) || this;
		instance.agentsToUpsert.set(this.agentId, { ...agent, order: parseInt(event.currentTarget.value) || 0 });
	},

	'click #addTag'(e, instance) {
		e.stopPropagation();
		e.preventDefault();

		const isSelect = [...instance.availableTags.get()].length > 0;
		const elId = isSelect ? '#tagSelect' : '#tagInput';
		const elDefault = isSelect ? 'placeholder' : '';

		const tag = $(elId).val();
		const chatClosingTags = [...instance.chatClosingTags.get()];
		if (tag === '' || chatClosingTags.indexOf(tag) > -1) {
			return;
		}

		chatClosingTags.push(tag);
		instance.chatClosingTags.set(chatClosingTags);
		$(elId).val(elDefault);
	},

	'click .remove-tag'(e, instance) {
		e.stopPropagation();
		e.preventDefault();

		const chatClosingTags = [...instance.chatClosingTags.get()].filter((el) => el !== this.valueOf());
		instance.chatClosingTags.set(chatClosingTags);
	},
});

Template.livechatDepartmentForm.onCreated(async function() {
	this.agentsToUpsert = new Map();
	this.agentsToRemove = new Map();
	this.department = new ReactiveVar({ enabled: true });
	this.departmentAgents = new ReactiveVar([]);
	this.selectedAgents = new ReactiveVar([]);
	this.tabBar = new RocketChatTabBar();
	this.tabBar.showGroup(FlowRouter.current().route.name);
	this.tabBarData = new ReactiveVar();
	this.chatClosingTags = new ReactiveVar([]);
	this.availableTags = new ReactiveVar([]);
	this.availableDepartmentTags = new ReactiveVar([]);
	this.offset = new ReactiveVar(0);
	this.total = new ReactiveVar(0);
	this.offlineMessageChannel = new ReactiveVar([]);


	this.onClickTagOfflineMessageChannel = () => {
		this.offlineMessageChannel.set([]);
	};

	this.onSelectOfflineMessageChannel = async ({ item }) => {
		const { room } = await APIClient.v1.get(`rooms.info?roomId=${ item._id }`);
		room.text = room.name;
		this.offlineMessageChannel.set([room]);
	};
	this.onSelectAgents = ({ item: agent }) => {
		this.selectedAgents.set([agent]);
	};

	this.onClickTagAgents = ({ username }) => {
		this.selectedAgents.set(this.selectedAgents.get().filter((user) => user.username !== username));
	};

	this.loadAvailableTags = (departmentId) => {
		Meteor.call('livechat:getTagsList', (err, tagsList) => {
			this.availableTags.set(tagsList || []);
			const tags = this.availableTags.get();
			const availableTags = tags
				.filter(({ departments }) => departments.length === 0 || departments.indexOf(departmentId) > -1)
				.map(({ name }) => name);
			this.availableDepartmentTags.set(availableTags);
		});
	};
	this.autorun(async () => {
		const offset = this.offset.get();
		const { agents, total } = await APIClient.v1.get(`livechat/department/${ FlowRouter.getParam('_id') }/agents?count=${ LIST_SIZE }&offset=${ offset }`);
		this.total.set(total);
		if (offset === 0) {
			this.departmentAgents.set(agents);
		} else {
			this.departmentAgents.set(this.departmentAgents.get().concat(agents));
		}
	});

	this.autorun(async () => {
		const id = FlowRouter.getParam('_id');
		if (id) {
			const { department } = await APIClient.v1.get(`livechat/department/${ FlowRouter.getParam('_id') }?includeAgents=false`);
			this.department.set(department);
			this.chatClosingTags.set((department && department.chatClosingTags) || []);
			this.loadAvailableTags(id);
		}
	});

	this.autorun(async () => {
		const department = this.department.get();
		let offlineChannel = [];
		if (department?.offlineMessageChannelName) {
			const { room } = await APIClient.v1.get(`rooms.info?roomName=${ department?.offlineMessageChannelName }`);
			if (room) {
				room.text = room.name;
				offlineChannel = [{ ...room }];
			}
		}
		this.offlineMessageChannel.set(offlineChannel);
	});
});

