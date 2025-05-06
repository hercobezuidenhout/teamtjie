export interface GetReactionDto {
  emoji: string;
  createdAt: Date;
  users: { id: string; name: string; }[];
}
