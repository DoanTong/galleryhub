import React from 'react';

const ExhibitionPage = ({ events }) => {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Web3 Exhibitions</h1>
      <ul className="space-y-4">
        {events.map((event, i) => (
          <li key={i} className="border p-4 rounded">
            <h2 className="text-lg font-semibold">{event.title}</h2>
            <p>{event.description}</p>
            <p className="text-sm text-gray-500">{event.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExhibitionPage;