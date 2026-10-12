import React, {useEffect, useState} from 'react';
import {ArrowUp, Headset, X} from '@phosphor-icons/react';
import './floating-tools.css';

const ads = [
  {id:'chess', name:'中国象棋', position:'0% 0%'},
  {id:'mahjong', name:'欢乐麻将', position:'33.3333% 0%'},
];

export default function FloatingTools() {
  const [dismissed, setDismissed] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('wanxiang-side-ads') || '[]'); }
    catch { return []; }
  });
  const [showBackToTop, setShowBackToTop] = useState(() => window.scrollY > 100);
  useEffect(() => {
    const updateScroll = () => setShowBackToTop(window.scrollY > 100);
    updateScroll();
    window.addEventListener('scroll', updateScroll, {passive:true});
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);
  useEffect(() => {
    try { sessionStorage.setItem('wanxiang-side-ads', JSON.stringify(dismissed)); }
    catch { /* Closing ads still works when browser storage is unavailable. */ }
  }, [dismissed]);
  return <>
    <aside className="floating-ads" aria-label="侧边广告">
      {ads.filter(ad => !dismissed.includes(ad.id)).map(ad => <div className="floating-ad" key={ad.id}>
        <div className="floating-ad-art" role="img" aria-label={`${ad.name}推广广告`} style={{backgroundPosition:ad.position}}/>
        <span className="floating-ad-label">广告</span>
        <button className="floating-ad-close" aria-label={`关闭${ad.name}广告`} onClick={() => setDismissed(previous => [...previous, ad.id])}><X size={14}/></button>
      </div>)}
    </aside>
    <nav className="floating-tools" aria-label="页面快捷工具">
      <button type="button" aria-label="客服" aria-disabled="true" tabIndex={-1}><Headset size={24}/><span>客服</span></button>
      {showBackToTop && <button onClick={() => window.scrollTo({top:0, behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'})} aria-label="回到顶部"><ArrowUp size={24}/><span>顶部</span></button>}
    </nav>
  </>;
}
