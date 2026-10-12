import React, {useEffect,useRef,useState} from 'react';
import './official-group.css';
export default function OfficialGroup({onClose,title='官方群组'}){
 const dialog=useRef(null),[notice,setNotice]=useState('');
 const groupLink='https://yingyu.example/group';
 useEffect(()=>{dialog.current.showModal()},[]);
 async function copyLink(){try{await navigator.clipboard.writeText(groupLink);setNotice('链接已复制')}catch{setNotice('复制失败，请选中链接手动复制')}}
 return <dialog ref={dialog} className="official-group-dialog" aria-labelledby="official-group-title" onCancel={event=>{event.preventDefault();onClose()}} onClick={event=>{if(event.target===dialog.current)onClose()}}>
  <header className="official-group-heading"><h2 id="official-group-title">{title}</h2><button type="button" aria-label="关闭" onClick={onClose}><img src="/assets/profile/invite-close.svg" width="36" height="36" alt=""/></button></header>
  <div className="official-group-body"><input aria-label={`${title}链接`} value={groupLink} readOnly onFocus={event=>event.target.select()}/><p className="official-group-notice" role="status">{notice}</p><button className="official-group-copy" onClick={copyLink}>复制链接</button></div>
 </dialog>;
}
