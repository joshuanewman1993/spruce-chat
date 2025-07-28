import GroupItem from "../GroupItem";
import React from "react";

const YourGroups = ({ groups = [], userId, onSelectGroup, onStatusChange }) => {
  if (!groups.length) return <p>No groups found.</p>;

  return (
    <ul>
      {groups.map((group) => (
        <GroupItem
          key={group.id}
          group={group}
          userId={userId}
          add={false}
          onSelectGroup={onSelectGroup}
          onStatusChange={onStatusChange}
        />
      ))}
    </ul>
  );
};

export default YourGroups;
