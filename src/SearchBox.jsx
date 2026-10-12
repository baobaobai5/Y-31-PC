import React, {useEffect, useRef, useState} from 'react';
import {MagnifyingGlass, X, Trash} from '@phosphor-icons/react';
import './search-box.css';
import ImageSearchDialog from './ImageSearchDialog';

const storageKey = 'wanxiang-search-history';
const popular = ['长安旧梦', '沙海追踪', '星球奇遇', '暗夜来信', '夏日序曲'];
export default function SearchBox({query, onChange, isAppCenter, onSearch, id = 'search-suggestions', imageItems = []}) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
      return Array.isArray(saved) ? [...new Set(saved.filter(v => typeof v === 'string' && v.trim()).map(v => v.trim()))].slice(0, 5) : [];
    } catch { return []; }
  });
  const root = useRef(null);
  const [imageOpen, setImageOpen] = useState(false);
  useEffect(() => {
    const close = e => { if (!root.current?.contains(e.target)) {setOpen(false);} };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, []);
  function updateHistory(next) {
    setHistory(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); } catch { /* Search remains available without storage. */ }
  }
  function search(value, type, imageId) {
    const term = value.trim();
    if (!term && !imageId) return;
    onChange(term);
    if (term) updateHistory([term, ...history.filter(v => v !== term)].slice(0, 5));
    setOpen(false);
    if (onSearch) onSearch(term);
    else window.location.href = `/search?q=${encodeURIComponent(term)}${type ? `&type=${encodeURIComponent(type)}` : ''}${imageId ? `&image=${encodeURIComponent(imageId)}` : ''}`;
  }
  return <div className="site-search" ref={root} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false); }}>
    <form className="search" role="search" onSubmit={e => { e.preventDefault(); search(query); }}>
      <button type="submit" aria-label="搜索"><MagnifyingGlass size={19}/></button>
      <input aria-label={isAppCenter ? '搜索应用' : '站内搜索'} placeholder={isAppCenter ? '搜索应用名称' : '万象站内搜索'} value={query} onFocus={() => {setOpen(true); setImageOpen(false);}} onChange={e => { onChange(e.target.value); setOpen(true); }} onKeyDown={e => { if (e.key === 'Escape') setOpen(false); }} aria-expanded={open} aria-controls={id}/>
      {query && <button type="button" aria-label="清空搜索" onClick={() => onChange('')}><X size={16}/></button>}
      {imageItems.length > 0 && <button type="button" className="image-search-entry" aria-label="图片搜索" aria-expanded={imageOpen} onClick={() => {setImageOpen(v => !v); setOpen(false);}}><span className="search-picture-icon" aria-hidden="true"/></button>}
    </form>
    {imageOpen && <ImageSearchDialog items={imageItems} onClose={() => setImageOpen(false)} onSearch={search}/>}
    {open && <div className="search-suggestions" id={id}>
      {history.length > 0 && <>
        <div className="search-section-heading"><span><span className="search-heading-icon search-history-icon" aria-hidden="true"/>历史搜索</span><button className="clear-history" onClick={() => updateHistory([])}><Trash size={15}/>清空</button></div>
        <ul className="search-history">{history.map(term => <li key={term}><button className="history-term" onClick={() => search(term)} title={term}>{term}</button><button className="delete-history" aria-label={`删除历史搜索：${term}`} onClick={() => updateHistory(history.filter(v => v !== term))}><X size={15}/></button></li>)}</ul>
      </>}
      <div className="search-section-heading"><span><span className="search-heading-icon search-hot-icon" aria-hidden="true"/>热门搜索</span></div>
      <ol className="search-popular">{popular.map((term, i) => <li key={term}><button onClick={() => search(term)}><span className={i < 3 ? 'hot-rank' : ''}>{i + 1}</span>{term}</button></li>)}</ol>
    </div>}
  </div>;
}
