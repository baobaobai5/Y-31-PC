import React, {useState} from 'react';
import {Check, ArrowLeft, Info} from '@phosphor-icons/react';
import './vip-center.css';
import VipOrders, {demoVipOrders} from './VipOrders';

const asset = name => `/assets/vip-center/${name}`;
const plans = [
  {id:'month', name:'月度会员', duration:'1个月', price:18},
  {id:'quarter', name:'季度会员', duration:'3个月', price:48},
  {id:'half', name:'半年会员', duration:'6个月', price:88},
  {id:'year', name:'年度会员', duration:'12个月', price:128},
  {id:'two-year', name:'两年会员', duration:'24个月', price:228},
];
const benefits = [
  ['member.png','VIP会员'], ['content.png','会员内容免费'],
  ['service.png','专属客服'], ['skip.png','跳过广告','+3'],
  ['coins.png','金币内容免费'], ['experience.png','赠送经验值'],
  ['comment.png','评论'],
];

function AssetIcon({name, className=''}) {
  return <span aria-hidden="true" className={`vip-asset-icon ${className}`} style={{maskImage:`url(${asset(name)})`}}/>;
}

export default function VipCenter({user, orders=demoVipOrders}) {
  const [tab,setTab] = useState('upgrade');
  const [planId,setPlanId] = useState('year');
  const [payment,setPayment] = useState('微信支付');
  const [checkout,setCheckout] = useState(false);
  const [notice,setNotice] = useState('');
  const plan = plans.find(item => item.id === planId);
  const switchTab = next => {setTab(next);setCheckout(false);setNotice('');};

  return <div className="vip-center">
    <aside className="vip-sidebar">
      <div className="vip-profile"><img src={asset('avatar.png')} alt="" width="52" height="52"/><div><strong>{user?.nickname || user?.nickName || '用户昵称'}</strong><span>{user ? '欢迎来到会员中心' : '欢迎体验会员中心'}</span></div></div>
      <nav className="vip-section-nav" aria-label="会员中心导航">
        <button className={tab==='upgrade'?'selected':''} aria-current={tab==='upgrade'?'page':undefined} onClick={()=>switchTab('upgrade')}><span className="vip-nav-icon"><AssetIcon name="nav-member.svg"/></span><span><b>开通会员</b><small>套餐 · 权益 · 支付</small></span></button>
        <button className={tab==='orders'?'selected':''} aria-current={tab==='orders'?'page':undefined} onClick={()=>switchTab('orders')}><span className="vip-nav-icon"><AssetIcon name="nav-orders.svg"/></span><span><b>订单记录</b><small>历史 · 状态</small></span></button>
      </nav>
    </aside>
    <section className="vip-main">
      <header className="vip-heading"><h2>{tab==='orders'?'订单记录':checkout?'确认开通':'开通会员'}</h2><p>{tab==='orders'?'查看历史与订单状态':checkout?'确认所选套餐与支付方式':'解锁全部高级权益，享受尊享体验'}</p></header>
      <div className="vip-content">
        {tab==='orders'?<VipOrders orders={orders}/>:checkout?<div className="vip-checkout">
          <button className="vip-back" onClick={()=>{setCheckout(false);setNotice('');}}><ArrowLeft size={16}/>返回套餐选择</button>
          <div className="vip-order-summary"><span className="vip-summary-icon"><AssetIcon name="nav-member.svg"/></span><h3>{plan.name}</h3><p>{plan.duration} · 解锁会员权益</p><strong><small>￥</small>{plan.price}</strong><dl><div><dt>支付方式</dt><dd><img src={asset(payment==='微信支付'?'wechat.svg':'alipay.svg')} width="20" height="20" alt=""/>{payment}</dd></div><div><dt>订单状态</dt><dd>尚未支付</dd></div></dl></div>
          <button className="vip-open-button" onClick={()=>setNotice('支付服务暂未接入，暂时无法完成开通，请稍后再试。')}>确认支付 ￥{plan.price}</button>
          {notice&&<p className="vip-payment-notice" role="status"><Info size={18}/>{notice}</p>}
        </div>:<>
          <fieldset className="vip-plans-section"><legend>选择套餐</legend><div className="vip-plans" role="radiogroup" aria-label="会员套餐">{plans.map(item=><button key={item.id} role="radio" aria-checked={plan.id===item.id} className={`vip-plan${plan.id===item.id?' selected':''}`} onClick={()=>setPlanId(item.id)}><b>{item.name}</b><span>{item.duration}</span><strong><small>¥</small>{item.price}</strong>{plan.id===item.id&&<span className="vip-plan-check"><Check size={11} weight="bold"/></span>}</button>)}</div></fieldset>
          <section className="vip-benefits-section" aria-labelledby="vip-benefits-title"><h3 id="vip-benefits-title">会员权益</h3><div className="vip-benefits">{benefits.map(([image,label,extra])=><div className="vip-benefit" key={label}><div className="vip-benefit-art"><img className="vip-benefit-bg" src={asset('benefit-bg.svg')} alt=""/><span className={`vip-benefit-image ${image==='skip.png'?'skip':image==='comment.png'?'comment':''}`}><img src={asset(image)} alt=""/></span></div><span>{label}{extra&&<><br/>{extra}</>}</span></div>)}</div></section>
          <fieldset className="vip-payment-section"><legend>支付方式</legend><div role="radiogroup" aria-label="支付方式">{['微信支付','支付宝'].map(name=><button role="radio" aria-checked={payment===name} key={name} className={payment===name?'selected':''} onClick={()=>setPayment(name)}><img src={asset(name==='微信支付'?'wechat.svg':'alipay.svg')} width="20" height="20" alt=""/>{name}{payment===name&&<Check size={14}/>}</button>)}</div></fieldset>
          <button className="vip-open-button" onClick={()=>setCheckout(true)}><AssetIcon name="submit-crown.svg"/><strong>￥{plan.price}</strong><span>立即开通 {plan.name}</span></button>
          <p className="vip-price-note">套餐价格为展示数据，实际开通以正式服务为准</p>
        </>}
      </div>
    </section>
  </div>;
}
