import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { postsTable } from "../src/db/schema.js";

dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL topilmadi. .env.local ni tekshir.");
}

const app = express();

app.use(cors());
app.use(express.json({ limit: "5mb" }));

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

function slugify(title) {
  const cleanTitle = title
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${cleanTitle || "post"}-${nanoid(6)}`;
}

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.post("/api/posts", async (req, res) => {
  try {
    const { title, author, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "title va content kerak",
      });
    }

    const slug = slugify(title);

    const result = await db
      .insert(postsTable)
      .values({
        title,
        author: author || "Anonymous",
        content,
        slug,
        updatedAt: new Date(),
      })
      .returning();

    res.json({
      success: true,
      post: result[0],
      url: `/p/${slug}`,
    });
  } catch (error) {
    console.error("Create post error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/api/posts/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await db
      .select()
      .from(postsTable)
      .where(eq(postsTable.slug, slug))
      .limit(1);

    const post = result[0];

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post topilmadi",
      });
    }

    res.json({
      success: true,
      post,
    });
  } catch (error) {
    console.error("Get post error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.listen(3000, () => {
  console.log("Backend running on http://localhost:3000");
});