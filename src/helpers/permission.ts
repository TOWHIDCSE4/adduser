
const charToNum = {A: 16, C: 8, R: 4, U: 2, D: 1 }
const crudToDec = (text: any) => {
  return text.toUpperCase().split("").reduce((total: number, char: 'A' | 'C' | 'R' | 'U' | 'D') => total + charToNum[char], 0)
}
const decToCrud = (dec: number) => {
  let result = "";
  let char: 'A' | 'C' | 'R' | 'U' | 'D' 
  for (char in charToNum) {
    if ((dec & charToNum[char]) == charToNum[char]) result += char
  }
  return result
}

const hasPermission = (requirePermission: number, userPermission: number) => {
  return (userPermission & requirePermission) === requirePermission
}

const checkPermission = (permissions: any, userPermissions: any, showError: boolean = false) => {
  if (!permissions) return true
  for (let permission in permissions) {
    const requirePermission = crudToDec(permissions[permission]);
    const rootPermission = userPermissions["root"] || 0
    let userPermission = userPermissions[permission] || 0
    userPermission = userPermission | rootPermission
    // console.log(userPermission, rootPermission)
    if (!hasPermission(requirePermission, userPermission)) {
      if (!showError) return false;
      return {
        error: true,
        permission: permission,
        requirePermission: decToCrud(requirePermission),
        userPermission: decToCrud(userPermission)
      }
    }
  }
  return true;
}

export {
  checkPermission,
  hasPermission,
  crudToDec,
  decToCrud
}
