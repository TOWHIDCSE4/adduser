const roleKey = {
  root: 'root',
  ministry: 'ministry',
  lecturers: 'lecturers'
}
export const documentStatus = {
  1: 'Approve',
  2: 'To Be Reviewed',
  3: 'Rejected',
  4: 'Pendding',
  5: 'Cancelled',
  6: 'Submitted',
  7: 'Draft'
}
const numberInMonth = {
  "01": 31,
  "02": 28,
  "03": 31,
  "04": 30,
  "05": 31,
  "06": 30,
  "07": 31,
  "08": 31,
  "09": 30,
  "10": 31,
  "11": 30,
  "12": 31
}

const numberInMonthProfit = {
  "01": 31,
  "02": 29,
  "03": 31,
  "04": 30,
  "05": 31,
  "06": 30,
  "07": 31,
  '08': 31,
  "09": 30,
  "10": 31,
  '11': 30,
  "12": 31
}

const default_premission = {
  users: 15,
  roles: 15,
  dashboard: 4,
  // tenants: 31,
  // overView: 15,
  // documentTemplates: 15,
  // documents: 15
}

export default {
  roleKey, numberInMonth, numberInMonthProfit,documentStatus,default_premission
}

