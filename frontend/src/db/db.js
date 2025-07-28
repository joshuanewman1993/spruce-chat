import Dexie from "dexie";

export const db = new Dexie("App");

db.version(1).stores({
  groups: "++id, name, created_by",
  userGroups: "[userId+groupId], userId, groupId, status",
  messages: "++id, groupId, userId, content, status, delivered",
  actionQueue: "++id, type, payload, status, createdAt"
});

export const getUserGroups = async (userId) => {
  return await db.userGroups
    .where("userId")
    .equals(userId)
    .filter((link) => link.status === "joined") 
    .toArray();
};

export const hasPendingSyncItems = async () => {
  const count = await db.actionQueue.where("status").equals("pending").count();
  return count > 0;
}