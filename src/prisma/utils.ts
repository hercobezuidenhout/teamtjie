type Reaction = { user: { id: string; name: string; }; } & {
  transactionId: number;
  userId: string;
  reaction: string;
  createdAt: Date;
};

type PostReaction = { user: { id: string; name: string; }; } & {
  postId: number;
  userId: string;
  reaction: string;
  createdAt: Date;
};

export interface ReactionDto {
  emoji: string;
  createdAt: Date;
  users: { id: string; name: string; }[];
}

export const mapReactionsToDto = (input: Reaction[]) => {
  const result: ReactionDto[] = [];
  for (const item of input) {
    const { user, reaction: emoji, createdAt } = item;

    const existingEntry = result.find((item) => item.emoji === emoji);

    if (!existingEntry) {
      result.push({ emoji, createdAt, users: [user] });
      continue;
    }

    existingEntry.users.push(user);
  }

  return result;
};

export const mapPostReactionsToDto = (input: PostReaction[]) => {
  const result: ReactionDto[] = [];
  for (const item of input) {
    const { user, reaction: emoji, createdAt } = item;

    const existingEntry = result.find((item) => item.emoji === emoji);

    if (!existingEntry) {
      result.push({ emoji, createdAt, users: [user] });
      continue;
    }

    existingEntry.users.push(user);
  }

  return result;
};
