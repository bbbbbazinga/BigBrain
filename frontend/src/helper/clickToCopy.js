function clickToCopy() {
  const copyEle = document.querySelector('#urlLink'); // 获取要复制的节点
  const range = document.createRange(); // 创造range
  window.getSelection().removeAllRanges(); // 清除页面中已有的selection
  range.selectNode(copyEle); // 选中需要复制的节点
  window.getSelection().addRange(range); // 执行选中元素
  document.execCommand('Copy');
  window.getSelection().removeAllRanges(); // 清除页面中已有的selection
}

export default clickToCopy;
