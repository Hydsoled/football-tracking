export type DashboardEventDTO = {
  id: string;
  ownerId: string;
  stadium: string;
  startsAt: string;
  endsAt: string;
  price: number;
  ownerHasBall: boolean;
  participantCount: number;
  paidCount: number;
  unpaidCount: number;
};

export type DashboardEventRecord = {
  id: string;
  owner_id: string;
  stadium: string;
  starts_at: string;
  ends_at: string;
  price: number;
  owner_has_ball: boolean;
  participant_count: number;
  paid_count: number;
};

export function toDashboardEventDTO(
  record: DashboardEventRecord
): DashboardEventDTO {
  const participantCount = Number(record.participant_count);
  const paidCount = Number(record.paid_count);

  return {
    id: record.id,
    ownerId: record.owner_id,
    stadium: record.stadium,
    startsAt: record.starts_at,
    endsAt: record.ends_at,
    price: Number(record.price),
    ownerHasBall: record.owner_has_ball,
    participantCount,
    paidCount,
    unpaidCount: participantCount - paidCount,
  };
}