export type Sender = {
  id: string;
  name: string;
  image: string;
};

export type MessageData = {
  id: string;
  sender?: string;
  content: string;
  createdAt: string;
  state: "sent" | "received";
};
