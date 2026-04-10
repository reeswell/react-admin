import { create } from 'zustand'

export interface TagView {
  path: string
  title: string
}

interface TagsState {
  visitedViews: TagView[]
  addView: (view: TagView) => void
  removeView: (path: string) => void
  removeOthers: (path: string) => void
  removeAll: () => void
}

export const useTagsStore = create<TagsState>(set => ({
  visitedViews: [{ path: '/', title: '首页' }],
  addView: view =>
    set(state => ({
      visitedViews: state.visitedViews.some(v => v.path === view.path)
        ? state.visitedViews
        : [...state.visitedViews, view],
    })),
  removeView: path =>
    set(state => ({
      visitedViews: state.visitedViews.filter(v => v.path !== path || path === '/'),
    })),
  removeOthers: path =>
    set(state => ({
      visitedViews: state.visitedViews.filter(v => v.path === path || v.path === '/'),
    })),
  removeAll: () =>
    set(() => ({
      visitedViews: [{ path: '/', title: '首页' }],
    })),
}))
