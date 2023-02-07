
exports.seed = function (knex, Promise) {
  const data = [
    {
      "id": "1",
      "name": "root",
      "description": "root",
      "value": "31",
      "key": "root",
    },
    {
      "id": "2",
      "name": "users",
      "description": "users",
      "value": "15",
      "key": "users",
    },
    {
      "id": "3",
      "name": "roles",
      "description": "roles",
      "value": "15",
      "key": "roles",
    },
    {
      "id": "4",
      "name": "dashboard",
      "description": "dashboard",
      "value": "4",
      "key": "dashboard",
    },
    {
      "id": "5",
      "name": "tenants",
      "description": "tenants",
      "value": "31",
      "key": "tenants",
    },
    {
      "id": "6",
      "name": "overView",
      "description": "overView",
      "value": "4",
      "key": "overView",
    },
    {
      "id": "7",
      "name": "documentTemplates",
      "description": "documentTemplates",
      "value": "4",
      "key": "documentTemplates",
    },
    {
      "id": "8",
      "name": "documents",
      "description": "documents",
      "value": "4",
      "key": "documents",
    }
  ]

  // Deletes ALL existing entries
  return knex('permissions').del()
    .then(async () => {
      // Inserts seed entries
      await knex('permissions').insert(data);
      await knex.raw('select setval(\'permissions_id_seq\', max(id)) from permissions');
    });
};
