import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { modal } from '../../../app/ui-utils/client';

Meteor.startup(() => {
  Tracker.autorun((c) => {
    c.stop();
    import('./searchList.html')
    import('./searchList')
  })
})

export const openSelector = (memberId,memberName)=>{
  modal.open({
    title: '請選擇想分享的對象',
    modifier: 'modal',
    content: 'searchList',
    showConfirmButton: false,
    data: { memberId, memberName }
  })
}
