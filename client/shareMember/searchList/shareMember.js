// 210413_nick_shareMember 分享聯絡人資訊功能

import { modal } from '../../../app/ui-utils/client';

// 取得目前網址
const baseURI = (() => {
	if (document.baseURI) { return document.baseURI; }
	const base = document.getElementsByTagName('base');
	if (base.length > 0) { return base[0].href; }
	return document.URL;
})

// 取得使用者token
const getCredentials=() => {
  return {
    'X-User-Id': Meteor._localStorage.getItem(Accounts.USER_ID_KEY),
    'X-Auth-Token': Meteor._localStorage.getItem(Accounts.LOGIN_TOKEN_KEY),
  };
}

// 傳送訊息
const sendMessage = (rid,memberId,memberName) => {
  const msg = {
    type: 'shareMember',
    memberId,
    memberName,
    shareLink: `${baseURI()}direct/${memberId}` ,
  }
  
  const body = {
    msg: "method",
    method: "sendMessage",
    params: [{ 
      rid, 
      msg: JSON.stringify(msg)
    }],
  }

  jQuery.ajax({
    method: 'post',
    url: `${ baseURI() }api/v1/method.call/sendMessage`,
    headers: {
      'Content-Type': 'application/json',
      ...getCredentials(),
    },
    data: JSON.stringify({message:JSON.stringify(body)}),
  })
} 

// 開啟聊天室
const openRoom= (item)=>{
  const type={
    d:'direct',
    p:'group',
    c:'channel'
  }

  const { rid,name } = item
  const params = item.t === "d" ? rid : name

  const link = document.createElement('a')
  link.href = `/${type[item.t]}/${params}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}


export default function( params, item ) {
  const { fromSideBar, memberId, memberName } = params // 開啟搜尋列表時，同時回傳的參數
  const { rid, name, fname } = item // 點選搜尋列表內容時，同時回傳的參數
  //從左側選單 
  if(fromSideBar){
    sendMessage(rid, memberId, memberName)
    openRoom(item)
  }
  // 從聊天室內 
  else {
    sendMessage(memberId, name, fname)
  }

  modal.close();
}