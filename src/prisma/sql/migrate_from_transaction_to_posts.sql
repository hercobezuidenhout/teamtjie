INSERT INTO "Post" ("issuedById", "issuedToId", "description", "type", "createdAt", "updatedAt", "scopeId", "referenceId")
SELECT "issuedById", "issuedToId", "description", 'FINE', "createdAt", "updatedAt", "scopeId", "id"
FROM "Fine";

INSERT INTO "Post"("issuedById", "description", "type", "createdAt", "updatedAt", "scopeId", "referenceId")
SELECT "F"."issuedById", "P"."description", 'PAYMENT', "P"."createdAt", "P"."updatedAt", "F"."scopeId", "P"."id"
FROM "Payment" "P"
INNER JOIN "Fine" "F"
ON "P"."fineId" = "F"."id";

INSERT INTO "Post"("issuedById", "issuedToId", "description", "type", "createdAt", "updatedAt", "scopeId", "referenceId")
SELECT "issuedById", "issuedToId", "description", 'WIN', "createdAt", "updatedAt", "scopeId", "id"
FROM "Win";

INSERT INTO "PostValue" ("postId", "scopeValueId")
SELECT "P"."id", "F"."scopeValueId"
FROM "FineScopeValue" "F"
INNER JOIN "Post" "P"
	ON "F"."fineId" = "P"."referenceId";

INSERT INTO "PostValue" ("postId", "scopeValueId")
SELECT "P"."id", "W"."scopeValueId"
FROM "WinScopeValue" "W"
INNER JOIN "Post" "P"
	ON "W"."winId" = "P"."referenceId";

-- Insert all fine reviews
INSERT INTO "PostReaction" ("postId", "userId", "reaction", "createdAt")
SELECT "P"."id", "R"."userId", "R"."reaction", "R"."createdAt"
FROM "Reaction" "R"
INNER JOIN "Transaction" "T"
ON "R"."transactionId" = "T"."id"
INNER JOIN "Fine" "F"
ON "T"."id" = "F"."id"
INNER JOIN "Post" "P"
ON "F"."id" = "P"."referenceId"
WHERE "T"."type" = 'FINE';

-- Insert all win reviews
INSERT INTO "PostReaction" ("postId", "userId", "reaction", "createdAt")
SELECT "P"."id", "R"."userId", "R"."reaction", "R"."createdAt"
FROM "Reaction" "R"
INNER JOIN "Transaction" "T"
ON "R"."transactionId" = "T"."id"
INNER JOIN "Win" "W"
ON "T"."id" = "W"."id"
INNER JOIN "Post" "P"
ON "W"."id" = "P"."referenceId"
WHERE "T"."type" = 'WIN';

-- Insert all payment reviews
INSERT INTO "PostReaction" ("postId", "userId", "reaction", "createdAt")
SELECT "P"."id", "R"."userId", "R"."reaction", "R"."createdAt"
FROM "Reaction" "R"
INNER JOIN "Transaction" "T"
ON "R"."transactionId" = "T"."id"
INNER JOIN "Payment" "PA"
ON "T"."id" = "PA"."id"
INNER JOIN "Post" "P"
ON "PA"."id" = "P"."referenceId"
WHERE "T"."type" = 'PAYMENT';

SELECT * FROM "Post";
SELECT * FROM "PostValue";
SELECT * FROM "PostReaction";