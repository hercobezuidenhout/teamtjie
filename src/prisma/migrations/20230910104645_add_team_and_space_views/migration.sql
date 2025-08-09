-- This is an empty migration.
drop view if exists "SpaceEvent";
drop view if exists "SpaceInvitation";
drop view if exists "SpaceRole";
drop view if exists "Space";
drop view if exists "TeamEvent";
drop view if exists "TeamInvitation";
drop view if exists "TeamRole";
drop view if exists "Team";

create view
	"Space" as
select
	"id",
	"name",
	"image",
	"createdAt",
	"updatedAt"
from
	"Scope"
where
	"parentScopeId" is null;

create view
	"Team" as
select
	"id",
	"name",
	"image",
	"createdAt",
	"updatedAt",
	"parentScopeId" as "spaceId"
from
	"Scope"
where
	"parentScopeId" is not null;

create view
	"SpaceRole" as
select
	"role",
	"userId",
	"scopeId" as "spaceId"
from
	"ScopeRole"
inner join
	"Space"
on
	"ScopeRole"."scopeId" = "Space"."id";

create view
	"TeamRole" as
select
	"role",
	"userId",
	"scopeId" as "teamId"
from
	"ScopeRole"
inner join
	"Team"
on
	"ScopeRole"."scopeId" = "Team"."id";

create view
	"SpaceEvent" as
select
	"Event"."id" as "eventId",
	"Event"."scopeId" as "spaceId"
from
	"Event"
inner join
	"Space"
on
	"Event"."scopeId" = "Space"."id";

create view
	"TeamEvent" as
select
	"Event"."id" as "eventId",
	"Event"."scopeId" as "teamId"
from
	"Event"
inner join
	"Team"
on
	"Event"."scopeId" = "Team"."id";

create view
	"SpaceInvitation" as
select
	"Invitation"."id" as "invitationId",
	"Invitation"."scopeId" as "spaceId"
from
	"Invitation"
inner join
	"Space"
on
	"Invitation"."scopeId" = "Space"."id";

create view
	"TeamInvitation" as
select
	"Invitation"."id" as "invitationId",
	"Invitation"."scopeId" as "teamId"
from
	"Invitation"
inner join
	"Team"
on
	"Invitation"."scopeId" = "Team"."id";