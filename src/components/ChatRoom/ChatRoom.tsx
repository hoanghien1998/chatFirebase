import { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { formatRelative } from "date-fns";
import React from "react";
import defaultAvatar from "../../../public/big-default-avatar.png";
import { IMessageChat } from "models/chat/type";

const ChatRoom = (props: any) => {
  // constants
  const db = props.db;
  const ref = React.useRef<null | HTMLElement>(null);
  //   get user details
  const { uid, displayName, photoURL } = props.user;

  // initial states
  const [messages, setMessages] = useState<IMessageChat[] | []>([]);
  const [newMessage, setNewMessage] = useState("");
  // console.log("messages", messages);

  // automatically check db for new messages
  useEffect(() => {
    db.collection("messages")
      .orderBy("createdAt")
      .limit(100)
      .onSnapshot((querySnapShot: { docs: any[] }) => {
        // get all documents from collection with id
        const data = querySnapShot.docs.map(
          (doc: { data: () => any; id: any }) => ({
            ...doc.data(),
            id: doc.id,
          })
        );

        //   update state
        setMessages(data);
      });
  }, [db]);

  // when form is submitted
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    db.collection("messages").add({
      text: newMessage,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      displayName,
      photoURL,
    });

    setNewMessage("");

    // scroll down the chat
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main id="chat_room">
      <ul className="list">
        {messages.map((message) => (
          <li
            key={message.id}
            className={message.uid === uid ? "sent" : "received"}
          >
            <section>
              {/* display user image */}
              {message.photoURL ? (
                <img
                  src={message.photoURL || '/public/big-default-avatar.png'}
                  alt="Avatar"
                  width={45}
                  height={45}
                />
              ) : null}
            </section>

            <section>
              {/* display message text */}
              <p>{message.text}</p>

              {/* display user name */}
              {message.displayName ? <span>{message.displayName}</span> : null}
              <br />
              {/* display message date and time */}
              {message.createdAt?.seconds ? (
                <span>
                  {formatRelative(
                    new Date(message.createdAt.seconds * 1000),
                    new Date()
                  )}
                </span>
              ) : null}
            </section>
          </li>
        ))}
      </ul>

      {/* extra space to scroll the page when a new message is sent */}
      <section ref={ref}></section>

      {/* input form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here..."
        />

        <button type="submit" disabled={!newMessage}>
          Send
        </button>
      </form>
    </main>
  );
};
export default ChatRoom;
