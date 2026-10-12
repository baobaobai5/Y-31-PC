import React from 'react';
import {createRoot} from 'react-dom/client';
import InviteBinding from '../src/InviteBinding.jsx';
import '../src/styles.css';
const mode=new URLSearchParams(location.search).get('mode');
if(mode==='invite')createRoot(document.getElementById('root')).render(<InviteBinding invite="" onBind={()=>{}} onClose={()=>{}}/>);
else{
 sessionStorage.setItem('wanxiang-user',JSON.stringify({account:'Wanx1234',nickname:'用户昵称'}));
 history.replaceState(null,'','/profile'+location.search+location.hash);
 await import('../src/main.jsx');
 setTimeout(()=>{document.querySelector('.home-ad-close')?.click();const labels={short:'短视频',comic:'漫画',post:'帖子'};if(labels[mode])Array.from(document.querySelectorAll('.profile-library-toolbar .latest-filters button')).find(b=>b.textContent===labels[mode])?.click()},700);
}
