import React, { useMemo, useState } from 'react';
import './long-video-list.css';

export default function LongVideoList({ movies, Card, onOpen, query, footerAds, portrait = false, comic = false, post = false, ComicCard }) {
  const contentLabel = post ? '帖子' : comic ? '漫画' : portrait ? '短视频' : '长视频';
  const resultsId = post ? 'post-results' : comic ? 'comic-results' : portrait ? 'short-video-results' : 'long-video-results';
  const [category, setCategory] = useState(post ? '最新' : '全部');
  const [year, setYear] = useState('全部');
  const [sort, setSort] = useState('最新上架');
  const categories = ['全部', ...new Set(movies.flatMap(movie => movie.genre.split(' / ')))];
  const isLatest = post && category === '最新';
  const showThirdMenu = !isLatest && category !== categories[1];
  // 二级菜单3用于展示无内容分类的缺省状态。
  const categoryItems = category === categories[2] ? [] : movies;
  // List-only fixtures keep the homepage data and card artwork unchanged.
  const catalog = useMemo(() => Array.from({length: 24}, (_, batch) => categoryItems.map(movie => ({
    ...movie, listedOrder: 10000 - batch * movies.length + movie.id, catalogId: `${batch}-${movie.id}`,
    title: batch === 0 ? movie.title : `${movie.title} · 精选${String(batch + 1).padStart(2, '0')}`,
  }))).flat(), [categoryItems]);
  const filterKey = JSON.stringify([category, year, sort, query]);
  const [pagination, setPagination] = useState({key: '', page: 1});
  const results = catalog.filter(movie => (isLatest || category === '全部' || movie.genre.split(' / ').includes(category)) && (!showThirdMenu || year === '全部' || String(movie.year) === year) && (!query.trim() || `${movie.title} ${movie.genre}`.includes(query.trim()))).sort((a, b) => (sort === '最多观看' ? b.views - a.views : sort === '最多点赞' ? b.likes - a.likes : b.listedOrder - a.listedOrder) || b.listedOrder - a.listedOrder);
  const pageSize = post ? 12 : 20;
  const totalPages = Math.max(1, Math.ceil(results.length / pageSize));
  const page = Math.min(pagination.key === filterKey ? pagination.page : 1, totalPages);
  const pageItems = results.slice((page - 1) * pageSize, page * pageSize);
  const pageNumbers = Array.from({length: totalPages}, (_, index) => index + 1).filter(number => number === 1 || number === totalPages || Math.abs(number - page) <= 2);
  function changePage(next) {
    setPagination({key: filterKey, page: next});
    document.getElementById(resultsId)?.scrollIntoView({block:'start', behavior:'instant'});
  }
  return <main className={`container page-content long-video-list${post ? ' post-list' : comic ? ' comic-list' : portrait ? ' short-video-list' : ''}`}>
    <div className="video-list-breadcrumb"><a href="/">首页</a><span aria-hidden="true">/</span><span>{contentLabel}</span></div>
    <section className="video-list-filters" aria-label={`${contentLabel}分类筛选`}>
      <nav className="video-list-categories" aria-label={`${contentLabel}二级分类`}>{post && <button aria-pressed={isLatest} className={isLatest ? 'selected' : ''} onClick={() => { setCategory('最新'); setYear('全部'); setSort('最新上架'); }}>最新</button>}{categories.map((item, index) => <button key={item} aria-pressed={category === item} className={category === item ? 'selected' : ''} onClick={() => { setCategory(item); setYear('全部'); }}>{`二级菜单${index + 1}`}</button>)}</nav>
      {showThirdMenu && <div className="video-filter-row"><div role="group" aria-label="三级菜单">{['全部', ...new Set(movies.map(movie => String(movie.year)).sort().reverse())].map((item, index) => <button key={item} aria-pressed={year === item} className={year === item ? 'selected' : ''} onClick={() => setYear(item)}>{`三级菜单${index + 1}`}</button>)}</div></div>}
    </section>
    <section id={resultsId} aria-label={`${contentLabel}列表`}>
      {!isLatest && <div className="video-list-toolbar"><div className="latest-filters" role="group" aria-label="排序">{['最新上架', '最多观看', '最多点赞'].map(item => <button key={item} className={sort === item ? 'selected' : ''} aria-pressed={sort === item} onClick={() => setSort(item)}>{item}</button>)}</div></div>}
      {results.length ? <><div className={post ? "post-grid post-list-grid" : "poster-grid"}>{pageItems.map((movie, index) => index === 2 ? <article className="list-ad-card" key="list-ad" aria-label="广告：限时优惠，最高优惠70%">
        <img src="/assets/ad-deals.png" alt="限时优惠，最高优惠70%" width="480" height="270"/>
        <h3 title="限时优惠，最高优惠70%">限时优惠，最高优惠70%</h3>
      </article>  : comic ? <ComicCard key={movie.catalogId} comic={movie} onOpen={onOpen}/> : <Card key={movie.catalogId} movie={movie} onOpen={onOpen} portrait={portrait} post={post}/>)}</div><nav className="video-pagination" aria-label={`${contentLabel}分页`}>
        <button disabled={page === 1} onClick={() => changePage(page - 1)}>上一页</button>
        {pageNumbers.map((number, index) => <React.Fragment key={number}>
          {index > 0 && number - pageNumbers[index - 1] > 1 && <span className="pagination-ellipsis">…</span>}
          <button className={page === number ? 'selected' : ''} aria-label={`第${number}页`} aria-current={page === number ? 'page' : undefined} onClick={() => changePage(number)}>{number}</button>
        </React.Fragment>)}
        <button disabled={page === totalPages} onClick={() => changePage(page + 1)}>下一页</button>
        <span className="pagination-summary" role="status">第 {page} / {totalPages} 页</span>
      </nav></> : <div className="video-list-empty" role="status"><img className="video-list-empty-icon" src="/assets/empty-category.png" alt="" width="240" height="240"/><p>阿偶，没有找到您想要的内容哦~</p></div>}
    </section>
    {footerAds}
  </main>;
}
