import React, {useEffect, useRef, useState} from 'react';
import {CaretRight, CaretDoubleLeft, CaretDoubleRight, X, BookOpen} from '@phosphor-icons/react';
import './comic-detail.css';
import './comic-reader.css';

const chapterTitles=['新的旅程','意外的相遇','来自远方的消息','穿过迷雾','命运的约定'];
export default function ComicReader({comic,initialChapter=1,ads,footerAds}) {
 const [chapter,setChapter]=useState(Math.max(1,Math.min(comic.episodes,initialChapter)));
 const [pending,setPending]=useState(initialChapter>1?Math.min(comic.episodes,initialChapter):null);
 const [unlocked,setUnlocked]=useState([1]);
 const dialog=useRef(null),current=useRef(null),reading=useRef(null);
 useEffect(()=>{document.title=`${comic.title} · 第${chapter}话 · 万象`;current.current?.scrollIntoView({block:'nearest'});},[chapter,comic.title]);
 useEffect(()=>{if(pending)dialog.current?.showModal();else dialog.current?.close()},[pending]);
 function go(n){if(n<1||n>comic.episodes)return;if(!unlocked.includes(n)){setPending(n);return}open(n)}
 function open(n){setChapter(n);setPending(null);history.replaceState(null,'',`/comic/${comic.id}/read/${n}`);reading.current?.scrollIntoView({block:'start',behavior:'instant'})}
 return <main className="container comic-reader-page">
  <div className="comic-reader-heading"><a href={`/comic/${comic.id}`}>{comic.title}</a><CaretRight/><h1>第{chapter}话 {chapterTitles[(chapter-1)%chapterTitles.length]}</h1></div>
  <div className="comic-reader-layout">
   <section className="comic-reading-column" aria-label="漫画阅读内容">
    <div className="comic-reading-ads">{ads}</div>
    <div className="comic-reading-images" ref={reading}><img src="/assets/comic-reading-page.png" alt={`第${chapter}话漫画正文`} width="1080" height="1771"/></div>

   </section>
   <aside className="comic-reading-sidebar" aria-label="阅读目录"><section className="comic-reading-directory"><h2>目录 <small>共 {comic.episodes} 话</small></h2><div className="comic-reading-chapters">{Array.from({length:comic.episodes},(_,i)=>{const n=i+1;return <button key={n} ref={n===chapter?current:null} aria-current={n===chapter?'page':undefined} className={n===chapter?'selected':''} onClick={()=>go(n)}><span>第{n}话 {chapterTitles[(n-1)%chapterTitles.length]}</span>{n>1&&!unlocked.includes(n)&&<small className={`comic-access ${n%3===0?'coins':n%3===1?'level':'vip'}`}>{n%3===0?'10金币':n%3===1?'LV3':'VIP'}</small>}</button>})}</div></section><div className="comic-reading-pagination"><button disabled={chapter===1} onClick={()=>go(chapter-1)}><CaretDoubleLeft/>上一章</button><button disabled={chapter===comic.episodes} onClick={()=>go(chapter+1)}>下一章<CaretDoubleRight/></button></div></aside>
  </div>{footerAds}
  <dialog ref={dialog} className="comic-dialog" aria-label="解锁章节" onCancel={()=>setPending(null)} onClick={e=>{if(e.target===e.currentTarget)setPending(null)}}><button className="close icon" aria-label="关闭弹窗" onClick={()=>setPending(null)}><X/></button><div className="dialog-body"><h2>解锁章节</h2><p>第{pending}话为付费章节，可通过会员、等级或金币权益解锁。</p><p>当前为模拟体验，不会产生真实扣费。</p><button className="primary" onClick={()=>{setUnlocked(v=>[...v,pending]);open(pending)}}><BookOpen/>体验解锁</button></div></dialog>
 </main>
}
