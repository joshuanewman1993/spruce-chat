import { db, getUserGroups } from "../db/db";

import axios from "axios";

export async function refreshGroups(userId) {
  try {
    const response = await axios.get(`http://localhost:4000/groups`, {
      params: { userId },
    });
    await db.groups.clear();
    await db.groups.bulkPut(response.data);
  } catch (err) {
    console.error("Failed to fetch", err);
  }
}

export async function refreshUserGroups(userId) {
  try {
    const response = await axios.get(`http://localhost:4000/groups/${userId}`);
    await db.userGroups.clear();
    const userGroupLinks = response.data.map((group) => ({
      userId,
      groupId: group.id,
      name: group.name,
      status: "joined",
    }));
    await db.userGroups.bulkPut(userGroupLinks);
  } catch (err) {
    console.error("Failed to fetch", err);
  }
}

export async function refreshMessages(userId) {
  try {
    const userGroups = await getUserGroups(userId);
    console.log("calling refresh messages", userGroups);

    await db.messages.clear();

    if (!userGroups || userGroups.length === 0) {
      console.log("No user groups found");
      return;
    }

    for (const group of userGroups) {
      const res = await axios.get(
        `http://localhost:4000/groups/${group.groupId}/messages`
      );

      const transformedMessages = res.data.map((msg) => {
        const { group_id, user_id, ...rest } = msg;
        return {
          ...rest,
          groupId: group_id,
          userId: user_id,
        };
      });

      await db.messages.bulkPut(transformedMessages);
    }
  } catch (err) {
    console.error("Failed fetching messages", err);
  }
}
