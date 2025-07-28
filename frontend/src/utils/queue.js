import axios from "axios";
import { db } from "../db/db";

export async function syncQueueItems() {
  const pendingQueueItems = await db.actionQueue
    .where("status")
    .equals("pending")
    .toArray();

  for (const item of pendingQueueItems) {
    try {
      switch (item.type) {
        case "sendMessage": {
          console.log("tem.payload", item.payload);
          const {
            message: { groupId, content },
            userId,
          } = item.payload;

          await axios.post(`http://localhost:4000/groups/messages`, {
            userId: userId,
            groupId: groupId,
            content: content,
          });
          break;
        }

        case "leaveGroup": {
          const {
            group: { groupId },
            userId,
          } = item.payload;
          await axios.post(`http://localhost:4000/groups/leave`, {
            userId: userId,
            groupId: groupId,
          });
          break;
        }

        case "joinGroup": {
          const { group, userId } = item.payload;
          await axios.post(`http://localhost:4000/groups/join`, {
            userId: userId,
            groupId: group.id,
          });
          break;
        }

        default: {
          console.log("Uknown queue action");
          break;
        }
      }

      await db.actionQueue.delete(item.id);
    } catch (error) {
      console.error(
        `Failed to sync queue item of type ${item.type}:`,
        item,
        error
      );
    }
  }
}
