export function px2rem(px) {
  const ratio = 375 / 10;
  return px / ratio;
}

/*我们设置 root fontSize 最大为 50px 且是按 window width  1/10计算 
  当px2rem(1) 在500（或更大） width window 的屏幕显示中，px2rem(1) 表示的px 值达到最大值
  在 375 屏幕中 px2rem(1) 中，1 表示1px, 在更大屏中 这里的 1 将表示一个大于 1px 的值，实际是多少
  将由 realPx 计算，realPx(1) 将返回 1 表示的实际 px 值 */
export function realPx(px) {
  const maxWidth = window.innerWidth > 500 ? 500 : window.innerWidth;
  return px * (maxWidth / 375);
}
