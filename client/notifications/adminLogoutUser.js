import { Meteor } from 'meteor/meteor';
import { Notifications } from '../../app/notifications';
Meteor.startup(function() {
	Notifications.onLogged('Admin:LogoutUser',function({ _id}) {		
		setTimeout(function(){
			if(_id === Meteor.userId()){
				location.reload();
			}
		}, 1000);
	});
});
