export const rankingTypes = [
  { key: 'long', label: '长视频' },
  { key: 'short', label: '短视频' },
  { key: 'post', label: '帖子' },
  { key: 'comic', label: '漫画' },
];
export const rankingPeriods = ['日榜', '近7天榜', '近15天榜', '近30天榜'];
export const rankingOrders = [
  [3,0,5,1,8,2,6,4,9,7],
  [0,5,3,8,1,6,4,2,7,9],
  [5,3,8,0,6,1,9,4,2,7],
  [8,3,0,5,1,9,6,2,4,7],
];
export function rankingHref(label, period = 0) {
  const type = rankingTypes.find(item => item.label === label)?.key || 'long';
  return `/rankings?type=${type}&period=${period}`;
}
export function getRanking(pool, typeIndex, period) {
  return rankingOrders[period].map((index, rank) => ({
    item: pool[(index + typeIndex * 2) % pool.length],
    rank: rank + 1,
  }));
}
