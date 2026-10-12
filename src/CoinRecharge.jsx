import React, {useState} from 'react';
import {ArrowLeft, Check, Info} from '@phosphor-icons/react';
import './coin-recharge.css';

const asset = name => `/assets/coin-recharge/${name}.svg`;
// Keep the eight slots and prices from the supplied design.
const tiers = Array.from({length:8}, (_,index) => index===4 ? {coins:680,price:52,original:68} : {coins:60,price:5,original:6});
function CoinArt(){return <span className="recharge-coin" aria-hidden="true"><img className="recharge-coin-fill" src={asset('coin-fill')} alt=""/><img className="recharge-coin-shine" src={asset('coin-shine')} alt=""/><b>¢</b></span>;}
function NavIcon({name}){return <span className="recharge-nav-icon"><i style={{maskImage:`url(${asset(name)})`}} aria-hidden="true"/></span>;}

const demoRecords = Array.from({length:6}, (_,index)=>({
  id:`coin-record-${index}`, name:index===0?'充值':'西游记',
  description:index===0?'充值：10元':'购买视频：西游记',
  amount:index===0?100:-100, time:'2024-06-12 14:32:08',
}));
function CoinRecords({records}){
  if(!records.length) return <div className="recharge-empty"><img src="/assets/vip-center/empty-orders.png" alt="" width="160" height="160"/><h3>暂无金币记录</h3></div>;
  return <><div className="coin-records-scroll" tabIndex={0} role="region" aria-label="金币记录，可上下滚动"><table className="coin-records-table"><caption className="coin-records-caption">金币记录</caption><colgroup><col className="coin-record-name-col"/><col className="coin-record-amount-col"/><col className="coin-record-time-col"/></colgroup><thead><tr><th scope="col">名称</th><th scope="col">金币</th><th scope="col">支付时间</th></tr></thead><tbody>{records.map(record=><tr key={record.id}><td><strong className="coin-record-name">{record.name}</strong><span className="coin-record-description">{record.description}</span></td><td><strong className={`coin-record-amount ${record.amount>0?'income':'expense'}`}>{record.amount>0?'+':''}{record.amount}金币</strong></td><td><time className="coin-record-time" dateTime={record.time.replace(' ','T')}><span className="coin-record-clock" aria-hidden="true"/>{record.time}</time></td></tr>)}</tbody></table></div><p className="coin-records-note">示例金币记录</p></>;
}

export default function CoinRecharge({wallet,onBack,records=demoRecords}){
  const [tab,setTab]=useState('recharge');
  const [tierIndex,setTierIndex]=useState(4);
  const [payment,setPayment]=useState('微信支付');
  const [notice,setNotice]=useState('');
  const tier=tiers[tierIndex];
  return <div className="coin-recharge">
    <aside className="recharge-sidebar"><nav aria-label="金币中心导航">{[['recharge','金币充值','档位 · 优惠 · 支付','nav-recharge'],['records','金币记录','充值 · 消费 · 奖励','nav-records']].map(([key,title,subtitle,icon])=><button key={key} className={tab===key?'selected':''} aria-current={tab===key?'page':undefined} onClick={()=>{setTab(key);setNotice('');}}><NavIcon name={icon}/><span><b>{title}</b><small>{subtitle}</small></span></button>)}</nav><div className="recharge-wallet"><span>当前金币余额</span><strong><CoinArt/>{wallet.coins.toLocaleString('zh-CN')}</strong></div>{onBack&&<button className="recharge-back" onClick={onBack}><ArrowLeft size={14}/>返回积分兑换</button>}</aside>
    <section className="recharge-main"><header className="recharge-heading"><h2>{tab==='recharge'?'金币充值':'金币记录'}</h2><p>{tab==='recharge'?'充值越多，优惠越多，赠币最高可达 25%':'查看充值、消费及奖励记录'}</p></header>
      <div className="recharge-content">{tab==='recharge'?<>
        <fieldset><legend>选择金币档位</legend><div className="recharge-tiers" role="radiogroup" aria-label="金币充值档位">{tiers.map((item,index)=><button key={index} role="radio" aria-checked={tierIndex===index} className={`recharge-tier${tierIndex===index?' selected':''}`} aria-label={`${item.coins}金币，${item.price}元，档位${index+1}`} onClick={()=>{setTierIndex(index);setNotice('');}}><span className="recharge-tier-coins"><CoinArt/><b>{item.coins}</b></span><span className="recharge-tier-price"><strong>¥{item.price}</strong><del>¥{item.original}</del></span>{tierIndex===index&&<span className="recharge-tier-check"><Check size={10} weight="bold"/></span>}</button>)}</div></fieldset>
        <fieldset className="recharge-payment"><legend>支付方式</legend><div role="radiogroup" aria-label="充值支付方式">{['微信支付','支付宝'].map(name=><button key={name} role="radio" aria-checked={payment===name} className={payment===name?'selected':''} onClick={()=>{setPayment(name);setNotice('');}}><img src={asset(name==='微信支付'?'wechat':'alipay')} width="20" height="20" alt=""/>{name}{payment===name&&<Check size={14}/>}</button>)}</div></fieldset>
        <button className="recharge-pay" onClick={()=>setNotice('充值支付服务暂未接入，暂时无法完成充值，请稍后再试。')}>立即支付 ¥{tier.price}</button>
        {notice&&<p className="recharge-notice" role="status"><Info size={16}/>{notice}</p>}
      </>:<CoinRecords records={records}/>}</div>
    </section>
  </div>;
}
