import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { loadStore, saveStore } from "./server/dataStore";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      appName: "Đại Sứ Số Học Đường",
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
    });
  });

  // --- DATA STORAGE & SYNCHRONIZATION APIS ---
  // Get all centralized app data
  app.get("/api/data", (_req, res) => {
    try {
      const store = loadStore();
      res.json({ success: true, data: store });
    } catch (err: any) {
      res.status(500).json({ error: "Lỗi đọc dữ liệu máy chủ", details: err?.message });
    }
  });

  // Bulk sync or seed data
  app.post("/api/data/sync", (req, res) => {
    try {
      const incoming = req.body;
      const current = loadStore();

      const mergedData = {
        posts: Array.isArray(incoming.posts) && incoming.posts.length > 0 ? incoming.posts : current.posts,
        digitalSkills: Array.isArray(incoming.digitalSkills) && incoming.digitalSkills.length > 0 ? incoming.digitalSkills : current.digitalSkills,
        studentWorks: Array.isArray(incoming.studentWorks) && incoming.studentWorks.length > 0 ? incoming.studentWorks : current.studentWorks,
        videos: Array.isArray(incoming.videos) && incoming.videos.length > 0 ? incoming.videos : current.videos,
        documents: Array.isArray(incoming.documents) && incoming.documents.length > 0 ? incoming.documents : current.documents,
        aiPrompts: Array.isArray(incoming.aiPrompts) && incoming.aiPrompts.length > 0 ? incoming.aiPrompts : current.aiPrompts,
        aiTools: Array.isArray(incoming.aiTools) && incoming.aiTools.length > 0 ? incoming.aiTools : current.aiTools,
        emailPermissions: Array.isArray(incoming.emailPermissions) && incoming.emailPermissions.length > 0 ? incoming.emailPermissions : current.emailPermissions,
        leaderboard: Array.isArray(incoming.leaderboard) && incoming.leaderboard.length > 0 ? incoming.leaderboard : current.leaderboard,
        events: Array.isArray(incoming.events) && incoming.events.length > 0 ? incoming.events : current.events,
      };

      const saved = saveStore(mergedData);
      res.json({ success: true, message: "Đồng bộ dữ liệu máy chủ thành công", data: saved });
    } catch (err: any) {
      res.status(500).json({ error: "Lỗi đồng bộ dữ liệu", details: err?.message });
    }
  });

  // POSTS CRUD
  app.post("/api/posts", (req, res) => {
    try {
      const post = req.body;
      if (!post || !post.id || !post.title) {
        return res.status(400).json({ error: "Dữ liệu bài viết không hợp lệ" });
      }
      const store = loadStore();
      const existingIdx = store.posts.findIndex((p) => p.id === post.id);
      let updatedPosts = [...store.posts];
      if (existingIdx >= 0) {
        updatedPosts[existingIdx] = post;
      } else {
        updatedPosts.unshift(post);
      }
      saveStore({ posts: updatedPosts });
      res.json({ success: true, post });
    } catch (err: any) {
      res.status(500).json({ error: "Lỗi lưu bài viết", details: err?.message });
    }
  });

  app.put("/api/posts/:id", (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const store = loadStore();
      const idx = store.posts.findIndex((p) => p.id === id);
      if (idx === -1) {
        // If not found in server list, append it
        const newPost = { ...updateData, id };
        saveStore({ posts: [newPost, ...store.posts] });
        return res.json({ success: true, post: newPost });
      }
      const updatedPost = { ...store.posts[idx], ...updateData };
      const updatedPosts = [...store.posts];
      updatedPosts[idx] = updatedPost;
      saveStore({ posts: updatedPosts });
      res.json({ success: true, post: updatedPost });
    } catch (err: any) {
      res.status(500).json({ error: "Lỗi cập nhật bài viết", details: err?.message });
    }
  });

  app.delete("/api/posts/:id", (req, res) => {
    try {
      const { id } = req.params;
      const store = loadStore();
      const updatedPosts = store.posts.filter((p) => p.id !== id);
      saveStore({ posts: updatedPosts });
      res.json({ success: true, message: "Đã xóa bài viết khỏi máy chủ" });
    } catch (err: any) {
      res.status(500).json({ error: "Lỗi xóa bài viết", details: err?.message });
    }
  });

  app.post("/api/posts/:id/like", (req, res) => {
    try {
      const { id } = req.params;
      const store = loadStore();
      const idx = store.posts.findIndex((p) => p.id === id);
      if (idx !== -1) {
        const post = store.posts[idx];
        const isLiked = !post.isLikedByUser;
        const updated = {
          ...post,
          likes: isLiked ? post.likes + 1 : Math.max(0, post.likes - 1),
          isLikedByUser: isLiked,
        };
        const newPosts = [...store.posts];
        newPosts[idx] = updated;
        saveStore({ posts: newPosts });
        return res.json({ success: true, post: updated });
      }
      res.status(404).json({ error: "Không tìm thấy bài viết" });
    } catch (err: any) {
      res.status(500).json({ error: "Lỗi thích bài viết", details: err?.message });
    }
  });

  app.post("/api/posts/:id/comments", (req, res) => {
    try {
      const { id } = req.params;
      const comment = req.body;
      const store = loadStore();
      const idx = store.posts.findIndex((p) => p.id === id);
      if (idx !== -1) {
        const post = store.posts[idx];
        const updatedComments = [...(post.comments || []), comment];
        const updated = {
          ...post,
          comments: updatedComments,
          commentsCount: updatedComments.length,
        };
        const newPosts = [...store.posts];
        newPosts[idx] = updated;
        saveStore({ posts: newPosts });
        return res.json({ success: true, post: updated });
      }
      res.status(404).json({ error: "Không tìm thấy bài viết" });
    } catch (err: any) {
      res.status(500).json({ error: "Lỗi bình luận", details: err?.message });
    }
  });

  // STUDENT WORKS CRUD
  app.post("/api/student-works", (req, res) => {
    try {
      const work = req.body;
      const store = loadStore();
      const existingIdx = store.studentWorks.findIndex((w) => w.id === work.id);
      let updatedWorks = [...store.studentWorks];
      if (existingIdx >= 0) {
        updatedWorks[existingIdx] = work;
      } else {
        updatedWorks.unshift(work);
      }
      saveStore({ studentWorks: updatedWorks });
      res.json({ success: true, work });
    } catch (err: any) {
      res.status(500).json({ error: "Lỗi lưu sản phẩm học sinh", details: err?.message });
    }
  });

  app.put("/api/student-works/:id", (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const store = loadStore();
      const idx = store.studentWorks.findIndex((w) => w.id === id);
      if (idx === -1) {
        const newWork = { ...updateData, id };
        saveStore({ studentWorks: [newWork, ...store.studentWorks] });
        return res.json({ success: true, work: newWork });
      }
      const updatedWork = { ...store.studentWorks[idx], ...updateData };
      const updatedWorks = [...store.studentWorks];
      updatedWorks[idx] = updatedWork;
      saveStore({ studentWorks: updatedWorks });
      res.json({ success: true, work: updatedWork });
    } catch (err: any) {
      res.status(500).json({ error: "Lỗi cập nhật sản phẩm", details: err?.message });
    }
  });

  app.delete("/api/student-works/:id", (req, res) => {
    try {
      const { id } = req.params;
      const store = loadStore();
      const updatedWorks = store.studentWorks.filter((w) => w.id !== id);
      saveStore({ studentWorks: updatedWorks });
      res.json({ success: true, message: "Đã xóa sản phẩm" });
    } catch (err: any) {
      res.status(500).json({ error: "Lỗi xóa sản phẩm", details: err?.message });
    }
  });

  // EMAIL PERMISSIONS (RBAC)
  app.get("/api/permissions", (_req, res) => {
    try {
      const store = loadStore();
      res.json({ success: true, permissions: store.emailPermissions });
    } catch (err: any) {
      res.status(500).json({ error: "Lỗi lấy danh sách phân quyền", details: err?.message });
    }
  });

  app.post("/api/permissions", (req, res) => {
    try {
      const perm = req.body;
      if (!perm.email || !perm.email.includes("@")) {
        return res.status(400).json({ error: "Địa chỉ email không hợp lệ" });
      }
      const store = loadStore();
      const existingIdx = store.emailPermissions.findIndex(
        (p) => p.email.toLowerCase() === perm.email.toLowerCase()
      );
      let updatedPerms = [...store.emailPermissions];
      if (existingIdx >= 0) {
        updatedPerms[existingIdx] = { ...updatedPerms[existingIdx], ...perm };
      } else {
        const newPerm = {
          ...perm,
          id: perm.id || "perm_" + Date.now().toString().slice(-5),
          grantedAt: perm.grantedAt || new Date().toLocaleDateString("vi-VN"),
          status: perm.status || "active",
        };
        updatedPerms.push(newPerm);
      }
      saveStore({ emailPermissions: updatedPerms });
      res.json({ success: true, permissions: updatedPerms });
    } catch (err: any) {
      res.status(500).json({ error: "Lỗi lưu phân quyền", details: err?.message });
    }
  });

  app.delete("/api/permissions/:id", (req, res) => {
    try {
      const { id } = req.params;
      const store = loadStore();
      const updatedPerms = store.emailPermissions.filter((p) => p.id !== id && p.email !== id);
      saveStore({ emailPermissions: updatedPerms });
      res.json({ success: true, permissions: updatedPerms });
    } catch (err: any) {
      res.status(500).json({ error: "Lỗi xóa phân quyền", details: err?.message });
    }
  });

  // Trợ lý Đại sứ số AI endpoint
  app.post("/api/gemini/assistant", async (req, res) => {
    try {
      const { message, history, contextMode, userEmail, userName, userRole, classroom, clubRole } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Thiếu nội dung câu hỏi (message)" });
      }

      const client = getGeminiClient();
      if (!client) {
        // Fallback informative response when API key is pending
        return res.json({
          reply: `Chào bạn ${userName || ""}! Tôi là **Trợ lý Đại sứ số Học đường** (Phiên làm việc liên kết Gmail: \`${userEmail || "Học viên CLB"}\`). 
Để kích hoạt đầy đủ trí tuệ nhân tạo trực tiếp, vui lòng thêm \`GEMINI_API_KEY\` trong bảng Secrets.

*Gợi ý câu trả lời cho câu hỏi: "${message}"*:
1. **Nguyên tắc cốt lõi**: Luôn bảo vệ thông tin định danh cá nhân và kích hoạt xác thực 2 lớp (2FA) cho tài khoản Google/Gmail.
2. **Kỹ năng số**: Luôn kiểm tra chéo nguồn tin trên các cổng báo chí chính thống trước khi chia sẻ.
3. **Ứng xử văn minh**: Tôn trọng bản quyền tác giả và lan tỏa năng lượng tích cực trên không gian mạng!`,
        });
      }

      let systemInstruction = `Bạn là "Trợ lý AI Đại sứ số Học đường" - một trợ lý thông minh, thân thiện, truyền cảm hứng và mẫu mực dành cho học sinh, giáo viên và nhà trường THCS Đề Thám (Việt Nam).
Phương châm CLB: "Học kỹ năng số – Sống có trách nhiệm – Lan tỏa điều tốt đẹp".
${userEmail ? `Người dùng đang kết nối qua tài khoản Gmail: ${userEmail}` : ""}
${userName ? `Họ và tên: ${userName}` : ""}
${classroom ? `Lớp/Tổ chuyên môn: ${classroom}` : ""}
${clubRole ? `Chức vụ trong CLB: ${clubRole}` : ""}
${userRole ? `Phân quyền: ${userRole}` : ""}

Nhiệm vụ của bạn:
1. Giải đáp các thắc mắc về Kỹ năng số (Google Docs, Drive, Canva, Email/Gmail, mạng xã hội, an toàn thông tin, lập trình cơ bản).
2. Hướng dẫn sử dụng AI an toàn & hiệu quả trong học tập (cách viết prompt, tư duy phản biện, tránh đạo văn, ứng dụng Gemini).
3. Hướng dẫn An toàn không gian mạng (nhận diện tin giả, lừa đảo trực tuyến, bảo mật mật khẩu Gmail/Mạng xã hội, chống bạo lực mạng).
4. Giúp học sinh lên ý tưởng bài viết tuyên truyền, kịch bản video, dự án STEM, bài thuyết trình số.
5. Luôn trả lời bằng tiếng Việt chuẩn mực, sư phạm, xưng hô thân mật phù hợp với học sinh/thầy cô tại trường THCS Đề Thám. Định dạng Markdown rõ ràng, gạch đầu dòng và icon sinh động.`;

      if (contextMode === "safety") {
        systemInstruction += `\nĐặc biệt chú trọng kiểm tra an toàn mạng, phân tích tin nhắn/đường link nghi ngờ lừa đảo, đưa ra các bước xử lý cấp bách để bảo vệ tài khoản và thiết bị cá nhân.`;
      } else if (contextMode === "prompt") {
        systemInstruction += `\nĐặc biệt hỗ trợ soạn thảo prompt tối ưu cho học tập, nghiên cứu và sáng tạo nghệ thuật số.`;
      }

      const promptContent = history && Array.isArray(history) && history.length > 0
        ? `Lịch sử trao đổi trước đó:\n${history.map((h: { role: string; content: string }) => `${h.role === "user" ? (userName || "Học sinh") : "Trợ lý"}: ${h.content}`).join("\n")}\n\nCâu hỏi mới nhất: ${message}`
        : message;

      const response = await client.models.generateContent({
        model: "gemini-3.7-flash",
        contents: promptContent,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      res.json({ reply: response.text || "Trợ lý đã tiếp nhận nhưng chưa có câu trả lời phù hợp." });
    } catch (error: any) {
      console.error("Gemini Assistant Error:", error);
      res.status(500).json({
        error: "Không thể kết nối với dịch vụ AI. Vui lòng thử lại sau.",
        details: error?.message,
      });
    }
  });

  // Phân tích tin giả & Kiểm tra an toàn mạng
  app.post("/api/gemini/safety-check", async (req, res) => {
    try {
      const { textToCheck, userEmail, userName } = req.body;
      if (!textToCheck) {
        return res.status(400).json({ error: "Thiếu nội dung cần kiểm tra" });
      }

      const client = getGeminiClient();
      if (!client) {
        return res.json({
          safetyScore: 85,
          riskLevel: "Trung bình",
          verdict: "Cần cẩn trọng xác minh nguồn",
          analysis: `Hệ thống AI (liên kết với ${userEmail || "Gmail học sinh"}) đang chạy ở chế độ mô phỏng an toàn mạng. Hãy kiểm tra: 1) Tên miền có giả mạo không? 2) Có yêu cầu mật khẩu/OTP không? 3) Giọng điệu có hối thúc khẩn cấp không?`,
          tips: ["Không bấm vào link lạ", "Không chia sẻ mã OTP", "Báo cáo cho giáo viên hoặc phụ huynh"],
        });
      }

      const response = await client.models.generateContent({
        model: "gemini-3.7-flash",
        contents: `Phân tích nội dung sau đây dưới góc độ An toàn mạng và Kiểm tra tin giả cho học sinh/giáo viên (${userName || "Học sinh"} - ${userEmail || "Chưa rõ email"}):\n"${textToCheck}"`,
        config: {
          systemInstruction: `Bạn là chuyên gia an toàn thông tin trường học THCS Đề Thám. Hãy phân tích xem đoạn văn bản, tin nhắn, hoặc thông tin trên có dấu hiệu lừa đảo (phishing), tin giả (fake news), mã độc hay vi phạm an toàn thông tin không. 
Trả lời định dạng Markdown có cấu trúc:
1. Đánh giá mức độ rủi ro (An toàn / Cảnh báo / Nguy hiểm)
2. Các dấu hiệu nhận biết cụ thể
3. Lời khuyên hành động tức thì cho học sinh/người dùng.`,
        },
      });

      res.json({ analysis: response.text });
    } catch (error: any) {
      console.error("Gemini Safety Check Error:", error);
      res.status(500).json({ error: "Lỗi kiểm tra an toàn", details: error?.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Đại Sứ Số Học Đường Server running on http://localhost:${PORT}`);
  });
}

startServer();
