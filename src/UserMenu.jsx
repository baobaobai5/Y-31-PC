import React, {useEffect, useRef, useState} from 'react';
import './user-menu.css';

export default function UserMenu({user, onProfile, onLogout}) {
  const [expanded, setExpanded] = useState(false);
  const root = useRef(null);
  const trigger = useRef(null);
  const options = useRef([]);
  const keyboardOpen = useRef(false);
  const nickname = user.nickname || user.account;
  useEffect(() => {
    if (!expanded) return;
    if (keyboardOpen.current) {
      options.current[0]?.focus();
      keyboardOpen.current = false;
    }
    const outside = event => {if (!root.current?.contains(event.target)) setExpanded(false);};
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [expanded]);
  function close() {setExpanded(false); trigger.current?.focus();}
  function menuKey(event) {
    const index = options.current.indexOf(document.activeElement);
    if (event.key === 'Escape') {event.preventDefault();event.stopPropagation();close();}
    else if (['ArrowDown','ArrowUp','Home','End'].includes(event.key)) {
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + 2) % 2;
      options.current[next]?.focus();
    }
  }
  return <div className="user-menu" ref={root} onMouseEnter={() => setExpanded(true)} onMouseLeave={() => {if (!root.current?.contains(document.activeElement)) setExpanded(false);}} onBlur={event => {if (!event.currentTarget.contains(event.relatedTarget)) setExpanded(false);}}>
    <button ref={trigger} className="user-menu-trigger" aria-label={`${nickname}，账号菜单`} aria-expanded={expanded} aria-controls="user-account-menu" aria-haspopup="menu" onClick={() => setExpanded(true)} onKeyDown={event => {
      if (event.key === 'ArrowDown') {event.preventDefault();keyboardOpen.current=true;if(expanded)options.current[0]?.focus();else setExpanded(true);}
      if (event.key === 'Escape') close();
    }}><img src="/assets/user-menu/avatar.png" alt="" width="42" height="42"/><span>{nickname}</span></button>
    <div id="user-account-menu" className="user-menu-dropdown" hidden={!expanded}>
      <div className="user-menu-surface" role="menu" aria-label="账号菜单" onKeyDown={menuKey}>
        <button ref={node => {options.current[0]=node;}} type="button" role="menuitem" onClick={() => {setExpanded(false);onProfile();}}><img src="/assets/user-menu/profile.svg" alt="" width="18" height="18"/><span>个人中心</span></button>
        <button ref={node => {options.current[1]=node;}} type="button" role="menuitem" onClick={() => {setExpanded(false);onLogout();}}><img src="/assets/user-menu/logout.svg" alt="" width="18" height="18"/><span>退出登录</span></button>
      </div>
    </div>
  </div>;
}
