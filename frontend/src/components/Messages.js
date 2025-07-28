import React, { useState } from "react";

import { addToActionQueue } from "../hooks/useQueueAction";
import { db } from "../db/db";
import { useLiveQuery } from "dexie-react-hooks";

const Messages = ({ group, userId }) => {
  const { groupId, name } = group || {};
  const [newMessage, setNewMessage] = useState("");

  const rawMessages = useLiveQuery(
    () =>
      groupId ? db.messages.where("groupId").equals(groupId).toArray() : [],
    [groupId]
  );

  const sortedMessages =
    rawMessages &&
    rawMessages.sort((a, b) => new Date(a.delivered) - new Date(b.delivered));

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    await db.messages.add({
      groupId: groupId,
      userId: userId,
      content: newMessage.trim(),
    });

    await addToActionQueue("sendMessage", {
      message: { content: newMessage.trim(), groupId },
      userId: userId,
    });

    setNewMessage("");
  };

  if (!groupId) {
    return (
      <div className="p-4 text-gray-500">Select a group to view messages</div>
    );
  }

  return (
    <div className="flex flex-col h-full border rounded shadow p-4">
      <h2 className="text-xl font-bold mb-2">Group: {name}</h2>
      <div className="flex-1 overflow-y-auto mb-4">
        {!sortedMessages || !sortedMessages.length ? (
          <p className="text-gray-500">No messages yet.</p>
        ) : (
          sortedMessages.map((msg) => (
            <div key={msg.id} className="mb-2">
              <strong>User {msg.user_id}:</strong> {msg.content}
              <div className="text-xs text-gray-400">
                {msg.delivered ? new Date(msg.delivered).toLocaleString() : ""}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message"
          className="flex-1 border rounded px-3 py-2"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 text-white px-4 rounded disabled:opacity-50"
          disabled={!newMessage.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Messages;
