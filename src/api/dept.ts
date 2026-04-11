export interface DeptRow {
  id: number
  name: string
  /** 部门类型 ID，对应 fetchDeptTypes 返回的 value */
  type: number
  status: number
  headCount: number
  children?: DeptRow[]
}

export interface LabelValue<T = number> {
  label: string
  value: T
}

export interface DeptQueryParams {
  name?: string
  /** 多选类型筛选，空数组视为不过滤 */
  types?: number[]
  status?: number
  [key: string]: unknown
}

export interface DeptQueryResult {
  list: DeptRow[]
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const DEPT_TREE: DeptRow[] = [
  {
    id: 1, name: '技术中心', type: 1, status: 1, headCount: 120,
    children: [
      {
        id: 11, name: '前端组', type: 1, status: 1, headCount: 30,
        children: [
          { id: 111, name: 'React 小队', type: 1, status: 1, headCount: 12 },
          { id: 112, name: 'Vue 小队', type: 1, status: 0, headCount: 10 },
          { id: 113, name: '移动端小队', type: 1, status: 1, headCount: 8 },
        ],
      },
      { id: 12, name: '后端组', type: 1, status: 1, headCount: 45 },
      { id: 13, name: '测试组', type: 3, status: 1, headCount: 20 },
      { id: 14, name: '架构组', type: 1, status: 0, headCount: 5 },
    ],
  },
  {
    id: 2, name: '产品中心', type: 2, status: 1, headCount: 40,
    children: [
      { id: 21, name: '产品一部', type: 2, status: 1, headCount: 15 },
      { id: 22, name: '产品二部', type: 2, status: 0, headCount: 12 },
      { id: 23, name: '用户研究组', type: 3, status: 1, headCount: 8 },
    ],
  },
  {
    id: 3, name: '运营中心', type: 4, status: 1, headCount: 60,
    children: [
      { id: 31, name: '内容运营', type: 4, status: 1, headCount: 20 },
      { id: 32, name: '用户运营', type: 4, status: 1, headCount: 18 },
      { id: 33, name: '渠道运营', type: 5, status: 0, headCount: 15 },
    ],
  },
  {
    id: 4, name: '职能中心', type: 6, status: 1, headCount: 35,
    children: [
      { id: 41, name: '人力资源部', type: 6, status: 1, headCount: 10 },
      { id: 42, name: '财务部', type: 6, status: 1, headCount: 8 },
      { id: 43, name: '行政部', type: 6, status: 1, headCount: 12 },
    ],
  },
]

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 递归过滤树节点：自身匹配 OR 存在匹配子节点时保留该节点。
 * 不匹配的子节点会被裁剪掉。
 */
function filterTree(
  nodes: DeptRow[],
  predicate: (node: DeptRow) => boolean,
): DeptRow[] {
  return nodes.reduce<DeptRow[]>((acc, node) => {
    const filteredChildren = node.children ? filterTree(node.children, predicate) : []
    const selfMatches = predicate(node)

    if (selfMatches || filteredChildren.length > 0) {
      acc.push({
        ...node,
        children: filteredChildren.length > 0 ? filteredChildren : undefined,
      })
    }
    return acc
  }, [])
}

// ---------------------------------------------------------------------------
// API functions
// ---------------------------------------------------------------------------

export async function fetchDeptTypes(): Promise<LabelValue[]> {
  await wait(400)
  return [
    { label: '研发', value: 1 },
    { label: '产品', value: 2 },
    { label: '设计/测试', value: 3 },
    { label: '运营', value: 4 },
    { label: '市场', value: 5 },
    { label: '行政/职能', value: 6 },
  ]
}

export async function fetchStatusOptions(): Promise<LabelValue[]> {
  await wait(300)
  return [
    { label: '启用', value: 1 },
    { label: '停用', value: 0 },
  ]
}

export async function queryDepts(params: DeptQueryParams): Promise<DeptQueryResult> {
  await wait(500)

  const { name, types, status } = params
  const hasTypeFilter = Array.isArray(types) && types.length > 0

  const noFilter = !name && !hasTypeFilter && status === undefined
  if (noFilter) return { list: DEPT_TREE }

  const list = filterTree(DEPT_TREE, (node) => {
    if (name && !node.name.includes(name)) return false
    if (hasTypeFilter && !types!.includes(node.type)) return false
    if (status !== undefined && node.status !== status) return false
    return true
  })

  return { list }
}
