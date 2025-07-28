/**
 * @param { import('knex').Knex } knex
 */
exports.seed = async function(knex) {
  await knex('messages').del();
  await knex('user_groups').del();
  await knex('groups').del();
  await knex('users').del();

  const insertedUsers = await knex('users')
    .insert([
      { username: 'josh' },
      { username: 'jess' },
    ])
    .returning(['id', 'username']);

  const josh = insertedUsers.find(u => u.username === 'josh');

  const insertedGroups = await knex('groups')
    .insert([
      { name: 'Work' },
      { name: 'Friends' },
    ])
    .returning(['id', 'name']);

  const work = insertedGroups.find(g => g.name === 'Work');
  const friends = insertedGroups.find(g => g.name === 'Friends');

  await knex('user_groups').insert([
    { user_id: josh.id, group_id: work.id },
    { user_id: josh.id, group_id: friends.id },
  ]);

  await knex('messages').insert([
    {
      group_id: work.id,
      user_id: josh.id,
      content: 'Hello work!',
      delivered: new Date(),
    },
    {
      group_id: friends.id,
      user_id: josh.id,
      content: 'Hello friends!',
      delivered: new Date(),
    },
  ]);
};
