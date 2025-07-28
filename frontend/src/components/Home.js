import React, { useState } from "react";

import AvailableGroups from "./Tabs/AvailableGroups";
import Messages from "./Messages";
import YourGroups from "./Tabs/YourGroups";
import { addToActionQueue } from "../hooks/useQueueAction";
import { db } from "../db/db";
import { updateUserGroupStatus } from "../hooks/useGroupAction";
import { useLiveQuery } from "dexie-react-hooks";

export default function Home({ userId }) {
  const [activeTab, setActiveTab] = useState("yourgroups");
  const [selectedGroup, setSelectedGroup] = useState(null);

  const yourGroups = useLiveQuery(() => db.userGroups.toArray(), []);
  const allGroups = useLiveQuery(() => db.groups.toArray(), []);

  // filter out groups that are already joined
  const availableGroups =
    allGroups && yourGroups
      ? allGroups.filter(
          (group) =>
            !yourGroups.some(
              (userGroup) =>
                userGroup.groupId === group.id && userGroup.status === "joined"
            )
        )
      : [];

  const handleGroupStatusChange = async (group, action) => {
    if (action === "left" && selectedGroup?.id === group.id) {
      setSelectedGroup(null);
    }

    try {
      const groupId = group.id ?? group.groupId; // fallback if groupId is used
      await updateUserGroupStatus(userId, groupId, action, group.name);
      await addToActionQueue(action === "joined" ? "joinGroup" : "leaveGroup", {
        group,
        userId,
      });
    } catch (err) {
      console.error(
        `Failed to ${action === "joined" ? "join" : "leave"} group`,
        err
      );
    }
  };

  const tabs = [
    {
      id: "yourgroups",
      label: "Your Groups",
      content: (
        <YourGroups
          groups={yourGroups?.filter((g) => g.status === "joined") || []}
          userId={userId}
          onSelectGroup={setSelectedGroup}
          onStatusChange={handleGroupStatusChange}

        />
      ),
    },
    {
      id: "availablegroups",
      label: "Available Groups",
      content: (
        <AvailableGroups
          groups={availableGroups}
          userId={userId}
          onSelectGroup={setSelectedGroup}
          onStatusChange={handleGroupStatusChange}
        />
      ),
    },
  ];

  const currentTab = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="flex h-screen">
      {/* Left tabs */}
      <div className="w-60 bg-gray-100 p-4">
        <div className="flex flex-col space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSelectedGroup(null);
              }}
              className={`text-left px-4 py-2 rounded-md ${
                activeTab === tab.id
                  ? "bg-blue-500 text-white"
                  : "bg-white hover:bg-gray-200 text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Middle tab content */}
      <div className="w-1/2 p-6 bg-white border-r">
        <h2 className="text-2xl font-bold mb-4">{currentTab.label}</h2>
        <div>{currentTab.content}</div>
      </div>

      {/* Right panel for messages */}
      <div className="flex-1 p-6 bg-gray-50">
        {activeTab === "yourgroups" ? (
          selectedGroup ? (
            <Messages group={selectedGroup} userId={userId} />
          ) : (
            <div className="text-gray-500">
              Select a group to view messages!
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}
