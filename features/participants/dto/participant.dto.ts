export type ParticipantDTO = {
  userId: string;
  firstName: string;
  lastName: string;
  hasBall: boolean;
  isPaid: boolean;
  joinedAt: string;
  slotType: "main" | "reserve";
};