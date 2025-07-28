import { db } from "../db/db";

export const updateUserGroupStatus = async (userId, groupId, status, name) => {
  if (!userId || !groupId) return;

  try {
    await db.userGroups.put({
      userId,
      groupId,
      status,
      name,
    });
  } catch (error) {
    console.error("Failed to update user group status", error);
  }
};
