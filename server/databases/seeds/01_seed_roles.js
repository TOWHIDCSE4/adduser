
exports.seed = function (knex, Promise) {
  const data = [
    {
      "id": "1",
      "name": "Root",
      "description": "Root",
      "key": "root",
      "code" : '5c5652e878449245a480bb2ded80fadd'
    },
    {
      "id": "2",
      "name": "Admin BSEZ",
      "description": "Admin_BSEZ",
      "key": "Admin_BSEZ",
      "code" : '5a52a09382ba69e234694a3d08f05688'
    },
  ]

  // Deletes ALL existing entries
  return knex('roles').del()
    .then(async () => {
      // Inserts seed entries
      await knex('roles').insert(data);
      await knex.raw('select setval(\'roles_id_seq\', max(id)) from roles');
    });
};
