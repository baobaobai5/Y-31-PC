import React,{useEffect,useState} from 'react';
import {CaretRight} from '@phosphor-icons/react';
import './app-center.css';
import './long-video-list.css';
const icons=['90a88.png','1b94a.png','b90a3.png','cac3e.png','1e109.png','64233.png','23204.png','3019d.png','66d00.png','5f361.png','24dcb.png','debd3.png','3f688.png','01dec.png','65bcd.png','d44f2.png'];
const names=['欢乐派对','热血竞技','幻想冒险','田园物语','趣味闯关','海岛旅程','星域之战','萌宠乐园','家园生活','缤纷消除','方块世界','快乐小鸭','怪兽乐园','奇妙探险','轻松记事','星空任务'];
const categories=['推荐','游戏','工具','福利','任务'];
const apps=['推荐','工具','福利','任务'].flatMap((category,c)=>Array.from({length:240},(_,i)=>({id:`${category}-${i+1}`,name:names[(i+c*4)%16]+(i<16?'':` ${Math.floor(i/16)+1}`),icon:icons[(i+c*4)%16],category})));
export default function AppCenter({query,onClearSearch,onSelect,ads,footerAds}){
 const [category,setCategory]=useState('推荐'),[page,setPage]=useState(1);
 useEffect(()=>{setPage(1)},[category,query]);
 useEffect(()=>{document.title='应用中心 · 万象'},[]);
 const results=category==='游戏'?[]:apps.filter(app=>app.category===category&&(!query||app.name.includes(query.trim())));
 const totalPages=Math.ceil(results.length/80),currentPage=Math.min(page,Math.max(1,totalPages)),pageItems=results.slice((currentPage-1)*80,currentPage*80);
 return <main className="container app-center-page"><div className="detail-breadcrumb"><a href="/">首页</a><CaretRight/><span>应用中心</span></div><div className="app-center-secondary-ad">{ads}</div><nav className="app-center-categories" aria-label="应用分类">{categories.map(c=><button key={c} aria-pressed={category===c} className={category===c?'active':''} onClick={()=>setCategory(c)}>{c}</button>)}</nav>{results.length?<div className="app-center-grid" aria-label={`${category}应用列表`}>{pageItems.map(app=><button key={app.id} className="app-center-card" onClick={()=>onSelect(app.name)}><img src={`/assets/app-center/${app.icon}`} alt="" width="98" height="98"/><span>{app.name}</span></button>)}</div>:<div className="video-list-empty"><img className="video-list-empty-icon" src={category==='游戏'?'/assets/empty-app-center.png':'/assets/empty-category.png'} alt="" width="240" height="240"/><p>阿偶，没有找到您想要的内容哦~</p>{query&&<button className="secondary" onClick={onClearSearch}>清空搜索</button>}</div>}{results.length>0&&<nav className="video-pagination" aria-label="应用分页"><button disabled={currentPage===1} onClick={()=>setPage(currentPage-1)}>上一页</button>{Array.from({length:totalPages},(_,i)=>i+1).map(n=><button key={n} className={currentPage===n?'selected':''} aria-label={`第${n}页`} aria-current={currentPage===n?'page':undefined} onClick={()=>setPage(n)}>{n}</button>)}<button disabled={currentPage===totalPages} onClick={()=>setPage(currentPage+1)}>下一页</button><span className="pagination-summary" role="status">第 {currentPage} / {totalPages} 页</span></nav>}<div className="app-center-middle-ad">{ads}</div>{footerAds}</main>
}
