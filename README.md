# 支持上卷下钻的动态表格

## 接收三个参数

 columns = [
    {
      title: '一级分类',  // 表头文案
      dataIndex: 's1',   // 字段key
      filter: true,      // 是否是筛选项
      average:true,      // 是否取平均值
      rate: {            // 是否是百分比
        numerator: 'reach',   // 分子字段key
        denominator: 'mans'   // 分母字段key
      }, 
      toFixed: 2         // 取几位小数
      },
  ]
  dataSource = [  // 表格数据
    {id: 1, s1: '北部', s2: '河北',s3: '邯郸', mans: '5000', num: '10000', average: '2', reach: '3000', rate: '0.6'},
    {id: 11, s1: '北部', s2: '河北',s3: '石家庄', mans: '4000', num: '12000', average: '3', reach: '3000', rate: '0.75'},
    {id: 2, s1: '北部', s2: '山西',s3: '太原', mans: '4000', num: '20000', average: '5', reach: '2000', rate: '0.5'},
    {id: 3, s1: '北部', s2: '北京',s3: '朝阳', mans: '8000', num: '16000', average: '2', reach: '2000', rate: '0.25'},
    {id: 4, s1: '南部', s2: '江苏',s3: '南京', mans: '6000', num: '60000', average: '10', reach: '3000', rate: '0.5'},
    {id: 5, s1: '南部', s2: '广东',s3: '广州', mans: '1000', num: '10000', average: '10', reach: '300', rate: '0.3'},
    {id: 6, s1: '南部', s2: '浙江',s3: '温州', mans: '3000', num: '30000', average: '10', reach: '600', rate: '0.2'},
    {id: 7, s1: '南部', s2: '湖南',s3: '长沙', mans: '5000', num: '15000', average: '3', reach: '200', rate: '0.04'},
    {id: 71, s1: '南部', s2: '湖南',s3: '株洲', mans: '3000', num: '15000', average: '5', reach: '1000', rate: '0.33'},
    {id: 8, s1: '西部', s2: '青海',s3: '西宁', mans: '7000', num: '7000', average: '1', reach: '700', rate: '0.1'},
    {id: 9, s1: '西部', s2: '新疆',s3: '哈密', mans: '6000', num: '12000', average: '2', reach: '300', rate: '0.05'},
    {id: 10, s1: '西部', s2: '陕西',s3: '咸阳', mans: '3000', num: '9000', average: '3', reach: '1500', rate: '0.5'},
  ]

  rowKey="id"   // 列表行循环所需唯一key