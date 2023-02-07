import { checkPermission } from '@src/helpers/permission'
import auth from '@src/helpers/auth'

const PermissionHook = () => {
  const { user } = auth()
  const userPermissions = user ? { ...user.permissions} : {}

  const getUserPermission = () => {
    return userPermissions
  }

  const _checkPermission = (permissions: any) => {
    return checkPermission(permissions, userPermissions)
  }
  return {
    getUserPermission,
    checkPermission: _checkPermission
  }
}

export default PermissionHook
