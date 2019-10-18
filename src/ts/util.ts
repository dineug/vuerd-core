import log from './Logger'
import { v4 as uuid } from 'uuid'

export {
  log,
  uuid
}

interface List {
  id: string
}

export function getData<T extends List> (list: T[], id: string): T | null {
  for (const v of list) {
    if (v.id === id) {
      return v
    }
  }
  return null
}

export function getDataIndex<T extends List> (list: T[], id: string): number | null {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      return i
    }
  }
  return null
}

export function isData<T extends List> (list: T[], id: string): boolean {
  for (const v of list) {
    if (v.id === id) {
      return false
    }
  }
  return true
}

interface Node<T> {
  parent: T | null
  children?: T[]
}

export function setParent<T extends Node<T>> (parent: T, children?: T[]): T {
  if (children) {
    children.forEach((node: T) => {
      if (parent) {
        node.parent = parent
      }
      if (node.children && node.children.length !== 0) {
        setParent(node, node.children)
      }
    })
  }
  return parent
}

export function findParentLiByElement (el: HTMLElement | null): HTMLElement | null {
  if (el === null) {
    return null
  } else if (el.localName === 'li') {
    return el
  }
  return findParentLiByElement(el.parentElement)
}

export function validFileName (name: string): string {
  return name.replace(/[<>:"\/\\|?*\x00-\x1F]/g, '')
}

interface Name {
  id: string
  name: string
}

export function autoName<T extends Name> (list: T[], id: string, name: string, num: number = 1): string {
  let result = true
  for (const value of list) {
    if (name === value.name && value.id !== id) {
      result = false
      break
    }
  }
  if (result) {
    return name
  }
  return autoName(list, id, name.replace(/[0-9]/g, '') + num, num + 1)
}
