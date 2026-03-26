import 'dotenv/config';
import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import { goals } from '../src/lib/schema';

const db = drizzle(sql);

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await db.delete(goals);

  // Insert strategy goals (fixed company-level content)
  const [mission] = await db.insert(goals).values({
    level: 'mission',
    name: 'Make sure the future is good with powerful AI.',
    status: 'n_a',
    sortOrder: 1,
  }).returning();

  const [whyStrategy] = await db.insert(goals).values({
    level: 'why_this_strategy',
    name: 'Only companies on the frontier get to steer the trajectory of AI.',
    parentId: mission.id,
    status: 'n_a',
    sortOrder: 2,
  }).returning();

  const [strategicPosition] = await db.insert(goals).values({
    level: 'strategic_position',
    name: 'Be on the frontier by solving the frontier lab\'s problems better than anyone else.',
    parentId: whyStrategy.id,
    status: 'n_a',
    sortOrder: 3,
  }).returning();

  // Strategic Pillars
  const [pillar1] = await db.insert(goals).values({
    level: 'strategic_pillar',
    name: 'Meet contractual delivery dates for compute in 2026.',
    parentId: strategicPosition.id,
    owner: 'James Dugan',
    team: 'Program Delivery',
    targetDate: '2026-12-31',
    status: 'at_risk',
    sortOrder: 4,
  }).returning();

  const [pillar2] = await db.insert(goals).values({
    level: 'strategic_pillar',
    name: 'Scale – Deliver 10GW of compute in 2027.',
    parentId: strategicPosition.id,
    targetDate: '2028-12-01',
    status: 'not_started',
    sortOrder: 5,
  }).returning();

  const [pillar3] = await db.insert(goals).values({
    level: 'strategic_pillar',
    name: 'Speed – Decrease time from signature to RFS to 6 months for a 190MW building.',
    parentId: strategicPosition.id,
    targetDate: '2026-05-01',
    status: 'on_track',
    sortOrder: 6,
  }).returning();

  // Team Goals
  await db.insert(goals).values([
    {
      level: 'team_goal',
      name: 'Build a L3 schedule that shows us how we can get to a 6mo schedule.',
      parentId: pillar3.id,
      owner: 'Gun',
      team: 'Program Delivery',
      targetDate: '2026-03-15',
      status: 'on_track',
      sortOrder: 7,
    },
    {
      level: 'team_goal',
      name: 'Build all key processes and systems into Kaiser.',
      parentId: pillar1.id,
      owner: 'Jeff',
      team: 'Product',
      targetDate: '2026-04-01',
      status: 'behind',
      sortOrder: 8,
    },
    {
      level: 'team_goal',
      name: 'Build strategic partnerships with people who can lock in supply for us for equipment.',
      parentId: pillar2.id,
      team: 'Supply Chain',
      status: 'not_started',
      sortOrder: 9,
    },
    {
      level: 'team_goal',
      name: 'Create a reference design that allows us to build in 6 months from customer signature to RFS.',
      parentId: pillar3.id,
      owner: 'James Dugan',
      team: 'DC Design',
      targetDate: '2026-05-01',
      status: 'on_track',
      sortOrder: 10,
    },
    {
      level: 'team_goal',
      name: 'Create supply and demand curves for all equipment, components, and material, that goes into a datacenter to see bottlenecks and figure out how to solve.',
      parentId: pillar1.id,
      team: 'Supply Chain',
      status: 'not_started',
      sortOrder: 11,
    },
    {
      level: 'team_goal',
      name: 'Create supply and demand curves for every labor pool that goes into a datacenter to see bottlenecks.',
      parentId: pillar1.id,
      team: 'Labor',
      status: 'not_started',
      sortOrder: 12,
    },
    {
      level: 'team_goal',
      name: 'Sign 14GW of demand for 2027.',
      parentId: pillar2.id,
      owner: 'Gary',
      team: 'Sales',
      status: 'not_started',
      sortOrder: 13,
    },
  ]);

  console.log('Seed complete!');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
