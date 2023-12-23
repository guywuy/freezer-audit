import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const username = "dontworry";

  // cleanup the existing database
  await prisma.user.delete({ where: { username } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("chickencurry", 10);

  const user = await prisma.user.create({
    data: {
      username,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  // General

  await prisma.item.create({
    data: {
      title: "Cream ice cubes",
      amount: "Some cubes",
      location: "Kitchen",
      category: "General",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Frozen sage",
      amount: "Small bag",
      location: "Kitchen",
      category: "General",
      userId: user.id,
    },
  });

  // Fruit and veg

  await prisma.item.create({
    data: {
      title: "Peas",
      amount: "1 bag",
      location: "Kitchen",
      category: "Fruit and Veg",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Sweetcorn",
      amount: "1 bag",
      location: "Kitchen",
      category: "Fruit and Veg",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Green beans",
      amount: "1 bag",
      location: "Kitchen",
      category: "Fruit and Veg",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Red berries",
      amount: "1 bag",
      location: "Kitchen",
      category: "Fruit and Veg",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Leila soup/sauce",
      amount: "Cubes",
      location: "Kitchen",
      category: "Fruit and Veg",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Baked Beans",
      amount: "1 portion",
      location: "Kitchen",
      category: "Fruit and Veg",
      userId: user.id,
    },
  });

  await prisma.item.create({
    data: {
      title: "Chips (sweet potato)",
      amount: "half a bag",
      location: "Cellar",
      category: "Fruit and Veg",
      userId: user.id,
    },
  });

  // Meat and Fish

  await prisma.item.create({
    data: {
      title: "Breaded fish fillets",
      amount: "2",
      location: "Kitchen",
      category: "Meat and Fish",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Salmon fillet",
      amount: "1",
      location: "Cellar",
      category: "Meat and Fish",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Chicken thigh fillets",
      amount: "655g",
      location: "Cellar",
      category: "Meat and Fish",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Minty lamb steak",
      amount: "1 small",
      location: "Cellar",
      category: "Meat and Fish",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Minty lamb burger",
      amount: "1",
      location: "Cellar",
      category: "Meat and Fish",
      userId: user.id,
    },
  });

  await prisma.item.create({
    data: {
      title: "Minty lamb burger",
      amount: "2",
      location: "Cellar",
      category: "Meat and Fish",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Beef burgers",
      amount: "2",
      location: "Cellar",
      category: "Meat and Fish",
      userId: user.id,
    },
  });

  // Meat Meal

  await prisma.item.create({
    data: {
      title: "Italian chicken pasta and chard",
      amount: "1 portion",
      location: "Kitchen",
      category: "Meat Meal",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Italian chicken pasta and chard",
      amount: "1 portion",
      location: "Kitchen",
      category: "Meat Meal",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title:
        "Sweet potato, beetroot, carrot, chicken stew (no chicken) with rice",
      amount: "1 portion",
      location: "Kitchen",
      category: "Meat Meal",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Chicken and pak choi in oyster sauce with rice",
      amount: "1 portion",
      location: "Kitchen",
      category: "Meat Meal",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Chicken and pak choi in oyster sauce with rice",
      amount: "1 portion",
      location: "Kitchen",
      category: "Meat Meal",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Beef bolognase",
      amount: "1 portion",
      location: "Cellar",
      category: "Meat Meal",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title:
        "Chicken, green bean & pea in curried tomato, cashew & cream sauce",
      amount: "2 small portions",
      location: "Cellar",
      category: "Meat Meal",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Beef stew with cinnamon etc",
      amount: "2 portions",
      location: "Cellar",
      category: "Meat Meal",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Chicken beetroot stew",
      amount: "2 portions",
      location: "Cellar",
      category: "Meat Meal",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title:
        "Sweet potato, tomato, beetroot & chicken soup with bulgur wheat (no chicken)",
      amount: "1 portion",
      location: "Cellar",
      category: "Meat Meal",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Chicken beetroot stew",
      amount: "2 large portions",
      location: "Cellar",
      category: "Meat Meal",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Thai chicken stew broth",
      amount: "2 portions",
      location: "Cellar",
      category: "Meat Meal",
      userId: user.id,
    },
  }),
    await prisma.item.create({
      data: {
        title: "Thai chicken stew/broth",
        amount: "2 portions",
        location: "Cellar",
        category: "Meat Meal",
        userId: user.id,
      },
    });

  // Veg meals
  await prisma.item.create({
    data: {
      title: "Chaana daal",
      amount: "1 portion",
      location: "Cellar",
      category: "Veg Meal",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Chaana daal",
      amount: "2 portions",
      location: "Cellar",
      category: "Veg Meal",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Peppers, cashew, almond blend",
      amount: "1 portion",
      location: "Cellar",
      category: "Veg Meal",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Vegetable sauce",
      amount: "2 small portions",
      location: "Cellar",
      category: "Veg Meal",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Hearty veg stew",
      amount: "2 v large portions",
      location: "Cellar",
      category: "Veg Meal",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Carrot and cashew soup (add water)",
      amount: "1 portion",
      location: "Cellar",
      category: "Veg Meal",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Wild mushroom risotto",
      amount: "400g - 2 small portions",
      location: "Cellar",
      category: "Veg Meal",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Wild mushroom risotto",
      amount: "400g - 2 small portions",
      location: "Cellar",
      category: "Veg Meal",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Kidney beans in sauce",
      amount: "1 portion",
      location: "Cellar",
      category: "Veg Meal",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Sticky black rice congee",
      amount: "570g 2 large portions",
      location: "Cellar",
      category: "Veg Meal",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Veg bean stew",
      amount: "2 portions",
      location: "Cellar",
      category: "Veg Meal",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Veg bean stew",
      amount: "2 portions",
      location: "Cellar",
      category: "Veg Meal",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Veg bean stew",
      amount: "2 portions",
      location: "Cellar",
      category: "Veg Meal",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Mushroom risotto",
      amount: "2 portions",
      location: "Cellar",
      category: "Veg Meal",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Veg pasta sauce",
      amount: "2 portions",
      location: "Cellar",
      category: "Veg Meal",
      userId: user.id,
    },
  });
  await prisma.item.create({
    data: {
      title: "Zoog",
      amount: "1 big or 2 small portions",
      location: "Cellar",
      category: "Veg Meal",
      userId: user.id,
    },
  });

  // Sweet
  await prisma.item.create({
    data: {
      title: "Apple crumble filling",
      amount: "488g",
      location: "Cellar",
      category: "Sweet",
      userId: user.id,
    },
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
