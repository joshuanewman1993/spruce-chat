import { db } from "../db/db";

export const addToActionQueue = async (type, payload) => {
  if (!type || !payload) {
    console.error('missing required fields')
  }

  try {
    const action = {
      type,
      payload,
      status: "pending",
      retries: 0,
      crearedAt: new Date().toISOString(),
    };

    const actionId = await db.actionQueue.add(action);

    return actionId;
  } catch (error) {
    console.error("Error adding action", error);
  }
};
