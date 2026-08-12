import prisma from "./lib/prisma";

async function main() {
  console.log("🌱 Seeding FixIt Home Services Database...");

  // 1. Create Categories
  const plumbingCat = await prisma.category.upsert({
    where: { name: "Plumbing" },
    update: {},
    create: {
      name: "Plumbing",
      image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=500",
    },
  });

  const electricalCat = await prisma.category.upsert({
    where: { name: "Electrical" },
    update: {},
    create: {
      name: "Electrical",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500",
    },
  });

  const cleaningCat = await prisma.category.upsert({
    where: { name: "Cleaning" },
    update: {},
    create: {
      name: "Cleaning",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500",
    },
  });

  const acCat = await prisma.category.upsert({
    where: { name: "AC & Appliance Repair" },
    update: {},
    create: {
      name: "AC & Appliance Repair",
      image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500",
    },
  });

  // 2. Create Initial Services
  await prisma.service.createMany({
    data: [
      {
        title: "Emergency Pipe Leak Repair",
        description: "Fast response pipe leakage repair, faucet installation, and water pressure troubleshooting by certified plumbers.",
        price: 89.00,
        duration: 45,
        categoryId: plumbingCat.id,
      },
      {
        title: "Full House Deep Cleaning",
        description: "Complete room sanitization, floor scrubbing, kitchen degreasing, and bathroom deep stain removal.",
        price: 149.00,
        duration: 180,
        categoryId: cleaningCat.id,
      },
      {
        title: "AC Servicing & Gas Refill",
        description: "Filter cleaning, cooling coil wash, gas leak detection, and refrigerant refill for all AC brands.",
        price: 79.00,
        duration: 60,
        categoryId: acCat.id,
      },
      {
        title: "Electrical Wiring & Breaker Repair",
        description: "Professional electrical diagnosis, short-circuit fixing, light fitting, and circuit breaker replacement.",
        price: 95.00,
        duration: 60,
        categoryId: electricalCat.id,
      },
      {
        title: "Drain Unclogging & Jetting",
        description: "High-pressure water jetting and motorized drain cleaning for stubborn kitchen and bathroom blockages.",
        price: 110.00,
        duration: 60,
        categoryId: plumbingCat.id,
      },
      {
        title: "Ceiling Fan & Chandelier Fitting",
        description: "Safe heavy light fixture mounting, ceiling fan installation, and wall switch wiring.",
        price: 65.00,
        duration: 40,
        categoryId: electricalCat.id,
      },
    ],
  });

  console.log("✅ FixIt Database Seeded Successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
