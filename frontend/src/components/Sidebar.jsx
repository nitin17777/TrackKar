import React from 'react';

const Sidebar = ({ team }) => {
  return (
    <aside className="w-64 bg-white border-r p-6 shadow-md">
      <h2 className="font-bold text-lg mb-4">Team Members</h2>
      <ul>
        {team?.members?.map((member) => (
          <li
            key={member.memberId}
            className="mb-2 p-2 rounded hover:bg-blue-50 transition-all duration-200"
          >
            {member.nickname}
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
