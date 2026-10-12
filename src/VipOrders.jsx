import React from 'react';

export const demoVipOrders = [
  {id:'ORD-20240612-001', name:'年度会员', status:'paid', amount:128, time:'2024-06-12 14:32:08'},
  {id:'ORD-20240315-002', name:'季度会员', status:'paid', amount:45, time:'2024-03-15 09:18:44'},
  {id:'ORD-20231201-003', name:'月度会员', status:'failed', amount:18, time:'2023-12-01 20:05:31'},
  {id:'ORD-20230901-004', name:'季度会员', status:'paid', amount:45, time:'2023-09-01 11:47:19'},
  {id:'ORD-20230601-005', name:'月度会员', status:'pending', amount:18, time:'2023-06-01 08:00:00'},
  ...Array.from({length:15}, (_,index) => {
    const day = String(28-index).padStart(2,'0');
    const month = String(5-Math.floor(index/5)).padStart(2,'0');
    const sequence = String(index+6).padStart(3,'0');
    const plan = [
      {name:'月度会员', amount:18},
      {name:'季度会员', amount:45},
      {name:'年度会员', amount:128},
    ][index%3];
    return {id:`ORD-2023${month}${day}-${sequence}`, ...plan,
      status:['paid','paid','failed','pending'][index%4],
      time:`2023-${month}-${day} 10:24:36`};
  }),
];
const statusLabels = {paid:'已支付', failed:'支付失败', pending:'待支付'};

export default function VipOrders({orders=[]}) {
  if (!orders.length) return <div className="vip-orders-empty"><img className="vip-empty-orders-icon" src="/assets/vip-center/empty-orders.png" alt="" width="160" height="160"/><h3>暂无订单记录</h3></div>;
  return <section className="vip-orders-panel" aria-label="会员订单记录">
    <div className="vip-orders-scroll" tabIndex={0} role="region" aria-label="订单列表，可上下滚动"><table className="vip-orders-table">
      <colgroup><col className="vip-order-name-col"/><col className="vip-order-status-col"/><col className="vip-order-amount-col"/><col className="vip-order-time-col"/></colgroup>
      <thead><tr><th scope="col">会员名称</th><th scope="col">支付状态</th><th scope="col">金额</th><th scope="col">支付时间</th></tr></thead>
      <tbody>{orders.map(order=><tr key={order.id}>
        <td><strong className="vip-order-name">{order.name}</strong><span className="vip-order-number">{order.id}</span></td>
        <td><span className={`vip-order-status ${order.status}`}>{statusLabels[order.status]}</span></td>
        <td><strong className="vip-order-amount">¥{order.amount}</strong></td>
        <td><span className="vip-order-time"><span className="vip-order-clock" aria-hidden="true"/><time dateTime={order.time.replace(' ','T')}>{order.time}</time></span></td>
      </tr>)}</tbody>
    </table></div>
    <p className="vip-orders-demo-note">示例订单记录</p>
  </section>;
}
