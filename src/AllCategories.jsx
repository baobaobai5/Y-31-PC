import React, {useLayoutEffect, useRef, useState} from 'react';
import './long-video-list.css';
import './all-categories.css';

const types = ['长视频', '短视频', '漫画', '帖子'];
const sorts = ['最新上架', '最多观看', '最多喜欢'];
const countValue = value => parseFloat(value) * (/万|W/i.test(value) ? 10000 : 1);
// 分类页的模拟标签与内容关联，新增标签也可用于筛选。
const genreTags = {
  动作: ['热血对决', '追踪冒险', '极限挑战', '硬核动作', '绝境逃生', '英雄故事', '冒险旅途'],
  悬疑: ['悬疑推理', '烧脑剧情', '犯罪调查', '谜案追踪', '暗夜故事', '心理博弈', '反转结局'],
  爱情: ['青春爱情', '浪漫邂逅', '校园时光', '温暖治愈', '都市情感', '成长故事', '夏日回忆'],
  古装: ['古风故事', '宫廷风云', '江湖传奇', '古代情缘', '传统文化', '国风美学', '历史故事'],
  奇幻: ['奇幻世界', '森林冒险', '神秘传说', '异世界', '魔法旅程', '幻想故事', '探索发现'],
  动画: ['动画电影', '亲子时光', '机器人', '星球探索', '童趣世界', '勇气成长', '奇妙旅程'],
};
const typeTags = {
  长视频: ['热门电影', '高分佳作', '经典重温', '精彩剧情', '院线精选', '沉浸观影'],
  短视频: ['精彩片段', '名场面', '高能瞬间', '剧情速看', '短剧精选', '幕后花絮'],
  漫画: ['连载漫画', '完结精选', '彩色漫画', '人气作品', '剧情向', '冒险向'],
  帖子: ['剧情解析', '创作幕后', '角色解读', '观影心得', '故事分享', '作品讨论'],
};

