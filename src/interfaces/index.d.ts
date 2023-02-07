interface Tenant {
  id: number;
  code: string;
  name: string;
  email: string;
  phone: number;
  address: string;
  state: string;
  others: User;
}



interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  roleId: number;
  createdAt: string;
  code: string;
  twofa: boolean;
  twofaKey: string;
  isFirst: number;
}

interface Role {
  id: number;
  name: string;
  description: string;
  parentId: number;
  key: number;
  createdAt: string;
  code: string;
  permissions: Array[];
}