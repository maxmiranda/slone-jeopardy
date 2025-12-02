import React, { useCallback, useEffect, useState } from 'react';
import { JeopardyTopBar } from '../TopBar/TopBar';
import { Jeopardy } from '../Jeopardy/Jeopardy';
import { serverPath } from '../../utils';
import { type Socket } from 'socket.io-client';

export function DisplayApp() {
  const [participants, setParticipants] = useState<User[]>([]);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [socket, setSocket] = useState<Socket | undefined>(undefined);

  useEffect(() => {
    const heartbeat = window.setInterval(
      () => {
        window.fetch(serverPath + '/ping');
      },
      10 * 60 * 1000,
    );
    return () => {
      window.clearInterval(heartbeat);
    };
  }, []);

  const updateName = useCallback(
    (name: string) => {
      // Display clients should stay spectators; still send a name for chat logs if needed.
      if (socket) {
        socket.emit('CMD:name', name);
      }
    },
    [socket],
  );

  return (
    <React.Fragment>
      <JeopardyTopBar />
      <div
        style={{
          padding: '10px',
          height: 'calc(100vh - 64px)',
          backgroundColor: '#111827',
        }}
      >
        <Jeopardy
          participants={participants}
          chat={chat}
          updateName={updateName}
          setParticipants={setParticipants}
          setSocket={setSocket}
          setScrollTimestamp={() => {}}
          setChat={setChat}
          mode="display"
        />
      </div>
    </React.Fragment>
  );
}
