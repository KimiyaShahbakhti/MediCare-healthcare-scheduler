import React, { createContext, useState } from 'react';

const SchedulerContext = createContext();

const SchedulerProvider = ({ children }) => {
  const [events, setEvents] = useState();

  const updateEvents = (newEvents) => {
    setEvents(newEvents);
  }
  
  return (
    <SchedulerContext.Provider value={{ events, updateEvents }}>
      {children}
    </SchedulerContext.Provider>
  );
};

export { SchedulerContext, SchedulerProvider };
