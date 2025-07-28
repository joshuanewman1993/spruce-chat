import GroupItem from "../GroupItem";
import React from "react";

const AvailableGroups = ({ groups = [], userId, onSelectGroup, onStatusChange }) => {
  if (!groups.length) return <p>No groups found.</p>;

  return (
    <ul>
      {groups.map((group) => (
        <GroupItem
          key={group.id}
          group={group}
          userId={userId}
          add={true}
          onSelectGroup={onSelectGroup}
          onStatusChange={onStatusChange}
        />
      ))}
    </ul>
  );
};

export default AvailableGroups;
