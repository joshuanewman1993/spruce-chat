import React, { useState } from "react";

export default function GroupItem({
  group,
  add = false,
  onSelectGroup,
  onStatusChange,
}) {
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async () => {
    setLoading(true);
    try {
      const action = add ? "joined" : "left";
      await onStatusChange(group, action);
    } catch (err) {
      console.log("Failed to update group status", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (!add && onSelectGroup) {
      onSelectGroup(group);
    }
  };

  return (
    <li
      className="border p-4 mb-2 rounded flex justify-between items-center cursor-pointer hover:bg-gray-100"
      onClick={handleClick}
    >
      <span className="text-lg font-semibold">{group.name}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleStatusChange();
        }}
        disabled={loading}
        className={`text-xl font-bold ${
          add ? "text-green-600" : "text-red-600"
        }`}
        aria-label={`${add ? "Join" : "Leave"} group ${group.name}`}
      >
        {add ? "Join" : "Leave"}
      </button>
    </li>
  );
}
