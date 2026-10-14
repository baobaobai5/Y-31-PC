import AggregationPage from './AggregationPage';
import React, {useState, useRef, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {Play, Plus, Check, MagnifyingGlass, Heart, Eye, ThumbsUp, CaretRight, X, Star} from '@phosphor-icons/react';
import './styles.css';
import AuthPanel from './AuthPanel';
import UserMenu from './UserMenu';
import PersonalCenter from './PersonalCenter';
import LongVideoList from './LongVideoList';
import RankingsPage from './RankingsPage';
import { rankingPeriods, rankingOrders, rankingHref } from './rankingData';
import VideoDetail from './VideoDetail';
import ComicDetail from './ComicDetail';
import ComicReader from './ComicReader';
import PostDetail from './PostDetail';
import AppCenter from './AppCenter';
import AllCategories from './AllCategories';
import SearchBox from './SearchBox';
import SearchResults from './SearchResults';
import AiPointsExchange from './AiPointsExchange';
import VipCenter from './VipCenter';
import CoinRecharge from './CoinRecharge';
import FloatingTools from './FloatingTools';
import {ContentPreviewProvider, useContentPreview} from './ContentCardPreview';
const isAggregationPage=window.location.pathname.replace(/\/$/,'')==='/aggregation';
const isProfilePage=window.location.pathname.replace(/\/$/,'')==='/profile';
const isSearchPage=window.location.pathname.replace(/\/$/,'')==='/search';
const isAllCategoriesPage=window.location.pathname.replace(/\/$/,'')==='/categories';
const isAppCenterPage=window.location.pathname.replace(/\/$/,'')==='/apps';
const homeSection = new URLSearchParams(window.location.search).get('section');
const isLongVideoPage = window.location.pathname.replace(/\/$/, '') === '/long-videos';
const isShortVideoPage = window.location.pathname.replace(/\/$/, '') === '/short-videos';
const isComicPage = window.location.pathname.replace(/\/$/, '') === '/comics';
const postDetailMatch = window.location.pathname.match(/^\/post\/(\d+)\/?$/);
const isPostDetailPage = Boolean(postDetailMatch);
const isPostPage = window.location.pathname.replace(/\/$/, '') === '/posts';
const comicDetailMatch = window.location.pathname.match(/^\/comic\/(\d+)\/?$/);
const isComicDetailPage = Boolean(comicDetailMatch);
const comicReaderMatch = window.location.pathname.match(/^\/comic\/(\d+)\/read\/(\d+)\/?$/);
const isComicReaderPage = Boolean(comicReaderMatch);
const isRankingsPage = window.location.pathname.replace(/\/$/, '') === '/rankings';
const isVideoListPage = isLongVideoPage || isShortVideoPage || isComicPage || isPostPage;
const detailMatch = window.location.pathname.match(/^\/(video|short-video)\/(\d+)\/?$/);
const isShortVideoDetailPage = detailMatch?.[1] === 'short-video';
const isVideoDetailPage = Boolean(detailMatch);
const isContentPage = isAggregationPage || isProfilePage || isSearchPage || isAllCategoriesPage || isAppCenterPage || isPostDetailPage || isVideoListPage || isVideoDetailPage || isRankingsPage || isComicDetailPage || isComicReaderPage;
const movies=[
{id:1,title:'沙海追踪',genre:'动作 / 冒险',year:2026,score:8.9,x:149,quality:'4K',description:'漫天黄沙之下，一场关于生存与信念的追踪悄然展开。'},
{id:2,title:'暗夜来信',genre:'悬疑 / 犯罪',year:2025,score:8.7,x:331,quality:'4K',description:'一封没有署名的来信，揭开雨夜都市中被遗忘的秘密。'},
{id:3,title:'夏日序曲',genre:'爱情 / 剧情',year:2025,score:8.4,x:513,quality:'1080P',description:'那个夏天，我们在海风与日落之间，找到了彼此。'},
{id:4,title:'长安旧梦',genre:'古装 / 剧情',year:2026,score:9.1,x:694,quality:'4K',description:'万家灯火照长安，一段跨越岁月的约定，在旧梦中重逢。'},
{id:5,title:'迷雾之森',genre:'奇幻 / 冒险',year:2025,score:8.6,x:876,quality:'4K',description:'走进被时光遗忘的森林，寻找藏在迷雾深处的答案。'},
{id:6,title:'星球奇遇',genre:'动画 / 冒险',year:2025,score:8.8,x:1057,quality:'1080P',description:'一个少年和他的机器人伙伴，踏上穿越星球的奇妙旅程。'}];
// Additional demo recommendations reuse the existing cover artwork.
movies.push(
  {...movies[0],id:7,title:'沙海追踪：最后的绿洲'},
  {...movies[1],id:8,title:'暗夜来信：雨中的线索'},
  {...movies[3],id:9,title:'长安旧梦：灯火阑珊处'},
  {...movies[4],id:10,title:'迷雾之森：遗忘之境'},
);
const space={id:0,title:'星际回响',genre:'科幻 / 冒险',year:2026,score:9.2,quality:'4K',description:'当人类在宇宙的边缘再次听见神秘的信号，一名孤独的探索者踏上未知的星球，寻找文明的回响。穿越寂静与黑暗，他发现的或许不只是另一个世界，还有关于人类自身的答案。'};
function Sprite({x,y,w,h,className='',...rest}){return <div className={'sprite '+className} style={{aspectRatio:`${w}/${h}`,backgroundSize:`${1374/w*100}% ${1145/h*100}%`,backgroundPosition:`${x/(1374-w)*100}% ${y/(1145-h)*100}%`}} {...rest}/>}
const videoDetails = [
  {tags:['动作','冒险','荒漠求生'],duration:'02:08:00',views:'128.6万',likes:'3.2万',coins:20,level:3},
  {tags:['悬疑','犯罪','都市谜案'],duration:'01:46:32',views:'96.8万',likes:'2.1万',coins:15,level:2},
  {tags:['爱情','剧情','夏日心动'],duration:'01:46:00',views:'82.3万',likes:'1.8万',coins:10,level:1},
  {tags:['古装','剧情','东方美学'],duration:'01:58:24',views:'156.2万',likes:'4.6万',coins:25,level:4},
  {tags:['奇幻','冒险','秘境探索'],duration:'01:52:18',views:'73.5万',likes:'1.6万',coins:15,level:2},
  {tags:['动画','冒险','星际旅程'],duration:'01:35:40',views:'112.4万',likes:'2.9万',coins:20,level:3},
];
// Keep list sorting in sync with the statistics displayed on each card.
movies.forEach(movie => {
  const detail = videoDetails[([0,1,2,3,4,5,0,1,3,4])[movie.id - 1]];
  movie.views = Math.round(parseFloat(detail.views) * 10000);
  movie.likes = Math.round(parseFloat(detail.likes) * 10000);
});
const shortVideos=movies.map((movie,index)=>({...movie,contentType:'short',title:`${movie.title} · 精彩片段`,duration:['03:28','01:56','02:40','04:12','02:18'][index%5]}));
const posts=movies.map(movie=>({...movie,contentType:'post',title:`${movie.title}：镜头背后的故事`}));
const comics=movies.map((movie,index)=>({...movie,contentType:'comic',episodes:[28,16,42,35,19,24,31,12,48,21][index]}));
function Rankings({onOpen}) {
  const [type,setType]=useState('长视频');
  const [expanded,setExpanded]=useState([0,0,0,0]);
  const expand=(period,index)=>setExpanded(current=>current.map((value,i)=>i===period?index:value));
  const types=['长视频','短视频','帖子','漫画'];
  const pool={'长视频':movies,'短视频':shortVideos,'帖子':posts,'漫画':comics}[type];
  return <section className="rankings" aria-label="排行榜">
    <div className="section-heading"><h2>排行榜</h2><div className="latest-filters ranking-types" role="group" aria-label="排行榜类型">{types.map(value=><button key={value} className={type===value?'selected':''} aria-pressed={type===value} onClick={()=>{setType(value);setExpanded([0,0,0,0])}}>{value}</button>)}</div>
      <a className="more ranking-more" href={rankingHref(type)}>查看更多<img className="more-arrow" src="/assets/right-arrow.svg" alt="" aria-hidden="true" width="16" height="16"/></a>
    </div>
    <div className="ranking-period-sections">
    {rankingPeriods.map((periodName,period)=>{
      const ranked=rankingOrders[period].map(index=>({item:pool[(index+types.indexOf(type)*2)%pool.length]}));
      return <section className="ranking-period-section" key={periodName} aria-label={periodName}>
        <div className="ranking-column-heading"><h3 className="ranking-period-title">{periodName}</h3><a className="more" aria-label={`${periodName}更多`} href={rankingHref(type,period)}>更多<img className="more-arrow" src="/assets/right-arrow.svg" alt="" aria-hidden="true" width="16" height="16"/></a></div>
    <ol className={`ranking-accordion${type==='长视频'?' ranking-long-videos':type==='帖子'?' ranking-posts':''}`} aria-label={`${type}·${periodName}`}>
      {ranked.map(({item},index)=><li key={item.id} className={expanded[period]===index?'expanded':''} onMouseEnter={()=>expand(period,index)} onFocus={()=>expand(period,index)}>
        <button className="rank-row" onClick={()=>onOpen(item)}><span className={`rank-number rank-${index+1}`}>{String(index+1).padStart(2,'0')}</span><strong title={item.title}>{item.title}</strong></button>
        <div className="rank-expanded-card" hidden={expanded[period]!==index}>
          {type==='漫画'?<ComicCard comic={item} onOpen={onOpen} rank={index+1}/>:<VideoCard movie={item} onOpen={onOpen} rank={index+1} portrait={type==='短视频'} post={type==='帖子'}/>}
        </div>
      </li>)}
    </ol></section>;})}
    </div>

  </section>;
}
function ComicCard({comic,onOpen,ranking=false,rank,aggregation=false}) {
  const detail=videoDetails[[0,1,2,3,4,5,0,1,3,4][comic.id-1]];
  const preview=useContentPreview({item:comic,details:detail,type:'漫画',rank,aggregation,onOpen,art:<div className="comic-cover-art" style={{backgroundPosition:`${(comic.id-1)%5*25}% ${Math.floor((comic.id-1)/5)*100}%`}}/>});
  return <button {...preview} className={`movie-card video-card comic-card${ranking?' ranking-horizontal-card':''}`} onClick={()=>onOpen(comic)}>
    {ranking&&<span className={`ranking-cover-position rank-place-${rank}`}>{String(rank).padStart(2,'0')}</span>}
    <div className="poster video-cover">
      <div className="comic-cover-art" role="img" aria-label={`${comic.title}漫画封面`} style={{backgroundPosition:`${(comic.id-1)%5*25}% ${Math.floor((comic.id-1)/5)*100}%`}}/>
      {!aggregation&&<img className="video-watermark" src="/assets/logo.svg" alt="万象"/>}
      {aggregation&&<span className={`aggregation-cover-badge ${(comic.id-1)%4===0?'is-hot':'is-new'}`}>{(comic.id-1)%4===0?'HOT':'NEW'}</span>}
      <span className="comic-update">更新至 {comic.episodes} 集</span>
    </div>
    <h3 title={comic.title}>{comic.title}</h3>
    <div className="video-tags">{detail.tags.map(tag=><span key={tag}>{tag}</span>)}</div>
    <div className="video-stats"><span aria-label={`观看量 ${detail.views}`}><Eye aria-hidden="true"/>{detail.views}</span><span aria-label={`点赞量 ${detail.likes}`}><ThumbsUp aria-hidden="true"/>{detail.likes}</span></div>
  </button>;
}
function VideoCard({movie,onOpen,portrait=false,post=false,ranking=false,rank,aggregation=false}) {
  const detail=videoDetails[([0,1,2,3,4,5,0,1,3,4])[movie.id-1]];
  const accessType=(movie.id-1)%3;
  const accessLabel=accessType===0?'VIP':accessType===1?`${detail.coins}金币`:'LV3';
  const preview=useContentPreview({item:movie,details:detail,type:post||movie.contentType==='post'?'帖子':portrait||movie.contentType==='short'?'短视频':'长视频',rank,aggregation,accessLabel,accessType,onOpen,art:<Sprite x={movie.x} y={615} w={169} h={169*9/16}/>});
  return <button {...preview} className={`movie-card video-card${portrait?' portrait-video-card':''}${post?' post-card':''}${ranking?' ranking-horizontal-card':''}`} onClick={()=>onOpen(movie)}>
    {ranking&&<span className={`ranking-cover-position rank-place-${rank}`}>{String(rank).padStart(2,'0')}</span>}
    <div className="poster video-cover">
      <Sprite x={portrait?movie.x+17:movie.x} y={portrait?610:615} w={portrait?135:169} h={post?169*2/5:portrait?180:169*9/16}/>
      {aggregation?<span className={`aggregation-cover-badge ${(movie.id-1)%4===0?'is-hot':'is-new'}`}>{(movie.id-1)%4===0?'HOT':'NEW'}</span>:<>
        <span className={`video-access access-type-${accessType}`} aria-label={`付费标识：${accessLabel}`}>{accessLabel}</span>
        <img className="video-watermark" src="/assets/logo.svg" alt="万象"/>
      </>}
      {!post&&<span className="video-duration">{movie.duration||detail.duration}</span>}
    </div>
    <h3 title={movie.title}>{movie.title}</h3>
    <div className="video-tags">{detail.tags.map(tag=><span key={tag}>{tag}</span>)}</div>
    <div className="video-stats"><span aria-label={`播放量 ${detail.views}`}><Play aria-hidden="true"/>{detail.views}</span><span aria-label={`喜欢量 ${detail.likes}`}><Heart aria-hidden="true"/>{detail.likes}</span></div>
  </button>;
}
function AiShowcaseMenu({onSelect}) {
  const [expanded, setExpanded] = useState(false);
  const root = useRef(null);
  const trigger = useRef(null);
  useEffect(() => {
    if (!expanded) return;
    const dismiss = event => { if (!root.current?.contains(event.target)) setExpanded(false); };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [expanded]);
  return <div className="ai-menu" ref={root}
    onPointerEnter={event => { if (event.pointerType === 'mouse') setExpanded(true); }}
    onPointerLeave={event => { if (event.pointerType === 'mouse') setExpanded(false); }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setExpanded(false); }}
    onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); setExpanded(false); trigger.current?.focus(); } }}>
    <button ref={trigger} onFocus={() => setExpanded(true)} onKeyDown={event => {if(event.key === 'ArrowDown'){event.preventDefault();setExpanded(true);}}} className="ai-showcase-button" aria-expanded={expanded} aria-controls="ai-showcase-options" onClick={() => {setExpanded(false);onSelect('AI秀场');}}>
      <span className="ai-border-glow" aria-hidden="true"/>
      <span className="ai-button-content"><Star className="ai-star" weight="fill" aria-hidden="true"/><span>AI秀场</span><img className="ai-down-arrow" src="/assets/chevron-down.svg" alt="" width="14" height="14" onClick={event=>{event.stopPropagation();setExpanded(value=>!value);}}/></span>
    </button>
    <div id="ai-showcase-options" className="ai-dropdown" hidden={!expanded}>
      <div className="ai-dropdown-surface">
        {[{label:'AI秀场',image:'/assets/ai-showcase-icon.png'},{label:'AI女友',image:'/assets/ai-girlfriend-icon.png'}].map(({label,image}) => <button key={label} className="ai-dropdown-option" onClick={() => {setExpanded(false);onSelect(label);}}><span className="ai-option-icon ai-option-icon-image"><img src={image} alt="" width="40" height="40"/></span><span>{label}</span></button>)}
      </div>
    </div>
  </div>;
}
const adImages = [
  {src:'/assets/ad-deals.png',alt:'限时优惠，最高优惠 70%',background:'#ff6478'},
  {src:'/assets/ad-new-product.png',alt:'新品促销，最高优惠 80%',background:'#fbe2da'},
  {src:'/assets/ad-season-sale.png',alt:'季末促销，额外优惠 25%',background:'#f8d449'},
];
function AdCarousel() {
  return <section className="ad-carousel" aria-label="精选广告" aria-roledescription="轮播">
    <div className="ad-viewport">
      <div className="ad-track ad-marquee">
        {[0,1,2].map(copy => <div className="ad-marquee-group" key={copy} aria-hidden={copy > 0 ? true : undefined}>
          {Array.from({length:9},(_,i) => {
            const ad = adImages[i % adImages.length];
            return <div key={i} className="ad-card" style={{background:ad.background}}><img src={ad.src} alt={ad.alt} width="200" height="112" draggable="false"/></div>;
          })}
        </div>)}
      </div>
    </div>
  </section>;
}
const gameApps = ['中国象棋','欢乐麻将','经典斗地主','围棋对弈','国际象棋','五子棋','欢乐跳棋','飞行棋','纸牌接龙','国际跳棋','黑白棋','多米诺'];
function GameAppCarousel({onSelect}) {
  return <section className="game-app-carousel" aria-label="棋牌游戏应用" aria-roledescription="轮播">
    <div className="game-app-viewport">
      <div className="game-app-track game-app-marquee">
        {[0,1,2].map(copy => <div className="game-app-group" key={copy} aria-hidden={copy > 0 ? true : undefined}>
          {gameApps.map((name,i) => <button key={name} className="app-shortcut" tabIndex={copy > 0 ? -1 : 0} onClick={() => onSelect(name)}>
            <span className="game-app-icon" aria-hidden="true" style={{backgroundPosition:`${i % 4 * 100 / 3}% ${Math.floor(i / 4) * 50}%`}}/><span>{name}</span>
          </button>)}
        </div>)}
      </div>
    </div>

  </section>;
}
function pickRandomVideos(previous=[]) {
  const shuffled=[...movies];
  for(let i=shuffled.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffled[i],shuffled[j]]=[shuffled[j],shuffled[i]];}
  let selected=shuffled.slice(0,5);
  if(previous.length&&selected.every(item=>previous.some(old=>old.id===item.id))) selected=[...selected.slice(0,4),shuffled[5]];
  return selected;
}
function App(){const [authUser,setAuthUser]=useState(()=>{try{return JSON.parse(sessionStorage.getItem('wanxiang-user')||'null')}catch{return null}});useEffect(()=>{if(authUser)sessionStorage.setItem('wanxiang-user',JSON.stringify(authUser));else sessionStorage.removeItem('wanxiang-user')},[authUser]);const [noticeReady,setNoticeReady]=useState(false);const adShown=useRef(false);const [randomVideos,setRandomVideos]=useState(()=>pickRandomVideos());const [postFallbackOffset,setPostFallbackOffset]=useState(0);const [comicFallbackOffset,setComicFallbackOffset]=useState(0);const [shortFallbackOffset,setShortFallbackOffset]=useState(0);const [fallbackOffset,setFallbackOffset]=useState(0);const [latestType,setLatestType]=useState('长视频');const [latestOffset,setLatestOffset]=useState(0);const [recommendOffset,setRecommendOffset]=useState(0);const [nav,setNav]=useState(isAggregationPage?'聚合页':isAllCategoriesPage?'全部分类':isAppCenterPage?'应用中心':(isPostPage||isPostDetailPage)?'帖子':(isComicPage||isComicDetailPage||isComicReaderPage)?'漫画':isRankingsPage?'排行榜':(isShortVideoPage||isShortVideoDetailPage)?'短视频':(isLongVideoPage||isVideoDetailPage)?'长视频':'首页'),[category,setCategory]=useState('全部'),[query,setQuery]=useState(()=>isSearchPage?new URLSearchParams(window.location.search).get('q')||'':''),[saved,setSaved]=useState(()=>{try{return JSON.parse(localStorage.getItem('yingjie-list')||'[]')}catch{return []}}),[panel,setPanel]=useState(isProfilePage?'首页广告':isContentPage||homeSection?null:'异常登录'),[selected,setSelected]=useState(null),[quality,setQuality]=useState('全部'),[year,setYear]=useState('全部'),[playing,setPlaying]=useState(false);const dialog=useRef(null);
useEffect(()=>{if(isAggregationPage){document.title='聚合页 · 万象';return}if(isAllCategoriesPage){document.title='全部分类 · 万象';return}if(isVideoListPage){document.title=(isPostPage?'帖子':isComicPage?'漫画':isShortVideoPage?'短视频':'长视频')+' · 万象';return}const target={'短视频':'.short-video-section','漫画':'.comic-fallback-section','帖子':'.post-fallback-section','应用中心':'.game-app-carousel'}[homeSection];if(target){setNav(homeSection);document.querySelector(target)?.scrollIntoView({block:'start'});}},[]);
const [rechargeReturn,setRechargeReturn]=useState('AI秀场');
const [aiWallet,setAiWallet]=useState({coins:3840,points:120});
const closeMainDialog=()=>{setSelected(null);if(['AI秀场','AI女友','VIP','金币充值','个人中心'].includes(panel)){setPanel(null);return}if(panel==='登录'||isContentPage){setPanel(null);return}if(panel==='异常登录'){setPanel('系统通知');return}if(panel==='系统通知'){setPanel('热门应用');return}if(!adShown.current){adShown.current=true;setPanel('首页广告')}else{setPanel(null)}};
useEffect(()=>{const handle=()=>{setAuthUser(null);setSelected(null);setPanel('异常登录')};window.addEventListener('auth:session-conflict',handle);return()=>window.removeEventListener('auth:session-conflict',handle)},[]);
useEffect(()=>{localStorage.setItem('yingjie-list',JSON.stringify(saved))},[saved]);useEffect(()=>{if(selected||panel){dialog.current?.showModal();if(['AI秀场','AI女友'].includes(panel))dialog.current?.querySelector('input')?.focus()}else dialog.current?.close()},[selected,panel]);
const toggleSave=m=>setSaved(s=>s.includes(m.id)?s.filter(id=>id!==m.id):[...s,m.id]);const open=m=>{if(m.contentType==='post'){window.location.href=`/post/${m.id}`;return}if(m.contentType==='comic'){window.location.href=`/comic/${m.id}`;return}if(m.contentType==='short'){window.location.href=`/short-video/${m.id}`;return}if(!m.contentType){window.location.href=`/video/${m.id}`;return}setPlaying(false);setSelected(m)};let visible=movies.filter(m=>(category==='全部'||m.genre.includes(category))&&(!query||m.title.includes(query)||m.genre.includes(query))&&(quality==='全部'||m.quality===quality)&&(year==='全部'||String(m.year)===year));
if(visible.length){const offset=recommendOffset%visible.length;visible=[...visible.slice(offset),...visible.slice(0,offset)];}
const detailPost=posts.find(m=>m.id===Number(postDetailMatch?.[1]))||posts[0];
const postStats=videoDetails[[0,1,2,3,4,5,0,1,3,4][detailPost.id-1]];
const detailComic=comics.find(m=>m.id===Number(comicDetailMatch?.[1]||comicReaderMatch?.[1]))||comics[0];
const comicStats=videoDetails[[0,1,2,3,4,5,0,1,3,4][detailComic.id-1]];
const detailPool=isShortVideoDetailPage?shortVideos:movies;
const detailMovie=detailPool.find(m=>m.id===Number(detailMatch?.[2]))||detailPool[0];
const detailStats=videoDetails[[0,1,2,3,4,5,0,1,3,4][detailMovie.id-1]];
return <><header className="header"><div className="container nav-bar"><a className="brand" href="/" onClick={()=>{setNav('首页');setCategory('全部');setQuery('')}}><img className="brand-logo" src="/assets/logo.svg" alt="万象" width="161" height="48"/></a><div className="nav-tools"><SearchBox query={query} onChange={value=>{setQuery(value);if(!isContentPage)setNav('首页')}} isAppCenter={isAppCenterPage} imageItems={movies}/><div className="header-shortcuts" aria-label="快捷功能">{['APP下载','全部分类'].map(item=><button key={item} className="shortcut" aria-current={item==='全部分类'&&isAllCategoriesPage?'page':undefined} onClick={()=>{if(item==='全部分类'){window.location.href='/categories';return}setPanel(item)}}>{item}</button>)}<AiShowcaseMenu onSelect={setPanel}/><button className="vip-button" onClick={()=>setPanel('VIP')}><span className="vip-crown" aria-hidden="true"/><span>VIP</span></button></div>{authUser?<UserMenu user={authUser} onProfile={()=>{window.location.href='/profile'}} onLogout={()=>{setAuthUser(null);setPanel(null)}}/>:<button className="login-button animated-login" onClick={()=>setPanel(authUser?'个人中心':'登录')}><span className="login-fold" aria-hidden="true"/><span className="login-points" aria-hidden="true">{Array.from({length:10},(_,i)=><i key={i} className="login-point"/>)}</span><span className="login-inner"><svg className="login-bolt" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"><polyline points="13.18 1.37 13.18 9.64 21.45 9.64 10.82 22.63 10.82 14.36 2.55 14.36 13.18 1.37"/></svg><span>登录</span></span></button>}</div></div><div className="navigation-row"><nav className="container primary-nav" aria-label="主导航">{['首页','长视频','短视频','漫画','帖子','聚合页','应用中心'].map(n=><button key={n} className={!isProfilePage&&nav===n?'active':''} onClick={()=>{if(n==='聚合页'){window.location.href='/aggregation';return}if(['长视频','短视频','漫画','帖子','应用中心'].includes(n)){window.location.href={'长视频':'/long-videos','短视频':'/short-videos','漫画':'/comics','帖子':'/posts','应用中心':'/apps'}[n];return}if(isContentPage){if(n!=='长视频')window.location.href=n==='首页'?'/':'/?section='+encodeURIComponent(n);return}setNav(n);const target={'长视频':'.long-video-section','短视频':'.short-video-section','漫画':'.comic-fallback-section','帖子':'.post-fallback-section','应用中心':'.game-app-carousel'}[n];if(target){document.querySelector(target)?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'})}else{window.scrollTo({top:0,behavior:'smooth'})}}}>{n}</button>)}</nav></div></header><div className="container global-header-ads"><AdCarousel/></div>{isAggregationPage?<AggregationPage pools={{'长视频':movies,'短视频':shortVideos,'漫画':comics,'帖子':posts}} Card={VideoCard} ComicCard={ComicCard} onOpen={open} footerAds={<><div className="fallback-square-ads"><GameAppCarousel onSelect={setPanel}/></div><div className="fallback-ad-carousel"><AdCarousel/></div></>}/>:isProfilePage?<PersonalCenter user={authUser} wallet={aiWallet} pools={{'长视频':movies,'短视频':shortVideos,'漫画':comics,'帖子':posts}} Card={VideoCard} ComicCard={ComicCard} onOpen={open} onPanel={setPanel} onLogin={()=>setPanel('登录')} ads={<AdCarousel/>} footerAds={<><div className="fallback-square-ads"><GameAppCarousel onSelect={setPanel}/></div><div className="fallback-ad-carousel"><AdCarousel/></div></>}/>:isSearchPage?<SearchResults pools={{'长视频':movies,'短视频':shortVideos,'漫画':comics,'帖子':posts}} details={item=>videoDetails[[0,1,2,3,4,5,0,1,3,4][item.id-1]]} Card={VideoCard} ComicCard={ComicCard} onOpen={open} footerAds={<><div className="fallback-square-ads"><GameAppCarousel onSelect={setPanel}/></div><div className="fallback-ad-carousel"><AdCarousel/></div></>}/>:isAllCategoriesPage?<AllCategories pools={{'长视频':movies,'短视频':shortVideos,'漫画':comics,'帖子':posts}} details={item=>videoDetails[[0,1,2,3,4,5,0,1,3,4][item.id-1]]} Card={VideoCard} ComicCard={ComicCard} onOpen={open} query={query} footerAds={<><div className="fallback-square-ads"><GameAppCarousel onSelect={setPanel}/></div><div className="fallback-ad-carousel"><AdCarousel/></div></>}/>:isAppCenterPage?<AppCenter query={query} onClearSearch={()=>setQuery('')} onSelect={name=>setPanel(name)} ads={<AdCarousel/>} footerAds={<><div className="fallback-square-ads"><GameAppCarousel onSelect={setPanel}/></div><div className="fallback-ad-carousel"><AdCarousel/></div></>}/>:isPostDetailPage?<PostDetail key={detailPost.id} post={detailPost} posts={posts} movies={movies} details={postStats} Card={VideoCard} onOpen={open} authUser={authUser} onLogin={()=>setPanel('登录')} ads={<AdCarousel/>} footerAds={<><div className="fallback-square-ads"><GameAppCarousel onSelect={setPanel}/></div><div className="fallback-ad-carousel"><AdCarousel/></div></>}/>:isComicReaderPage?<ComicReader comic={detailComic} initialChapter={Number(comicReaderMatch[2])} ads={<AdCarousel/>} footerAds={<><div className="fallback-square-ads"><GameAppCarousel onSelect={setPanel}/></div><div className="fallback-ad-carousel"><AdCarousel/></div></>}/>:isComicDetailPage?<ComicDetail key={detailComic.id} comic={detailComic} comics={comics} details={comicStats} Card={ComicCard} onOpen={open} authUser={authUser} onLogin={()=>setPanel('登录')} footerAds={<><div className="fallback-square-ads"><GameAppCarousel onSelect={setPanel}/></div><div className="fallback-ad-carousel"><AdCarousel/></div></>}/>:isVideoDetailPage?<VideoDetail authUser={authUser} onLogin={()=>setPanel('登录')} key={`${isShortVideoDetailPage?'short':'long'}-${detailMovie.id}`} portrait={isShortVideoDetailPage} movie={detailMovie} movies={detailPool} details={{...detailStats,duration:detailMovie.duration||detailStats.duration}} Card={VideoCard} onOpen={open} ads={<AdCarousel/>} footerAds={<><div className="fallback-square-ads"><GameAppCarousel onSelect={setPanel}/></div><div className="fallback-ad-carousel"><AdCarousel/></div></>}/>:isRankingsPage?<RankingsPage pools={{long:movies,short:shortVideos,post:posts,comic:comics}} Card={VideoCard} ComicCard={ComicCard} onOpen={open} query={query} footerAds={<><div className="fallback-square-ads"><GameAppCarousel onSelect={setPanel}/></div><div className="fallback-ad-carousel"><AdCarousel/></div></>}/>:isVideoListPage?<LongVideoList post={isPostPage} comic={isComicPage} ComicCard={ComicCard} portrait={isShortVideoPage} movies={isPostPage?posts:isComicPage?comics:isShortVideoPage?shortVideos:movies} Card={VideoCard} onOpen={open} query={query} onClearSearch={()=>setQuery('')} footerAds={<><div className="fallback-square-ads"><GameAppCarousel onSelect={setPanel}/></div><div className="fallback-ad-carousel"><AdCarousel/></div></>}/>:<main className="container page-content"><GameAppCarousel onSelect={setPanel}/><section className="recommend"><div className="section-heading"><h2>{query?'搜索结果':'热门推荐'}</h2><button className="more refresh-recommendations" onClick={()=>setRecommendOffset(offset=>offset+3)} disabled={visible.length<2}>换一换<img src="/assets/change.svg" alt="" aria-hidden="true" width="16" height="16"/></button></div><div className="poster-grid">{visible.map(m=><VideoCard key={m.id} movie={m} onOpen={open}/>)}</div>{!visible.length&&<div className="empty"><MagnifyingGlass size={30}/><h3>暂时没有找到相关影片</h3><p>试试其他关键词，或浏览全部精选电影。</p><button className="secondary" onClick={()=>{setNav('首页');setQuery('');setCategory('全部');setQuality('全部');setYear('全部')}}>浏览全部影片</button></div>}</section>
<section className="continue" aria-label="最新上架"><div className="section-heading"><h2>最新上架</h2><div className="latest-filters" role="group" aria-label="内容类型">{['长视频','短视频','帖子','漫画'].map(type=><button key={type} aria-pressed={latestType===type} className={latestType===type?'selected':''} onClick={()=>{setLatestType(type);setLatestOffset(0)}}>{type}</button>)}</div><button className="more refresh-recommendations" onClick={()=>setLatestOffset(offset=>(offset+3)%movies.length)}>换一换<img src="/assets/change.svg" alt="" aria-hidden="true" width="16" height="16"/></button></div><div className={latestType==='漫画'?'comic-grid':latestType==='帖子'?'post-grid':latestType==='短视频'?'short-video-grid':'latest-video-grid'} aria-live="polite">{latestType==='长视频'?Array.from({length:7},(_,index)=>{const movie=movies[(index+latestOffset)%movies.length];return <VideoCard key={movie.id} movie={movie} onOpen={open}/>;}):latestType==='短视频'?Array.from({length:5},(_,index)=>{const movie=shortVideos[(index+latestOffset)%shortVideos.length];return <VideoCard key={movie.id} movie={movie} onOpen={open} portrait/>;}):latestType==='帖子'?Array.from({length:6},(_,index)=>{const post=posts[(index+latestOffset)%posts.length];return <VideoCard key={post.id} movie={post} onOpen={open} post/>;}):Array.from({length:5},(_,index)=>{const comic=comics[(index+latestOffset)%comics.length];return <ComicCard key={comic.id} comic={comic} onOpen={open}/>;})}</div></section><Rankings onOpen={open}/><section className="recommend long-video-section" aria-label="长视频兜底"><div className="section-heading"><h2>长视频兜底</h2><a className="more ranking-more" href="/long-videos" target="_blank" rel="noopener noreferrer">查看更多<img className="more-arrow" src="/assets/right-arrow.svg" alt="" aria-hidden="true" width="16" height="16"/></a></div><div className="poster-grid">{[...movies.slice(fallbackOffset),...movies.slice(0,fallbackOffset)].map(movie=><VideoCard key={movie.id} movie={movie} onOpen={open}/>)}</div><div className="fallback-refresh-row"><button className="more refresh-recommendations fallback-refresh" onClick={()=>setFallbackOffset(offset=>(offset+3)%movies.length)}>换一换<img src="/assets/change.svg" alt="" aria-hidden="true" width="16" height="16"/></button></div></section><div className="fallback-ad-carousel"><AdCarousel/></div><section className="recommend short-video-section" aria-label="短视频兜底"><div className="section-heading"><h2>短视频兜底</h2><a className="more ranking-more" href="/short-videos" target="_blank" rel="noopener noreferrer">查看更多<img className="more-arrow" src="/assets/right-arrow.svg" alt="" aria-hidden="true" width="16" height="16"/></a></div><div className="short-video-grid">{[...shortVideos.slice(shortFallbackOffset),...shortVideos.slice(0,shortFallbackOffset)].map(movie=><VideoCard key={movie.id} movie={movie} onOpen={open} portrait/>)}</div><div className="fallback-refresh-row"><button className="more refresh-recommendations fallback-refresh" onClick={()=>setShortFallbackOffset(offset=>(offset+3)%shortVideos.length)}>换一换<img src="/assets/change.svg" alt="" aria-hidden="true" width="16" height="16"/></button></div></section><div className="fallback-square-ads"><GameAppCarousel onSelect={setPanel}/></div><section className="recommend comic-fallback-section" aria-label="漫画兜底"><div className="section-heading"><h2>漫画兜底</h2><button className="more ranking-more" onClick={()=>setPanel('全部漫画')}>查看更多<img className="more-arrow" src="/assets/right-arrow.svg" alt="" aria-hidden="true" width="16" height="16"/></button></div><div className="comic-grid">{[...comics.slice(comicFallbackOffset),...comics.slice(0,comicFallbackOffset)].map(comic=><ComicCard key={comic.id} comic={comic} onOpen={open}/>)}</div><div className="fallback-refresh-row"><button className="more refresh-recommendations fallback-refresh" onClick={()=>setComicFallbackOffset(offset=>(offset+3)%comics.length)}>换一换<img src="/assets/change.svg" alt="" aria-hidden="true" width="16" height="16"/></button></div></section><div className="fallback-ad-carousel"><AdCarousel/></div><section className="recommend post-fallback-section" aria-label="帖子兜底"><div className="section-heading"><h2>帖子兜底</h2><button className="more ranking-more" onClick={()=>setPanel('全部帖子')}>查看更多<img className="more-arrow" src="/assets/right-arrow.svg" alt="" aria-hidden="true" width="16" height="16"/></button></div><div className="post-grid post-fallback-grid">{Array.from({length:6},(_,index)=>{const post=posts[(index+postFallbackOffset)%posts.length];return <VideoCard key={post.id} movie={post} onOpen={open} post/>;})}</div><div className="fallback-refresh-row"><button className="more refresh-recommendations fallback-refresh" onClick={()=>setPostFallbackOffset(offset=>(offset+3)%posts.length)}>换一换<img src="/assets/change.svg" alt="" aria-hidden="true" width="16" height="16"/></button></div></section><section className="recommend random-video-section" aria-label="随机视频"><div className="section-heading"><h2>随机视频</h2><button className="more refresh-recommendations" onClick={()=>setRandomVideos(previous=>pickRandomVideos(previous))}>换一换<img src="/assets/change.svg" alt="" aria-hidden="true" width="16" height="16"/></button></div><div className="poster-grid">{randomVideos.map(movie=><VideoCard key={movie.id} movie={movie} onOpen={open}/>)}</div></section><div className="fallback-square-ads"><GameAppCarousel onSelect={setPanel}/></div><div className="fallback-ad-carousel"><AdCarousel/></div></main>}
<footer><div className="container footer-content"><a className="brand" href="/"><img className="brand-logo" src="/assets/logo.svg" alt="万象" width="161" height="48"/></a><span className="tagline">好电影，连接更大的世界</span><div className="footer-links">{['关于我们','帮助中心','联系我们','用户协议','隐私政策'].map(t=><button key={t} onClick={()=>setPanel(t)}>{t}</button>)}</div><span>© 2026 映界 版权所有</span></div></footer>
<FloatingTools/>
<dialog ref={dialog} aria-label={selected?selected.title:panel||'内容详情'} className={panel==='金币充值'?'coin-recharge-dialog':panel==='VIP'?'vip-center-dialog':['AI秀场','AI女友'].includes(panel)?'ai-exchange-dialog':panel==='登录'?'auth-dialog':panel==='异常登录'?'abnormal-login-dialog':panel==='系统通知'?'system-notice-dialog':panel==='首页广告'?'home-ad-dialog':panel==='热门应用'?'popular-apps-dialog':undefined} onCancel={e=>{e.preventDefault();if(panel!=='系统通知')closeMainDialog()}} onClick={e=>{if(e.target===dialog.current&&panel!=='系统通知')closeMainDialog()}}>{!['首页广告','系统通知','异常登录'].includes(panel)&&<button className="close icon" aria-label="关闭" onClick={closeMainDialog}><X/></button>}{panel==='金币充值'?<CoinRecharge wallet={aiWallet} onBack={()=>setPanel(rechargeReturn)}/>:panel==='VIP'?<VipCenter user={authUser}/>:['AI秀场','AI女友'].includes(panel)?<AiPointsExchange key={panel} entry={panel} wallet={aiWallet} onRecharge={()=>{setRechargeReturn(panel);setPanel('金币充值')}} onExchange={coins=>setAiWallet(current=>coins<=current.coins?{coins:current.coins-coins,points:current.points+coins*10}:current)} onClose={closeMainDialog}/>:panel==='登录'?<AuthPanel onAuthenticated={setAuthUser} onContinue={()=>setPanel(null)}/>:panel==='个人中心'&&authUser?<div className="dialog-body panel"><h2>我的账号</h2><p>欢迎回来，<strong className="mock-account-name">{authUser.account}</strong></p><p>当前为本地模拟登录，刷新页面后重置。</p><div className="mock-account-actions"><button className="auth-submit" onClick={()=>{setAuthUser(null);setPanel('登录')}}>退出登录</button></div></div>:panel==='异常登录'?<div className="abnormal-login"><div className="abnormal-login-banner"><h2>异常登录提醒</h2></div><div className="abnormal-login-body"><h3>当前账号已在另一台设备登录</h3><p>检测到你的账号在另一台设备登录，当前设备已退出，请重新登录。</p><div className="abnormal-login-actions"><button className="abnormal-ignore" onClick={closeMainDialog}>忽略</button><button className="abnormal-relogin" onClick={()=>setPanel('登录')}>重新登录</button></div></div></div>:panel==='系统通知'?<div className="system-notice"><div className="system-notice-banner"><h2>欢迎来到万象</h2></div><div className="system-notice-body"><p>长视频、短视频、漫画和帖子已集中展示在首页。你可以通过顶部导航找到感兴趣的内容，也可以使用站内搜索快速查找。</p><p>当前为页面演示，部分内容和统计数据为示例，视频播放、应用下载及会员服务暂未开放。感谢你的体验与关注。</p><div className="notice-acknowledge-wrap" onMouseEnter={()=>setNoticeReady(true)} onMouseLeave={()=>setNoticeReady(false)} onFocus={()=>setNoticeReady(true)} onBlur={()=>setNoticeReady(false)}><button className="notice-acknowledge" aria-disabled={!noticeReady} onClick={()=>{if(noticeReady)closeMainDialog()}}>我已了解</button></div></div></div>:panel==='首页广告'?<div className="home-ad-content"><img className="home-ad-image" src="/assets/ad-deals.png" alt="限时优惠广告，最高优惠70%"/><button className="home-ad-close" onClick={closeMainDialog} aria-label="关闭广告"><X size={20}/></button></div>:selected?<><div className="detail-art">{selected.id===0?<img src="/assets/hero.png" alt="星际回响中的异星景观"/>:<Sprite x={selected.x} y={582} w={169} h={210}/>}</div><div className="dialog-body"><h2>{selected.title}</h2><p className="detail-meta">{selected.year} · {selected.genre} <strong>★ {selected.score}</strong></p><p>{selected.description}</p>{['post','comic'].includes(selected.contentType)?null:playing?<div className="play-notice"><Play size={24}/><div><b>正片资源尚未接入</b><p>当前为界面演示，暂无可播放的视频源。</p></div></div>:<button className="primary" onClick={()=>setPlaying(true)}><Play weight="fill"/>立即播放</button>}<button className="secondary" onClick={()=>toggleSave(selected)}>{saved.includes(selected.id)?<Check/>:<Plus/>}{saved.includes(selected.id)?'已加入片单':'加入片单'}</button></div></>:<div className="dialog-body panel">{panel==='热门应用'?<div className="popular-apps-banner"><h2>热门应用</h2></div>:<h2>{panel}</h2>}{panel==='热门应用'?<div className="popular-apps-grid">{gameApps.map((name,i)=><button className="app-shortcut" key={name} onClick={()=>setPanel(name)}><span className="game-app-icon" aria-hidden="true" style={{backgroundPosition:`${i%4*100/3}% ${Math.floor(i/4)*50}%`}}/><span>{name}</span></button>)}</div>:panel==='全部分类'?<div className="category-picker">{['全部','科幻','悬疑','动作','喜剧','爱情','动画','古装','奇幻'].map(c=><button key={c} onClick={()=>{setCategory(c);setNav('首页');setQuery('');setQuality('全部');setYear('全部');setPanel(null)}}>{c}</button>)}</div>:['我的片单','观看历史','全部影片','全部短视频','全部漫画','全部帖子'].includes(panel)?<div className="list">{(panel==='我的片单'?[space,...movies].filter(m=>saved.includes(m.id)):panel==='观看历史'?[space,movies[0],movies[2]]:panel==='全部短视频'?shortVideos:panel==='全部漫画'?comics:panel==='全部帖子'?posts:[space,...movies]).map(m=><button key={m.id} onClick={()=>{setPanel(null);open(m)}}><Play/><div><b>{m.title}</b><small>{m.genre} · {m.year}</small></div><strong>{m.score}</strong><CaretRight/></button>)}{panel==='我的片单'&&!saved.length&&<div className="empty"><Heart size={36}/><p>片单还是空的</p><p>点击影片的「加入片单」，收藏你想看的故事。</p></div>}</div>:<p>{(gameApps.includes(panel)||isAppCenterPage)?'该应用入口正在准备中，暂未接入应用服务。':panel==='登录'?'账号登录服务暂未开放。你仍可浏览影片，并在当前浏览器中收藏片单。':panel==='AI女友'?'AI女友功能即将开放，敬请期待。':panel==='AI秀场'?'AI秀场即将开放，敬请期待更多 AI 创作短片。':panel==='VIP'?'VIP 会员服务暂未开放，当前无需付费即可体验页面功能。':panel==='APP下载'?'APP 正在准备中，正式上线后将在这里提供官方下载入口。':panel==='个人中心'?'欢迎来到映界。你的片单会保存在当前浏览器，随时回来继续探索。':panel==='隐私政策'?'本演示仅在当前浏览器保存片单数据，不收集或上传个人信息。':panel==='用户协议'?'本页面为影视首页设计演示，影片信息为示例内容，不提供实际视频播放服务。':panel==='联系我们'?'感谢你对映界的关注。当前为设计演示，暂未开放在线联系服务。':panel==='帮助中心'?'使用顶部搜索查找影片，通过分类和筛选发现内容。点击海报查看详情，点击「加入片单」保存喜欢的影片。':'映界，好电影，连接更大的世界。我们希望让每一次探索，都遇见一个值得沉浸的故事。'}</p>}</div>}</dialog></>}
createRoot(document.getElementById('root')).render(<ContentPreviewProvider><App/></ContentPreviewProvider>);
