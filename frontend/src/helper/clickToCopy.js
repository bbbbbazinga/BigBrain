function clickToCopy() {
  const copyEle = document.querySelector('#urlLink');
  const range = document.createRange();
  window.getSelection().removeAllRanges();
  range.selectNode(copyEle);
  window.getSelection().addRange(range);
  document.execCommand('Copy');
  window.getSelection().removeAllRanges();
}

export default clickToCopy;
