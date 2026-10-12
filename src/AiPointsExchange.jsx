import React, {useRef, useState} from 'react';
import {ArrowLeft, CheckCircle} from '@phosphor-icons/react';
import './ai-points-exchange.css';

const asset = name => `/assets/ai-exchange/${name}.svg`;
function CoinIcon({small = false}) {
  const prefix = small ? 'coin-small-' : 'coin-';
  return <span className={`exchange-coin${small ? ' small' : ''}`} aria-hidden="true">
    {['fill', 'border', 'shine'].map(part => <span key={part} className={`coin-${part}`} style={{maskImage:`url(${asset(prefix + part)})`}}/>)}<b>¥</b>
  </span>;
}
function ExchangeIcon({name}) {
  return <span className={`exchange-asset exchange-${name}`} style={{maskImage:`url(${asset(name)})`}} aria-hidden="true"/>;
}

export default function AiPointsExchange({entry, wallet, onExchange, onClose, onRecharge}) {
  const [amount, setAmount] = useState('');
  const [blurred, setBlurred] = useState(false);
  const [message, setMessage] = useState('');
  const [recharge, setRecharge] = useState(false);
  const submitting = useRef(false);
  const coins = Number(amount);
  const validInteger = /^\d+$/.test(amount) && Number.isSafeInteger(coins);
  const valid = validInteger && coins >= 10 && coins <= wallet.coins;
  const points = valid ? coins * 10 : 0;
  const error = !amount.trim() ? (blurred ? '请输入您要兑换的金币数量' : '') : Number.isFinite(coins) && coins < 10 ? '最低兑换10金币' : !validInteger ? '请输入整数金币数量' : coins > wallet.coins ? '金币余额不足，请先充值' : '';
  function exchange(event) {
    event.preventDefault();
    if (!valid || submitting.current) return;
    submitting.current = true;
    onExchange(coins);
    setMessage(`兑换成功，已获得 ${points.toLocaleString('zh-CN')} 积分，当前积分 ${(wallet.points + points).toLocaleString('zh-CN')}（模拟体验）`);
    setAmount('');
    setBlurred(false);
    submitting.current = false;
  }
  return <div className="ai-exchange-panel">
    <header className="exchange-heading"><span className="exchange-heading-icon"><ExchangeIcon name="lightning"/></span><div><h2>{recharge ? '金币充值' : '积分兑换'}</h2><p>{entry} · 超值兑换好礼，精彩内容看不停</p></div></header>
    {recharge ? <div className="exchange-recharge"><CoinIcon/><h3>金币充值</h3><p>充值服务暂未接入，当前金币余额为 {wallet.coins.toLocaleString('zh-CN')}。</p><button className="exchange-secondary" onClick={() => setRecharge(false)}><ArrowLeft size={16}/>返回兑换</button></div> : <form onSubmit={exchange} noValidate>
      <label className="exchange-label" htmlFor="ai-exchange-amount">兑换积分</label>
      <div className={`exchange-input${error ? ' invalid' : ''}`}><CoinIcon/><input id="ai-exchange-amount" autoFocus type="text" inputMode="numeric" autoComplete="off" placeholder="输入金币数量" value={amount} aria-invalid={!!error} aria-describedby={`exchange-rate${error ? ' exchange-error' : ''}`} onBlur={() => setBlurred(true)} onChange={event => {setAmount(event.target.value);setMessage('');}}/></div>
      <div className="exchange-input-help">
        <p className="exchange-rate" id="exchange-rate"><strong>1金币</strong><span>兑换</span><b>10积分</b></p>
        {error && <p className="exchange-error" id="exchange-error" role="alert">{error}</p>}
      </div>
      <div className="exchange-balances"><div className="exchange-balance"><span className="exchange-balance-label"><CoinIcon small/>剩余金币</span><div className="exchange-balance-value"><strong>{wallet.coins.toLocaleString('zh-CN')}</strong><span>金币</span></div><button type="button" className="exchange-recharge-button" onClick={() => onRecharge ? onRecharge() : setRecharge(true)}><ExchangeIcon name="wallet"/>充值</button></div><div className="exchange-balance"><span className="exchange-balance-label"><ExchangeIcon name="star"/>预计可兑换</span><div className="exchange-balance-value"><strong>{points.toLocaleString('zh-CN')}</strong><span>积分</span></div></div></div>
      {message && <p className="exchange-success" role="status"><CheckCircle size={18}/>{message}</p>}
      <div className="exchange-actions"><button type="button" className="exchange-secondary" onClick={onClose}>先逛逛</button><button type="submit" className="exchange-submit" disabled={!valid}>立即兑换<ExchangeIcon name="arrow"/></button></div>
    </form>}
  </div>;
}
