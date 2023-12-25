import { FILTERTAGS, ID } from './constants'

/**
 * 匹配符号和数字
 * @param {string} text - 给定的文本
 * @returns {boolean} - 如果文本中包含字符则返回true，否则返回false
 */
function shouldTranslate(text: string) {
  return !/^[\d!@#$%^&*()_+-=,.<>?;:'"{}[\]\\/]*$/.test(text)
}

/**
 * 获取页面上所有文本节点
 * @param {HTMLElement} node 根节点
 * @param {string[]}  whitelist 提取白名单
 * @param {string} id 需要 div 下的文本节点的 id
 * @returns nodes
 */
export function getAllTextNodes(
  node: HTMLElement | Node,
  whitelist: string[] = [],
  id: string = ID
) {
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, {
    acceptNode: function (node) {
      // 过滤某个 div 下的所有文本节点
      if (isDescendantOf(node, document.getElementById(id)!)) {
        return NodeFilter.FILTER_SKIP
      }
      // 过滤一些不需要的元素节点
      if (
        node.nodeType === Node.ELEMENT_NODE &&
        FILTERTAGS.includes(node.parentElement?.tagName?.toLowerCase() || '')
      ) {
        return NodeFilter.FILTER_REJECT
      }
      // 处理文本节点
      if (node.nodeType === Node.TEXT_NODE) {
        const value = node.nodeValue?.trim() || ''
        // 过滤一些不需要的文本节点.例如： 白名单内的文本节点，标点符号或数字
        return !whitelist.includes(value) && shouldTranslate(value)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_SKIP
      }
      // 其他元素节点默认接受
      return NodeFilter.FILTER_ACCEPT
    }
  })
  const textNodes = []
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode)
  }
  return textNodes
}

/**
 * 比对数组，找出和 key 长度最接近的值并返回
 * @param {string[]} arr
 * @param {string} key
 */
export function keyArrEqual(arr: string[], key: string) {
  return arr.reduce((prev, curr) => {
    return Math.abs(curr.length - key.length) < Math.abs(prev.length - key.length) ? curr : prev
  })
}

/**
 * 判断一个节点是否是另一个HTMLElement节点的后代
 *
 * @param node - 要判断的节点
 * @param ancestor - HTMLElement节点
 * @returns 如果node是ancestor的后代则返回true，否则返回false
 */
function isDescendantOf(node: Node, ancestor: HTMLElement) {
  while (node !== null) {
    if (node === ancestor) {
      return true
    }
    node = node.parentNode!
  }
  return false
}
