import React, {useEffect,useRef,useState} from 'react';
import './invite-binding.css';
export default function InviteBinding({invite,onBind,onClose}){
 const dialog=useRef(null),[code,setCode]=useState(''),[error,setError]=useState('');
 const currentCode='YCH98008JNN';
 useEffect(()=>{dialog.current.showModal()},[]);
 function validate(){const value=code.trim();if(!value)return '请输入邀请人邀请码';if(!/^[A-Za-z0-9]{6,20}$/.test(value))return '请输入6–20位字母或数字邀请码';if(value.toUpperCase()===currentCode)return '不能绑定自己的邀请码';return ''}
 function submit(event){event.preventDefault();const next=validate();setError(next);if(!next)onBind(code.trim().toUpperCase())}
 return <dialog ref={dialog} className="invite-binding-dialog" aria-labelledby="invite-title" onCancel={event=>{event.preventDefault();onClose()}} onClick={event=>{if(event.target===dialog.current)onClose()}}>
 <header className="invite-binding-heading"><div><div className="invite-binding-title"><h2 id="invite-title">绑定邀请</h2><span>{invite?'已绑定':'未绑定'}</span></div><p>输入邀请人邀请码后完成绑定，绑定后可用于邀请关系和奖励统计</p></div><button type="button" aria-label="关闭" onClick={onClose}><img src="/assets/profile/invite-close.svg" width="36" height="36" alt=""/></button></header>
 <form className="invite-binding-form" onSubmit={submit}><label htmlFor="inviter-code">邀请码</label><input id="inviter-code" autoFocus={!invite} autoComplete="off" maxLength={20} value={invite||code} placeholder="请输入邀请人邀请码" disabled={Boolean(invite)} aria-invalid={Boolean(error)} aria-describedby={error?'invite-error':'invite-current'} onChange={event=>{setCode(event.target.value);setError('')}} onBlur={()=>{if(!invite)setError(validate())}}/><p id="invite-current" className="invite-current">当前邀请码：<strong>{currentCode}</strong></p>{error&&<p className="invite-error" id="invite-error" role="alert">{error}</p>}{invite&&<p className="invite-success" role="status">已绑定邀请人：{invite}（本地演示）</p>}<button className="invite-bind-submit" disabled={Boolean(invite)||Boolean(error)||!code.trim()}>{invite?'已绑定':'立即绑定'}</button></form>
 </dialog>;
}
