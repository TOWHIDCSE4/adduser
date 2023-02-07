
exports.seed = function (knex, Promise) {
  const data = [
    {
      "id": "1",
      "roleId": "1",
      "permissionId": "1",
      "value": "31",
      "key": "root",
    },
    {
      "id": "2",
      "roleId": "2",
      "permissionId": "2",
      "value": "15",
      "key": "users",
    },
    {
      "id": "3",
      "roleId": "2",
      "permissionId": "3",
      "value": "15",
      "key": "roles",
    },
    {
      "id": "4",
      "roleId": "2",
      "permissionId": "4",
      "value": "4",
      "key": "dashboard",
    },
    {
      "id": "5",
      "roleId": "2",
      "permissionId": "5",
      "value": "31",
      "key": "tenants",
    },
    {
      "id": "6",
      "roleId": "2",
      "permissionId": "6",
      "value": "4",
      "key": "overView",
    },
    {
      "id": "7",
      "roleId": "2",
      "permissionId": "7",
      "value": "4",
      "key": "documentTemplates",
    },
    {
      "id": "8",
      "roleId": "2",
      "permissionId": "8",
      "value": "4",
      "key": "documents",
    }
  ]

  // Deletes ALL existing entries
  return knex('role_permissions').del()
    .then(async () => {
      // Inserts seed entries
      await knex('role_permissions').insert(data);
      await knex.raw('select setval(\'role_permissions_id_seq\', max(id)) from role_permissions');
    });
};
