export type Sender = {
  id: string;
  name: string;
  image: string;
};

export type MessageData = {
  id: string;
  sender: Sender;
  content: string;
  createdAt: string;
  state: "sent" | "received";
};
