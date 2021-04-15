// 210413_nick_shareMember 分享聯絡人資訊功能
import { createTemplateForComponent } from '../../client/reactAdapters';
import { modal } from '../../app/ui-utils/client';


createTemplateForComponent('searchList', () => import('./searchList'));

export const shareThisMember = (memberId,memberName) => {
  modal.open({
    title: '請選擇想分享的對象',
    modifier: 'modal',
    content: 'searchList',
    showConfirmButton: false,
    data: { 
      params:{
        fromSideBar:true, 
        memberId, 
        memberName
      }
    }
  })
}

export const selectShareMember = (rid) => {
  modal.open({
    title: '請選擇聯絡人',
    modifier: 'modal',
    content: 'searchList',
    showConfirmButton: false,
    data:{
      params:{
        fromSideBar:false, 
        memberId: rid
      }
    }
  })
}