/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import './index.css'

const Index = (props) => {
  const {
    columns, dataSource = [], rowKey = '',
    maxHeight = '500px',
  } = props

  const [tableData, setTableData] = useState([])
  const [hideKey, setHideKey] = useState([])
  const [merges, setMerges] = useState({})
  const [copyColumns, setCopyColumns] = useState([])
  const [copyCurrentData, setCopyCurrentData] = useState([])
  const [summation, setSummation] = useState({})

  const toFixedObj = {}
  const filters = []
  const rates = {}
  const averages = []
  columns.forEach((c) => {
    toFixedObj[c.dataIndex] = c.toFixed || 0
    c.filter && filters.push(c.dataIndex)
    c.average && averages.push(c.dataIndex)
    if (c.rate) {
      rates[c.dataIndex] = c.rate
    }
  })

  const keyMap = {}
  filters.forEach((k, index) => {
    const s = filters.slice(0, index + 1).join('&')
    keyMap[k] = s
  })

  // v 表格数据，keys，要显示的filters数组
  const getMerges = (v, keys) => { // 获取每个字段要合并的个数
    const mergesObj = {}

    v.forEach((item) => {
      const needDel = []
      keys.forEach((k) => {
        const routeArr = keyMap[k].split('&')
        let rK = ''
        routeArr.forEach((r) => {
          rK += `${item[r]}&`
        })
        if (!mergesObj[rK]) {
          mergesObj[rK] = 1
        } else {
          mergesObj[rK]++
          needDel.push(k)
        }
      })

      needDel.forEach((k) => {
        delete item[k]
      })
    })
    setMerges(mergesObj)
    setTableData(v)
  }

  const getSummation = () => {
    const obj = {}
    columns.forEach((c) => {
      if (!filters.includes(c.dataIndex)) {
        obj[c.dataIndex] = 0
      }
    })
    dataSource.forEach((d) => {
      for (const c in obj) {
        obj[c] += d[c] * 1
      }
    })
    for (const key in obj) {
      if (averages.includes(key)) { // 如果是平均数
        obj[key] = (obj[key] / dataSource.length).toFixed(toFixedObj[key])
      }
    }
    setSummation(obj)
  }

  useEffect(() => {
    const copyData = JSON.parse(JSON.stringify(dataSource))
    setCopyColumns(JSON.parse(JSON.stringify(columns)))
    getMerges(copyData, filters)
    setCopyCurrentData(dataSource)
    getSummation()
  }, [dataSource])

  useEffect(() => {
    const tableCont = document.querySelector('#tree-table-content')
    tableCont.addEventListener('scroll', (e) => {
      const scrollTop = e.target.scrollTop
      document.querySelector('#tree-table-thead').style.transform = `translateY(${scrollTop}px)`
    })
  }, [])

  const showAll = () => {
    const copyData = JSON.parse(JSON.stringify(dataSource))
    setCopyColumns(JSON.parse(JSON.stringify(columns)))
    getMerges(copyData, filters)
    setCopyCurrentData(dataSource)
    setHideKey([])
  }

  const packupFilter = (key) => { // 要显示到哪一级
    const keys = filters.slice(0, filters.indexOf(key) + 1) // 拿到要显示的几个项，如key是kpi2，数组为[kpi1,kpi2]
    const delKeys = filters.slice(filters.indexOf(key) + 1, filters.length) // 需要收起的

    const cs = JSON.parse(JSON.stringify(copyColumns))
    for (let j = 0; j < cs.length; j++) {
      if (delKeys.includes(cs[j].dataIndex)) {
        cs.splice(j, 1)
        j--
      }
    }

    const d = JSON.parse(JSON.stringify(dataSource))
    const obj = {}
    const routeArr = keyMap[key].split('&')

    const total = {} // 记录当前行数据是几行的总和
    for (let i = 0; i < d.length; i++) {
      const item = d[i]
      let rK = ''
      routeArr.forEach((r) => {
        rK += `${item[r]}&`
      })

      if (!obj[rK]) {
        obj[rK] = item
        total[rK] = 1
      } else {
        for (const k in item) {
          if (!filters.includes(k) && k !== rowKey) {
            obj[rK][k] *= 1
            obj[rK][k] += item[k] * 1
          }
        }
        total[rK]++
        d.splice(i, 1)
        i--
      }
    }

    const v = Object.values(obj)
    v.forEach((j) => {
      let rK = ''
      routeArr.forEach((r) => {
        rK += `${j[r]}&`
      })
      for (const k in j) {
        if (averages.includes(k)) { // 计算平均值
          j[k] = (j[k] / total[rK]).toFixed(toFixedObj[k])
        }
      }
    })

    setCopyCurrentData(v)
    setCopyColumns(cs)
    setHideKey(delKeys)
    getMerges(JSON.parse(JSON.stringify(v)), keys)
  }

  const getRowSpan = (index, key) => {
    const row = copyCurrentData[index]
    const routeArr = keyMap[key].split('&')
    let route = ''
    routeArr.forEach((r) => {
      if (row[r]) {
        route += `${row[r]}&`
      }
    })
    return merges[route] || ''
  }

  const transformValue = (row, key) => {
    const value = (row[key] * 1).toFixed(toFixedObj[key])
    if (rates[key]) {
      if (row[rates[key].numerator] * 1 === 0.00 || row[rates[key].denominator] * 1 === 0.00) {
        return '0.00%'
      }
      return `${(((row[rates[key].numerator] * 1) / (row[rates[key].denominator] * 1)) * 100).toFixed(toFixedObj[key])}%`
    }
    if (`${value}` === 'NaN') {
      return 0
    }
    return value
  }
  return (
    <div id="tree-table-content" style={{ maxHeight: maxHeight, overflowY: 'auto' }}>
      <table className="table" style={{ width: '100%' }}>
        <thead id="tree-table-thead">
          <tr>
            {
            copyColumns.map((head, index) => (
             filters.includes(head.dataIndex) && index !== filters.length - 1 ?
               <th key={head.dataIndex}>
                 {head.title}
                 {
                    hideKey.includes(filters[filters.indexOf(head.dataIndex) + 1]) ?
                      <span onClick={() => showAll()}><i className="operate">+</i></span>
                    : <span onClick={() => packupFilter(head.dataIndex)}><i className="operate">-</i></span>
                  }
               </th>
              :
               <th key={head.dataIndex}>{head.title}</th>
          ))
        }
          </tr>
        </thead>
        <tbody>
          {
          tableData.map((d, index) => (
            <tr key={d[rowKey]}>
              {
              copyColumns.map(head => (
              // eslint-disable-next-line no-prototype-builtins
              d.hasOwnProperty(head.dataIndex) &&
              <td rowSpan={filters.includes(head.dataIndex) ? getRowSpan(index, head.dataIndex) : ''} key={head.dataIndex}>
                {filters.includes(head.dataIndex) ? d[head.dataIndex] : transformValue(d, head.dataIndex)}
              </td>
          ))
           }
            </tr>
        ))
      }
          <tr>
            <td colSpan={filters.length - hideKey.length}>总计：</td>
            {
          copyColumns.map(head => (
            !filters.includes(head.dataIndex) &&
            <td key={head.dataIndex}>{transformValue(summation, head.dataIndex)}</td>
          ))
        }
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Index
