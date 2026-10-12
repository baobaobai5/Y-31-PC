import React, {useEffect, useState} from 'react';
import ImagePreview from './ImagePreview';
import './long-video-list.css';
import './search-results.css';

const types = ['长视频', '短视频', '漫画', '帖子'];
const sorts = ['推荐', '最新上架', '最多观看', '最多喜欢'];
const count = value => parseFloat(value) * (/万|W/i.test(value) ? 10000 : 1);
export default function SearchResults({pools, details, Card, ComicCard, onOpen, footerAds}) {
  const [term] = useState(() => new URLSearchParams(window.location.search).get('q')?.trim() || '');
  const [type, setType] = useState(() => {const value = new URLSearchParams(window.location.search).get('type'); return types.includes(value) ? value : '长视频';});
  const [uploadedImage] = useState(() => {
    const imageId = new URLSearchParams(window.location.search).get('image');
    if (!imageId) return null;
    try {const saved = JSON.parse(sessionStorage.getItem(`wanxiang-image-search-${imageId}`) || 'null'); return saved?.title === term && saved.preview?.startsWith('data:image/png;base64,') ? saved : null;} catch {return null;}
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [sort, setSort] = useState('推荐');
  const [page, setPage] = useState(1);
  useEffect(() => { document.title = `${term ? term + ' · ' : ''}搜索结果 · 万象`; }, [term]);
  const matches = pools[type].filter(item => term && `${item.title} ${item.genre} ${item.description || ''} ${details(item).tags.join(' ')}`.toLocaleLowerCase().includes(term.toLocaleLowerCase()));
  // Expand matching seed content into three full pages of mock search results.
  const results = matches.length ? Array.from({length: 60}, (_, index) => {
    const source = matches[index % matches.length];
    const edition = Math.floor(index / matches.length);
    return {...source, resultId: `${type}-${source.id}-${edition}`, title: edition ? `${source.title} · 精选${String(edition).padStart(2, '0')}` : source.title, source};
  }).sort((a, b) => sort === '最新上架' ? b.year - a.year || b.id - a.id : sort === '最多观看' || sort === '最多喜欢' ? count(details(b)[sort === '最多观看' ? 'views' : 'likes']) - count(details(a)[sort === '最多观看' ? 'views' : 'likes']) : b.score - a.score) : [];
  const pageSize = 20;
  const pages = Math.max(1, Math.ceil(results.length / pageSize));
  const changePage = next => { setPage(next); document.getElementById('search-results-grid')?.scrollIntoView({block: 'start', behavior: 'instant'}); };
  return <main className="container search-results-page">
    <div className="video-list-breadcrumb" aria-label="面包屑"><a href="/">首页</a><span aria-hidden="true">/</span><span aria-current="page">搜索结果</span></div>
    {uploadedImage && <div className="search-uploaded-image"><div><strong>以图搜图</strong></div><button className="search-image-preview-button" aria-label="查看上传图片大图" onClick={()=>setPreviewOpen(true)}><img src={uploadedImage.preview} alt="上传的搜索图片"/></button></div>}
    <div className="search-results-heading"><h1>搜索结果：<span>{term || (uploadedImage ? '图片搜索' : '请输入关键词')}</span></h1><span role="status">共 {results.length} 条结果</span></div>
    <section className="search-results-filters" aria-label="搜索结果筛选">
      <div className="search-result-types" role="group" aria-label="内容类型">{types.map(value => <button key={value} className={type === value ? 'selected' : ''} aria-pressed={type === value} onClick={() => {setType(value); setPage(1);}}>{value}</button>)}</div>
      <div className="search-result-sorts" role="group" aria-label="结果排序">{sorts.map(value => <button key={value} className={sort === value ? 'selected' : ''} aria-pressed={sort === value} onClick={() => {setSort(value); setPage(1);}}>{value}</button>)}</div>
    </section>
    <section id="search-results-grid" aria-label={`${type}搜索结果`}>
      {results.length > 0 ? <><div className={type === '帖子' ? 'post-grid search-results-grid' : 'poster-grid search-results-grid'}>{results.slice((page - 1) * pageSize, page * pageSize).map(item => type === '漫画' ? <ComicCard key={item.resultId} comic={item} onOpen={()=>onOpen(item.source)}/> : <Card key={item.resultId} movie={item} onOpen={()=>onOpen(item.source)} portrait={type === '短视频'} post={type === '帖子'}/>)}</div>
        <nav className="video-pagination" aria-label="搜索结果分页"><button disabled={page === 1} onClick={() => changePage(page - 1)}>上一页</button>{Array.from({length: pages}, (_, i) => i + 1).map(n => <button key={n} className={n === page ? 'selected' : ''} aria-current={n === page ? 'page' : undefined} onClick={() => changePage(n)}>{n}</button>)}<button disabled={page === pages} onClick={() => changePage(page + 1)}>下一页</button><span className="pagination-summary">第 {page} / {pages} 页</span></nav></> : <div className="video-list-empty" role="status"><img className="video-list-empty-icon" src="/assets/empty-search.png" width="240" height="240" alt=""/><p>{term || uploadedImage ? '阿偶，没有找到您想要的内容哦~' : '输入关键词，发现你喜欢的内容'}</p></div>}
    </section>
    {previewOpen && uploadedImage && <ImagePreview src={uploadedImage.preview} onClose={()=>setPreviewOpen(false)}/>}
    {footerAds}
  </main>;
}
