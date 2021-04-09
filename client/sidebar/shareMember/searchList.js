import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Sidebar, TextInput, Box, Icon } from '@rocket.chat/fuselage';
import { FixedSizeList as List } from 'react-window';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { modal } from '../../../app/ui-utils/client';
import './searchList.css'

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

// 搜尋使用者
const searchUser = (text) => {
	const body = {
		msg: "method",
		method: "spotlight",
		params:[ text, [], {"users":true,"rooms":true}],
	}

	return jQuery.ajax({
    method: 'post',
    url: `${ baseURI() }api/v1/method.call/spotlight`,
    headers: {
      'Content-Type': 'application/json',
      ...getCredentials(),
    },
    data: JSON.stringify({message:JSON.stringify(body)}),
  })
}

// 取得roomId
const getRoomId = (id)=>{
  const body = {
    msg: "method",
    method: "createDirectMessage",
    params: [id]
  }

  return jQuery.ajax({
    method: 'post',
    url: `${ baseURI() }api/v1/method.call/createDirectMessage`,
    headers: {
      'Content-Type': 'application/json',
      ...getCredentials(),
    },
    data: JSON.stringify({message:JSON.stringify(body)}),
  })
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
const openRoom= (rid)=>{
  const link = document.createElement('a')
  link.href = `/direct/${rid}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

Template.searchList.onCreated(function(){
  this.rid = this.data
	this.roomList = new ReactiveVar([])
	this.userList = new ReactiveVar([])
})

Template.searchList.helpers({
  memberList(){
    return Template.instance().userList.get()
  },
  showList(){
    const memberList = Template.instance().userList.get()
    return memberList.length > 0
  }
})

Template.searchList.events({
  'keyup .searchInput'(event,templateInstance){
    const value = event.target.value
		searchUser(value).then((res=>{
			const result = JSON.parse(res.message).result
      templateInstance.userList.set(result.users)
      templateInstance.roomList.set(result.rooms)
		}))
		
  },
  'click .sendMemberMsg'(event, templateInstance){
    const id = event.target.dataset.id
    const memberId = templateInstance.data.memberId
    const memberName = templateInstance.data.memberName
    console.log(memberName)

    getRoomId(id).then((res)=>{
      const message = JSON.parse(res.message)
      const rid = message.result.rid
      sendMessage( rid, memberId, memberName )
      openRoom(rid)
      modal.close();
    })
  }
})
