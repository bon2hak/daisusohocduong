import { readFile } from "node:fs/promises";

const postsFile = process.argv[2];
if (!postsFile) {
  throw new Error("Cách dùng: node scripts/publish-posts.mjs <đường-dẫn-tệp-posts.json>");
}

const config = JSON.parse(
  await readFile(new URL("../firebase-applet-config.json", import.meta.url), "utf8")
);
const posts = JSON.parse(await readFile(postsFile, "utf8"));

if (!Array.isArray(posts) || posts.length === 0) {
  throw new Error("Tệp JSON phải là một mảng gồm ít nhất một bài viết.");
}

const requiredFields = [
  "id",
  "title",
  "slug",
  "summary",
  "content",
  "category",
  "categoryName",
  "thumbnail",
  "authorId",
  "authorName",
  "authorRole",
  "authorAvatar",
  "createdAt",
  "status",
  "tags",
  "comments",
];

function field(value) {
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (Array.isArray(value)) return { arrayValue: { values: value.map(field) } };
  if (value && typeof value === "object") {
    return {
      mapValue: {
        fields: Object.fromEntries(
          Object.entries(value).map(([key, item]) => [key, field(item)])
        ),
      },
    };
  }
  return { nullValue: null };
}

for (const post of posts) {
  const missing = requiredFields.filter((key) => post[key] === undefined);
  if (missing.length) {
    throw new Error(`Bài ${post.id || "chưa có id"} thiếu trường: ${missing.join(", ")}`);
  }
  if (post.status !== "published") {
    throw new Error(`Bài ${post.id} phải có trạng thái published mới được xuất bản.`);
  }

  const url = new URL(
    `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/${config.firestoreDatabaseId}/documents/posts/${post.id}`
  );
  url.searchParams.set("key", config.apiKey);

  const response = await fetch(url, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      fields: Object.fromEntries(Object.entries(post).map(([key, value]) => [key, field(value)])),
    }),
  });
  if (!response.ok) {
    throw new Error(`Không thể xuất bản ${post.id}: ${response.status} ${await response.text()}`);
  }
  console.log(`Đã xuất bản: ${post.title}`);
}
