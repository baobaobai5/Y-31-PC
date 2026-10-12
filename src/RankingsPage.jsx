import React, { useEffect, useState } from 'react';
import { Trophy, CaretRight } from '@phosphor-icons/react';
import { rankingTypes, rankingPeriods, getRanking } from './rankingData';
import './rankings-page.css';

function readSelection() {
  const params = new URLSearchParams(window.location.search);
  const type = rankingTypes.some(item => item.key === params.get('type')) ? params.get('type') : 'long';
  const value = Number(params.get('period'));
  const page = Number(params.get('page'));
  return { type, period: Number.isInteger(value) && value >= 0 && value < 4 ? value : 0, page: Number.isInteger(page) && page > 0 ? page : 1, searchQuery: '' };
}

export default function RankingsPage({ pools, Card, ComicCard, onOpen, query, footerAds }) {
  const [selection, setSelection] = useState(readSelection);
  useEffect(() => {
    document.title = '排行榜 · 万象';
    const restore = () => setSelection(readSelection());
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, []);
  const typeIndex = rankingTypes.findIndex(item => item.key === selection.type);
  const label = rankingTypes[typeIndex].label;
  const periodLabel = rankingPeriods[selection.period];
  const baseRanking = getRanking(pools[selection.type], typeIndex, selection.period);
  const ranked = Array.from({ length: 60 }, (_, index) => {
    const original = baseRanking[index % baseRanking.length].item;
    const batch = Math.floor(index / baseRanking.length);
    return { item: batch ? { ...original, title: `${original.title} · 精选${batch + 1}` } : original, rank: index + 1 };
  });
  const isEmptyRanking = selection.type === 'long' && selection.period === 1;
  const items = isEmptyRanking ? [] : ranked.filter(({ item }) => `${item.title} ${item.genre}`.includes(query.trim()));

  const pageSize = 12;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(selection.searchQuery === query ? selection.page : 1, totalPages);
  const pageItems = items.slice((page - 1) * pageSize, page * pageSize);

  function select(next) {
    const updated = { ...selection, ...next, page: 1, searchQuery: query };
    if (updated.type === selection.type && updated.period === selection.period) return;
    const url = new URL(window.location.href);
    url.searchParams.set('type', updated.type);
    url.searchParams.set('period', updated.period);
    url.searchParams.delete('page');
    window.history.pushState(null, '', url);
    setSelection(updated);
  }

  function changePage(next) {
    const url = new URL(window.location.href);
    url.searchParams.set('page', next);
    window.history.pushState(null, '', url);
    setSelection(current => ({ ...current, page: next, searchQuery: query }));
    document.getElementById('rankings-results')?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }

  return <main className="container page-content rankings-page">
    <div className="rankings-breadcrumb"><a href="/">首页</a><CaretRight aria-hidden="true" size={12}/><span aria-current="page">排行榜</span></div>
    <section className="rankings-banner" aria-labelledby="rankings-title">
      <div className="rankings-banner-copy">
        <span className="rankings-banner-kicker"><Trophy size={18} aria-hidden="true"/>万象精选榜单</span>
        <h1 id="rankings-title">发现值得看的好内容</h1>
        <p>长视频、短视频、帖子、漫画 · 人气佳作，一榜尽览</p>
      </div>
    </section>
    <section id="rankings-results" className="rankings-catalog" aria-label="排行榜内容">
      <div className="rankings-category-bar">
        <h2>排行榜</h2>
        <div className="latest-filters" role="group" aria-label="排行榜内容类型">
          {rankingTypes.map(type => <button key={type.key} className={selection.type === type.key ? 'selected' : ''} aria-pressed={selection.type === type.key} onClick={() => select({ type: type.key })}>{type.label}</button>)}
        </div>
      </div>
      <div className="rankings-period-bar">
        <div className="latest-filters" role="group" aria-label="榜单时间范围">
          {rankingPeriods.map((period, index) => <button key={period} className={selection.period === index ? 'selected' : ''} aria-pressed={selection.period === index} onClick={() => select({ period: index })}>{period}</button>)}
        </div>
      </div>
      <div aria-live="polite" aria-atomic="true" className="rankings-sr-status">{label}{periodLabel}，第 {page} 页，展示 {pageItems.length} 条内容</div>
      {items.length ? <ol className={`rankings-content-grid rankings-content-${selection.type}`} aria-label={`${label} · ${periodLabel}`}>
        {pageItems.map(({ item, rank }) => <li key={rank} className={`rankings-content-item position-${rank}`}>
          {selection.type === 'post' && <span className={`ranking-cover-position rank-place-${rank}`}>{String(rank).padStart(2,'0')}</span>}
          {selection.type === 'comic' ? <ComicCard comic={item} onOpen={onOpen} ranking rank={rank}/> : <Card movie={item} onOpen={onOpen} ranking={selection.type !== 'post'} rank={rank} portrait={selection.type === 'short'} post={selection.type === 'post'}/>}
        </li>)}
      </ol> : <div className="video-list-empty" role="status"><img className="video-list-empty-icon" src={isEmptyRanking ? "/assets/empty-ranking.png" : "/assets/empty-category.png"} alt="" width="240" height="240"/><p>阿偶，没有找到您想要的内容哦~</p></div>}
      {items.length > 0 && <nav className="video-pagination rankings-pagination" aria-label="排行榜分页">
        <button disabled={page === 1} onClick={() => changePage(page - 1)}>上一页</button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(number => <button key={number} aria-label={`第${number}页`} aria-current={page === number ? 'page' : undefined} className={page === number ? 'selected' : ''} onClick={() => changePage(number)}>{number}</button>)}
        <button disabled={page === totalPages} onClick={() => changePage(page + 1)}>下一页</button>
        <span className="pagination-summary" role="status">第 {page} / {totalPages} 页</span>
      </nav>}
    </section>
    {footerAds}
  </main>;
}
