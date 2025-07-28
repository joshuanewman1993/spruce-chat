const { Pool } = require("pg");

module.exports = async function (fastify, options) {
  await fastify.register(require("@fastify/cors"), {
    origin: "http://localhost:3000",
    credentials: true,
  });

  const pool = new Pool({
    connectionString:
      "postgresql://jessicalyall:postgres@localhost:5432/chat_app",
  });

  // get all available groups (user not part of already)
  fastify.get("/groups", async (request, reply) => {
    const { userId } = request.query; 

    if (!userId) {
      return reply
        .status(400)
        .send({ error: "Missing userId in query parameters" });
    }

    try {
      const result = await pool.query(
        `
        SELECT * FROM groups
        WHERE id NOT IN (
          SELECT group_id FROM user_groups WHERE user_id = $1
        )
        `,
        [userId]
      );

      reply.send(result.rows);
    } catch (err) {
      console.error("Failed to fetch available groups:", err);
      reply.status(500).send({ error: "Internal server error" });
    }
  });

  // get all joined groups
  fastify.get("/groups/:userId", async (request, reply) => {
    const { userId } = request.params;

    try {
      const { rows: groups } = await pool.query(
        `SELECT g.*
         FROM groups g
         INNER JOIN user_groups ug ON g.id = ug.group_id
         WHERE ug.user_id = $1`,
        [userId]
      );

      reply.send(groups);
    } catch (err) {
      request.log.error(err);
      reply.code(500).send({ error: "Failed to fetch user groups" });
    }
  });

  // join a group
  fastify.post("/groups/join", async (request, reply) => {
    const { userId, groupId } = request.body;

    if (!userId) return reply.code(400).send({ error: "userId is required" });

    try {
      await pool.query(
        "INSERT INTO user_groups (user_id, group_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        [userId, groupId]
      );
      reply.code(200).send({ message: "User joined group" });
    } catch (err) {
      fastify.log.error(err);
      reply.code(500).send({ error: "Failed to join group" });
    }
  });

  // leave a group
  fastify.post("/groups/leave", async (request, reply) => {
    const { userId, groupId } = request.body;

    if (!userId) return reply.code(400).send({ error: "userId is required" });

    try {
      await pool.query(
        "DELETE FROM user_groups WHERE user_id = $1 AND group_id = $2",
        [userId, groupId]
      );
      reply.code(200).send({ message: "User left group" });
    } catch (err) {
      fastify.log.error(err);
      reply.code(500).send({ error: "Failed to leave group" });
    }
  });

  // post messages to a group
  fastify.post("/groups/messages", async (request, reply) => {
    const { userId, content, groupId } = request.body;

    if (!userId || !content || !groupId)
      return reply.code(400).send({ error: "userId and content are required" });

    try {
      const result = await pool.query(
        `INSERT INTO messages (group_id, user_id, content, delivered) 
         VALUES ($1, $2, $3, NOW()) RETURNING *`,
        [groupId, userId, content]
      );
      reply.code(201).send(result.rows[0]);
    } catch (err) {
      fastify.log.error(err);
      reply.code(500).send({ error: "Failed to send message" });
    }
  });

  // get messages for a group
  fastify.get("/groups/:groupId/messages", async (request, reply) => {
    const { groupId } = request.params;
    try {
      const result = await pool.query(
        "SELECT * FROM messages WHERE group_id = $1",
        [groupId]
      );
      reply.send(result.rows);
    } catch (err) {
      fastify.log.error(err);
      reply.code(500).send({ error: "Failed to fetch messages" });
    }
  });
};
