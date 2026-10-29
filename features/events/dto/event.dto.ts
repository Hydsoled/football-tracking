export type EventDTO = {
  id: string;
  stadium: string;
  startsAt: string;
  endsAt: string;
  price: number;
  ownerHasBall: boolean;
  ownerId: string;
  mainSlots: number;
reserveSlots: number;
};

export type EventRecord = {
  id: string;
  stadium: string;
  starts_at: string;
  ends_at: string;
  price: number;
  owner_has_ball: boolean;
  owner_id: string;
  main_slots: number;
  reserve_slots: number;
};

export function toEventDTO(
  record: EventRecord
): EventDTO {
  return {
    id: record.id,
    stadium: record.stadium,
    startsAt: record.starts_at,
    endsAt: record.ends_at,
    price: Number(record.price),
    ownerHasBall: record.owner_has_ball,
    ownerId: record.owner_id,
    mainSlots: record.main_slots,
    reserveSlots: record.reserve_slots,
  };
}