export default function AllCategories({pools, details, Card, ComicCard, onOpen, query, footerAds}) {
  const [type, setType] = useState('长视频');
  const [category, setCategory] = useState('全部');
  const [tag, setTag] = useState('全部');
  const [sort, setSort] = useState('最多观看');
  const [expanded, setExpanded] = useState(false);
  const [collapsedTagLimit, setCollapsedTagLimit] = useState(12);
  const tagMeasure = useRef(null);
  const [pagination, setPagination] = useState({key: '', page: 1});
  const pool = pools[type];
  const baseTags = item => [...new Set([...item.genre.split(' / '), ...details(item).tags])];
  const extraTags = item => [...(genreTags[item.genre.split(' / ')[0]] || []), typeTags[type][(item.id - 1) % 6], typeTags[type][item.id % 6]];
  const itemTags = item => [...new Set([...baseTags(item), ...extraTags(item)])];
  const categories = ['全部', ...new Set(pool.map(item => item.genre.split(' / ')[0]))];
  const categoryItems = pool.filter(item => category === '全部' || item.genre.split(' / ')[0] === category);
  const tags = ['全部', ...new Set([...categoryItems.flatMap(baseTags), ...categoryItems.flatMap(extraTags)])];
  const orderedTags = tag !== '全部' && tags.indexOf(tag) >= collapsedTagLimit ? ['全部', tag, ...tags.filter(value => value !== '全部' && value !== tag)] : tags;
  const visibleTags = expanded ? tags : orderedTags.slice(0, collapsedTagLimit);
  const tagLayoutKey = orderedTags.join('|');
  useLayoutEffect(() => {
    const measure = tagMeasure.current;
    const update = () => {
      const buttons = Array.from(measure.children);
      const rows = [...new Set(buttons.map(button => button.offsetTop))];
      const count = buttons.filter(button => rows.indexOf(button.offsetTop) < 2).length;
      setCollapsedTagLimit(Math.max(1, count));
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(measure);
    return () => observer.disconnect();
  }, [tagLayoutKey]);
  const catalog = Array.from({length: 12}, (_, batch) => pool.map((item, index) => ({...item, catalogId: `${batch}-${item.id}`, batch, index}))).flat();
  const results = catalog.filter(item => (category === '全部' || item.genre.split(' / ')[0] === category) && (tag === '全部' || itemTags(item).includes(tag)) && (!query.trim() || `${item.title} ${itemTags(item).join(' ')}`.includes(query.trim()))).sort((a, b) => sort === '最新上架' ? b.year - a.year || a.batch - b.batch || b.index - a.index : countValue(details(b)[sort === '最多观看' ? 'views' : 'likes']) - countValue(details(a)[sort === '最多观看' ? 'views' : 'likes']) || a.batch - b.batch);
  const showEmpty = type === '长视频' && sort === '最多观看';
  const pageSize = type === '帖子' ? 12 : 20;
  const totalPages = Math.max(1, Math.ceil(results.length / pageSize));
  const filterKey = JSON.stringify([type, category, tag, sort, query]);
  const page = pagination.key === filterKey ? Math.min(pagination.page, totalPages) : 1;
  const pageNumbers = Array.from({length: totalPages}, (_, index) => index + 1).filter(number => number === 1 || number === totalPages || Math.abs(number - page) <= 1);
  const options = (label, values, selected, onSelect) => <div className="all-category-row"><span>{label}</span><div role="group" aria-label={label}>{values.map(value => <button key={value} className={value === selected ? 'selected' : ''} aria-pressed={value === selected} onClick={() => onSelect(value)}>{value}</button>)}</div></div>;
  function changePage(next) {
    setPagination({key: filterKey, page: next});
    document.getElementById('all-category-results')?.scrollIntoView({block: 'start', behavior: 'instant'});
  }
  return <main className="container all-categories-page">
    <div className="video-list-breadcrumb"><a href="/">首页</a><span aria-hidden="true">/</span><span>全部分类</span></div>
    <section className="video-list-filters all-category-filters" aria-label="全部分类筛选">
      {options('类型', types, type, value => {setType(value); setCategory('全部'); setTag('全部'); setExpanded(false);})}
      {options('分类', categories, category, value => {setCategory(value); setTag('全部'); setExpanded(false);})}
      {options('排序', sorts, sort, setSort)}
      <div className="all-category-row all-category-tag-row"><span>标签</span><div className="all-category-tag-content"><div id="all-category-tags" role="group" aria-label="标签"><div className="all-category-tag-measure" ref={tagMeasure} aria-hidden="true">{orderedTags.map(value => <button key={value} tabIndex={-1} type="button">{value}</button>)}</div>{visibleTags.map(value => <button key={value} className={tag === value ? 'selected' : ''} aria-pressed={tag === value} onClick={() => setTag(value)}>{value}</button>)}</div>{tags.length > collapsedTagLimit && <button className="all-category-expand" aria-expanded={expanded} aria-controls="all-category-tags" onClick={() => setExpanded(value => !value)}><img src="/assets/category-expand.svg" className={expanded ? 'expanded' : ''} width="16" height="16" alt=""/>{expanded ? '收起' : '展开'}</button>}</div></div>
    </section>
    <section id="all-category-results" aria-label={`${type}分类结果`}>
      {!showEmpty && results.length ? <><div className={type === '帖子' ? 'post-grid all-category-posts' : 'poster-grid all-category-grid'}>{results.slice((page - 1) * pageSize, page * pageSize).map(item => type === '漫画' ? <ComicCard key={item.catalogId} comic={item} onOpen={onOpen}/> : <Card key={item.catalogId} movie={item} portrait={type === '短视频'} post={type === '帖子'} onOpen={onOpen}/>)}</div><nav className="video-pagination" aria-label="全部分类分页"><button disabled={page === 1} onClick={() => changePage(page - 1)}>上一页</button>{pageNumbers.map((number, index) => <React.Fragment key={number}>{index > 0 && number - pageNumbers[index - 1] > 1 && <span className="pagination-ellipsis">…</span>}<button aria-label={`第${number}页`} aria-current={page === number ? 'page' : undefined} className={page === number ? 'selected' : ''} onClick={() => changePage(number)}>{number}</button></React.Fragment>)}<button disabled={page === totalPages} onClick={() => changePage(page + 1)}>下一页</button><span className="pagination-summary" role="status">第 {page} / {totalPages} 页</span></nav></> : <div className="video-list-empty" role="status"><img className="video-list-empty-icon" src="/assets/empty-category.png" alt="" width="240" height="240"/><p>阿偶，没有找到您想要的内容哦~</p></div>}
    </section>
    {footerAds}
  </main>;
}
