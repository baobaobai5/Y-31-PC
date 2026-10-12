import React, {useState} from 'react';
import './personal-center.css';
import InviteBinding from './InviteBinding';
import OfficialGroup from './OfficialGroup';
import RedemptionDialog from './RedemptionDialog';
const shortcuts=[['invite','绑定邀请'],['group','官方群组'],['business','商务合作'],['share','分享推广'],['exchange','兑换功能']];
export default function PersonalCenter({user,wallet,pools,Card,ComicCard,onOpen,onPanel,onLogin,ads,footerAds}){
 const [tab,setTab]=useState('观看历史'),[type,setType]=useState('长视频'),[page,setPage]=useState(1),[action,setAction]=useState(null),[message,setMessage]=useState(''),[invite,setInvite]=useState(()=>{try{return sessionStorage.getItem(`wanxiang-invite-${user?.account||'guest'}`)||''}catch{return ''}});
 const pool=pools[type],offset=tab==='我的喜欢'?2:tab==='我的购买'?4:0;
 const isEmpty=tab==='我的喜欢'&&type==='长视频';
 const items=Array.from({length:type==='帖子'?12:20},(_,i)=>pool[(i+offset+(page-1)*20)%pool.length]);
 function changeTab(next){setTab(next);setPage(1)}
 function openAction(label){if(label==='分享推广'){copy();return}if(!user){onLogin();return}setAction(label);setMessage('')}
 async function copy(){try{await navigator.clipboard.writeText(`${window.location.origin}/?invite=908777`);setMessage('推广链接已复制')}catch{setMessage('复制失败，请手动复制链接')}}

 return <main className="container page-content personal-center">
 <div className="video-list-breadcrumb"><a href="/">首页</a><span>/</span><span>个人中心</span></div>
 <section className="profile-overview" aria-label="账号信息">
 <div className="profile-account"><div className="profile-identity"><div className="profile-avatar"><img src="/assets/profile/avatar.png" width="70" height="70" alt="用户头像"/><span className="video-access access-type-0">VIP</span></div><div><h1>{user?.nickname||user?.account||'用户昵称'} <span className="video-access access-type-2">LV3</span></h1><p>ID：908777</p></div>{!user&&<button className="primary" onClick={onLogin}>登录</button>}</div>
 <div className="profile-shortcuts">{shortcuts.map(([icon,label])=><div key={icon}><button onClick={()=>openAction(label)}><span className="profile-shortcut-icon"><img src={`/assets/profile/${icon}.svg`} alt=""/></span>{label}</button>{icon==='invite'&&<span className="profile-bind-status">{invite?'已绑定':'未绑定'}</span>}</div>)}</div></div>
 <div className="profile-services"><article className="profile-service profile-vip"><img className="profile-service-bg" src="/assets/profile/vip-bg.png" alt=""/><div><h2>VIP会员</h2><p>开通会员尽享精彩</p><button onClick={()=>onPanel('VIP')}>立即开通</button></div><span className="profile-vip-art"><img src="/assets/profile/vip.png" alt=""/></span></article><article className="profile-service profile-coins"><img className="profile-service-bg" src="/assets/profile/coins-bg.png" alt=""/><div><h2>{wallet.coins.toLocaleString('zh-CN')}</h2><p>金币余额</p><button onClick={()=>onPanel('金币充值')}>立即充值</button></div><span className="profile-coins-art"><img src="/assets/profile/coins.png" alt=""/></span></article></div>
 </section>
 <div className="profile-middle-ads">{ads}</div>
 <section className="profile-library" aria-label="个人内容"><div className="profile-library-toolbar"><div className="profile-tabs" role="group" aria-label="个人内容分类">{['观看历史','我的喜欢','我的购买'].map(label=><button key={label} className={tab===label?'selected':''} aria-pressed={tab===label} onClick={()=>changeTab(label)}>{label}</button>)}</div><div className="latest-filters" role="group" aria-label="内容类型">{Object.keys(pools).map(label=><button key={label} className={type===label?'selected':''} aria-pressed={type===label} onClick={()=>{setType(label);setPage(1)}}>{label}</button>)}</div></div>
 {isEmpty?<div className="video-list-empty" role="status"><img className="video-list-empty-icon" src="/assets/empty-category.png" alt="" width="240" height="240"/><p>阿偶，没有找到您想要的内容哦~</p></div>:<><div className={type==='帖子'?'post-grid':type==='漫画'?'comic-grid':type==='短视频'?'short-video-grid':'poster-grid'} aria-live="polite">{items.map((item,i)=>type==='漫画'?<ComicCard key={`${page}-${i}`} comic={item} onOpen={onOpen}/>:<Card key={`${page}-${i}`} movie={item} onOpen={onOpen} portrait={type==='短视频'} post={type==='帖子'}/>)}</div>
 <nav className="video-pagination" aria-label="个人中心分页"><button disabled={page===1} onClick={()=>setPage(page-1)}>上一页</button>{[1,2,3,4,5].map(number=><button key={number} aria-label={`第${number}页`} aria-current={page===number?'page':undefined} className={page===number?'selected':''} onClick={()=>setPage(number)}>{number}</button>)}<button disabled={page===5} onClick={()=>setPage(page+1)}>下一页</button><span role="status">第 {page} / 5 页</span></nav></>}
 </section>{footerAds}
 {action==='绑定邀请'&&<InviteBinding invite={invite} onBind={code=>{setInvite(code);sessionStorage.setItem(`wanxiang-invite-${user.account}`,code)}} onClose={()=>setAction(null)}/>}
 {['官方群组','商务合作'].includes(action)&&<OfficialGroup title={action} onClose={()=>setAction(null)}/>}

 {action==='兑换功能'&&<RedemptionDialog account={user?.account||'guest'} onClose={()=>setAction(null)}/>}
 {message&&!action&&<div className="detail-toast" role="status">{message}</div>}
 </main>;
}
