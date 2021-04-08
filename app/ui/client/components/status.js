import _ from 'underscore';
import { Meteor } from 'meteor/meteor';
import { TAPi18n } from 'meteor/rocketchat:tap-i18n';
import { ReactiveVar } from 'meteor/reactive-var';
import { Template } from 'meteor/templating';

import './status.html';

const retryTime = new ReactiveVar(0);
let retryHandle = null;

const clearRetryInterval = function() {
	clearInterval(retryHandle);

	retryHandle = null;
};

const trackStatus = function() {
	if (Meteor.status().status === 'waiting') {
		retryHandle = retryHandle || setInterval(function() {
			const timeDiff = Meteor.status().retryTime - new Date().getTime();
			const _retryTime = (timeDiff > 0 && Math.round(timeDiff / 1000)) || 0;

			retryTime.set(_retryTime);
		}, 500);
	} else {
		clearRetryInterval();
	}
};

Template.status.onDestroyed(clearRetryInterval);

Template.status.onCreated(function() {
	this.autorun(trackStatus);
});

// 201020 nick offLine
let loading = false;
let addBlocker = null;
let offLine = null;
let recheckInterval = null
const checkLine = function () {
		addBlocker = setTimeout(function() {
			const blocker = document.createElement('div')
			blocker.classList.add('offLineBlocker')
			document.body.appendChild(blocker)
		}, 10 * 1000)

		offLine = setTimeout(function() {
			if(loading) {
				localStorage.clear();
				window.location.href = 'https://www.google.com/';
			}
		}, 90 * 1000)

		recheckInterval = setInterval(()=> {
			if(Meteor.status().connected) {
				// 201020 nick offLine
				if(loading) {
					loading = false

					document.querySelector('.offLineBlocker').remove()

					clearTimeout(offLine);
					offLine = null
					clearTimeout(addBlocker);
					addBlocker = null
					clearInterval(recheckInterval);
					recheckInterval = null;
				}
			}
		}, 5 * 1000)
}


Template.status.helpers({
	connected() {
		if(!Meteor.status().connected &&　Meteor.status().retryCount> 0) {
			// 201020 nick offLine
			const isLocal = window.location.href.indexOf('localhost') > -1
			if(!loading && !isLocal) {
				loading = true
				checkLine()
			}
		}
		return Meteor.status().connected;
	},

	message() {
		return TAPi18n.__('meteor_status', { context: Meteor.status().status });
	},

	extraMessage() {
		if (Meteor.status().status === 'waiting') {
			return TAPi18n.__('meteor_status_reconnect_in', { count: retryTime.get() });
		}
	},

	showReconnect() {
		return _.contains(['waiting', 'offline'], Meteor.status().status);
	},

	reconnectLabel() {
		return TAPi18n.__('meteor_status_try_now', { context: Meteor.status().status });
	},
});

Template.status.events({
	'click a.alert-link'(e) {
		e.preventDefault();
		Meteor.reconnect();
	},
});
