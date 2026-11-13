import "server-only";
import { createClient } from "redis";

const homepageDefaults = {
  title: "Home",
  heading: "Manage your products with ease",
  description: "Welcome to Product Management System Web, the app that helps you manage your products with ease. Save, view, and update your products in one place. Browse them in a simple table, add new ones, and edit details anytime.",
  imageAlt: "A picture of a person",
};

function createRedisClient() {
  return createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST!,
      port: Number(process.env.REDIS_PORT),
      connectTimeout: 2000,
      reconnectStrategy: false,
      ...(process.env.REDIS_TLS === "true" ? { tls: true as const } : {}),
    },
  });
}

export async function getHomepageContent() {
  const redisPort = Number(process.env.REDIS_PORT);

  // Redis is optional in CI and local test runs. Use homepage defaults when
  // the connection settings are not available instead of creating an invalid client.
  if (
    !process.env.REDIS_HOST ||
    !Number.isInteger(redisPort) ||
    redisPort < 0 ||
    redisPort > 65535
  ) {
    return homepageDefaults;
  }

  const client = createRedisClient();
  client.on("error", (error) => console.error("Redis client error", error));

  const keys = [
    "homepage:title",
    "homepage:heading",
    "homepage:description",
    "homepage:imageAlt",
  ];

  try {
    await client.connect();

    await client.set(keys[0], homepageDefaults.title, { NX: true });
    await client.set(keys[1], homepageDefaults.heading, { NX: true });
    await client.set(keys[2], homepageDefaults.description, { NX: true });
    await client.set(keys[3], homepageDefaults.imageAlt, { NX: true });

    const [title, heading, description, imageAlt] = await client.mGet(keys);

    return {
      title: title ?? homepageDefaults.title,
      heading: heading ?? homepageDefaults.heading,
      description: description ?? homepageDefaults.description,
      imageAlt: imageAlt ?? homepageDefaults.imageAlt,
    };
  } catch (error) {
    console.error("Redis unavailable; using homepage defaults", error);
    return homepageDefaults;
  } finally {
    if (client.isOpen) await client.quit();
  }
}
