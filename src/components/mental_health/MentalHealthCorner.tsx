import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  HeartHandshake,
  Smile,
  Meh,
  Frown,
  Sparkles,
  Send,
  ShieldCheck,
  PhoneCall,
  UserCheck,
  BookOpen,
  Wind,
  Volume2,
  VolumeX,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  Lock,
  ChevronRight,
  TrendingUp,
  Award,
  Play,
  Pause,
  RotateCcw,
  Compass,
  ArrowRight,
  Info,
  Calendar,
  Eye,
  EyeOff,
  Bot,
  Activity,
  Lightbulb,
  GraduationCap,
  Users,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import {
  MoodScore,
  MoodFactor,
  CounselingCategory,
  MentalHealthArticle,
  EmotionJournalEntry,
} from "../../types";
import {
  MENTAL_HEALTH_ARTICLES,
  DAILY_AFFIRMATIONS,
  SELF_REFLECTION_PROMPTS,
} from "../../data/mentalHealthData";

export const MentalHealthCorner: React.FC = () => {
  const {
    currentUser,
    currentRole,
    moodCheckIns,
    addMoodCheckIn,
    counselingMessages,
    sendCounselingMessage,
    replyCounselingMessage,
    deleteCounselingMessage,
    emotionJournals,
    addEmotionJournal,
    deleteEmotionJournal,
    advisors,
  } = useApp();

  // Active Sub-tab in Corner
  const [activeSubTab, setActiveSubTab] = useState<
    "overview" | "counseling" | "articles" | "relax" | "ai_companion" | "sos"
  >("overview");

  // Mood Check-in state
  const [selectedScore, setSelectedScore] = useState<MoodScore>(4);
  const [selectedFactors, setSelectedFactors] = useState<MoodFactor[]>(["study"]);
  const [moodNote, setMoodNote] = useState("");
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);

  // Counseling Form State
  const [counselingCategory, setCounselingCategory] = useState<CounselingCategory>("academic_pressure");
  const [counselingTitle, setCounselingTitle] = useState("");
  const [counselingContent, setCounselingContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmittingCounseling, setIsSubmittingCounseling] = useState(false);
  const [replyInput, setReplyInput] = useState<{ [msgId: string]: string }>({});

  // Articles Modal / Detail View
  const [selectedArticle, setSelectedArticle] = useState<MentalHealthArticle | null>(null);
  const [articleFilter, setArticleFilter] = useState<string>("all");

  // Relaxation: Breathing Exercise State
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("inhale");
  const [breathCount, setBreathCount] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingCycle, setBreathingCycle] = useState(0);

  // Relaxation: Ambient Audio Synthesizer (Web Audio API)
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundNodesRef = useRef<any[]>([]);

  // Emotion Journal State
  const [journalContent, setJournalContent] = useState("");
  const [journalGratitude, setJournalGratitude] = useState("");
  const [selectedPromptIndex, setSelectedPromptIndex] = useState(0);

  // AI Mental Health Companion Chat State
  const [chatMessages, setChatMessages] = useState<
    { role: "assistant" | "user"; content: string; timestamp: string }[]
  >([
    {
      role: "assistant",
      content: `Chào ${currentUser?.name || "bạn nhỏ"}! 🌿 Mình là **MindCare AI** - Trợ lý Đồng Hành & Sức Khỏe Tinh Thần của Trường THCS Đề Thám.\n\nHôm nay bạn cảm thấy thế nào? Dù có chuyện vui hay đang gặp áp lực học tập, thi cử hay bạn bè, mình luôn ở đây để lắng nghe bạn một cách an toàn và dịu dàng nhất.`,
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Check if checked in today
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    const checked = moodCheckIns.some((m) => m.date === today);
    setHasCheckedInToday(checked);
  }, [moodCheckIns]);

  // Breathing Box Timer Loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBreathingActive) {
      timer = setInterval(() => {
        setBreathCount((prev) => {
          if (prev <= 1) {
            // Transition phases
            if (breathingPhase === "inhale") {
              setBreathingPhase("hold");
              return 4;
            } else if (breathingPhase === "hold") {
              setBreathingPhase("exhale");
              return 4;
            } else if (breathingPhase === "exhale") {
              setBreathingPhase("rest");
              return 2;
            } else {
              setBreathingPhase("inhale");
              setBreathingCycle((c) => c + 1);
              return 4;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isBreathingActive, breathingPhase]);

  // Web Audio ambient sound synthesizer
  const toggleSound = (soundType: string) => {
    if (activeSound === soundType) {
      stopAmbientSound();
      setActiveSound(null);
      return;
    }

    stopAmbientSound();
    playAmbientSound(soundType);
    setActiveSound(soundType);
  };

  const stopAmbientSound = () => {
    soundNodesRef.current.forEach((n) => {
      try {
        n.stop ? n.stop() : n.disconnect();
      } catch {}
    });
    soundNodesRef.current = [];
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      try {
        audioCtxRef.current.close();
      } catch {}
      audioCtxRef.current = null;
    }
  };

  const playAmbientSound = (soundType: string) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      if (soundType === "rain") {
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(800, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        noise.start();
        soundNodesRef.current.push(noise, filter, gainNode);
      } else if (soundType === "waves") {
        const bufferSize = ctx.sampleRate * 2;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.4;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = "bandpass";
        filter.frequency.setValueAtTime(400, ctx.currentTime);

        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.12, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(300, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.25, ctx.currentTime);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        noise.start();
        soundNodesRef.current.push(noise, lfo, filter, gainNode);
      } else if (soundType === "forest") {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(528, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start();
        soundNodesRef.current.push(osc, gainNode);
      } else if (soundType === "zen") {
        const osc1 = ctx.createOscillator();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(432, ctx.currentTime);

        const osc2 = ctx.createOscillator();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(216, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.09, ctx.currentTime);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc1.start();
        osc2.start();
        soundNodesRef.current.push(osc1, osc2, gainNode);
      }
    } catch (e) {
      console.warn("Audio Context init notice:", e);
    }
  };

  useEffect(() => {
    return () => {
      stopAmbientSound();
    };
  }, []);

  // Handle Mood Check-In Submit
  const handleMoodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const moodLabels: Record<MoodScore, string> = {
      1: "Rất mệt mỏi / Căng thẳng",
      2: "Buồn bã / Lo âu",
      3: "Bình thường / Tạm ổn",
      4: "Vui vẻ / Tích cực",
      5: "Rất tuyệt vời / Tràn đầy năng lượng",
    };

    const moodEmojis: Record<MoodScore, string> = {
      1: "😫",
      2: "😔",
      3: "😐",
      4: "😊",
      5: "🤩",
    };

    const now = new Date();
    addMoodCheckIn({
      score: selectedScore,
      moodLabel: moodLabels[selectedScore],
      emoji: moodEmojis[selectedScore],
      factors: selectedFactors,
      note: moodNote.trim() || undefined,
      userEmail: currentUser?.email || "anonymous@detham.edu.vn",
      userName: currentUser?.name || "Học sinh",
      date: now.toISOString().slice(0, 10),
      time: now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    });

    setMoodNote("");
  };

  const toggleMoodFactor = (f: MoodFactor) => {
    setSelectedFactors((prev) =>
      prev.includes(f) ? prev.filter((item) => item !== f) : [...prev, f]
    );
  };

  // Handle Counseling Message Send
  const handleCounselingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!counselingTitle.trim() || !counselingContent.trim()) return;

    setIsSubmittingCounseling(true);
    const categoryNames: Record<CounselingCategory, string> = {
      academic_pressure: "Áp lực học tập",
      exam_stress: "Lo lắng trước kỳ thi",
      friend_conflict: "Mâu thuẫn với bạn bè",
      cyberbullying: "Bị bắt nạt trên mạng",
      emotion_control: "Cách kiểm soát cảm xúc",
      self_esteem: "Tự tin và hình ảnh bản thân",
      social_media_habit: "Sử dụng mạng xã hội lành mạnh",
      family_pressure: "Cân bằng học tập và gia đình",
      other: "Vấn đề cá nhân khác",
    };

    await sendCounselingMessage({
      title: counselingTitle.trim(),
      content: counselingContent.trim(),
      category: counselingCategory,
      categoryLabel: categoryNames[counselingCategory] || "Tư vấn tâm lý",
      isAnonymous,
      senderName: isAnonymous ? "Học sinh (Ẩn danh)" : currentUser?.name || "Học sinh",
      senderEmail: isAnonymous ? "an_danh@detham.edu.vn" : currentUser?.email || "hocsinh@detham.edu.vn",
      senderClass: isAnonymous ? undefined : currentUser?.classroom,
      urgentLevel: "normal",
    });

    setIsSubmittingCounseling(false);
    setCounselingTitle("");
    setCounselingContent("");
    setIsAnonymous(false);
    setActiveSubTab("counseling");
  };

  // Handle Counselor Reply
  const handleReplyMessage = async (msgId: string) => {
    const text = replyInput[msgId];
    if (!text || !text.trim()) return;

    await replyCounselingMessage(msgId, text.trim());
    setReplyInput((prev) => ({ ...prev, [msgId]: "" }));
  };

  // Handle AI Companion Send
  const handleSendAiMessage = async () => {
    if (!chatInput.trim() || isAiTyping) return;

    const userText = chatInput.trim();
    const userMsg = {
      role: "user" as const,
      content: userText,
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };

    const newHistory = [...chatMessages, userMsg];
    setChatMessages(newHistory);
    setChatInput("");
    setIsAiTyping(true);

    try {
      const res = await fetch("/api/gemini/mental-health-companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          history: newHistory.map((m) => ({ role: m.role, content: m.content })),
          userName: currentUser?.name,
          userEmail: currentUser?.email,
          classroom: currentUser?.classroom,
          mood: selectedScore ? `${selectedScore}/5 (${selectedFactors.join(", ")})` : undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.reply || "Mình luôn ở bên cạnh lắng nghe bạn.",
            timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      } else {
        throw new Error("API error");
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Cảm ơn bạn đã tâm sự cùng mình. 🌿 Mình nhận thấy bạn đang trải qua những cảm xúc quan trọng. Hãy hít một hơi thật sâu và nhớ rằng: bạn không hề đơn độc. Bạn luôn có thể gửi thư bảo mật tới **Thầy Bùi Kim Kỳ (Cố vấn tâm lý)** ở mục Hộp thư Tâm sự nhé!`,
          timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsAiTyping(false);
      setTimeout(() => {
        chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  // Filtered Articles
  const filteredArticles =
    articleFilter === "all"
      ? MENTAL_HEALTH_ARTICLES
      : MENTAL_HEALTH_ARTICLES.filter((a) => a.category.includes(articleFilter));

  // Random Daily Affirmation
  const todayAffirmation =
    DAILY_AFFIRMATIONS[Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % DAILY_AFFIRMATIONS.length];

  // User's own messages vs All messages for Counselor
  const isCounselorOrAdmin =
    currentRole === "super_admin" || currentRole === "teacher";

  const visibleMessages = isCounselorOrAdmin
    ? counselingMessages
    : counselingMessages.filter(
        (m) =>
          m.senderEmail?.toLowerCase() === (currentUser?.email || "").toLowerCase() ||
          m.senderName === currentUser?.name
      );

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Header Banner & Identity */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-sky-800 text-white p-6 sm:p-10 shadow-xl border border-teal-500/20">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-64 h-64 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-semibold uppercase tracking-wider mb-4 border border-white/20">
            <HeartHandshake className="w-4 h-4 text-emerald-300 animate-pulse" />
            Không Gian Yêu Thương & Cố Vấn Học Đường
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-3 text-white">
            Góc Sức Khỏe Tinh Thần & Cố Vấn Học Đường
          </h1>

          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed max-w-2xl mb-6">
            Nơi học sinh THCS Đề Thám tìm thấy sự đồng cảm, giải tỏa áp lực thi cử, học cách thấu hiểu cảm xúc bản thân và kết nối an toàn với Thầy Cô Cố vấn tâm lý.
          </p>

          {/* Quick Advisor Contact Pill */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15">
              <img
                src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=120&auto=format&fit=crop&q=80"
                alt="Thầy Bùi Kim Kỳ"
                className="w-10 h-10 rounded-full object-cover border-2 border-emerald-300"
              />
              <div>
                <div className="text-xs text-emerald-200 font-medium">Cố Vấn Tâm Lý Học Đường</div>
                <div className="text-sm font-bold text-white">Thầy Bùi Kim Kỳ & Ban Cố Vấn</div>
              </div>
            </div>

            <button
              onClick={() => setActiveSubTab("counseling")}
              className="inline-flex items-center gap-2 bg-white text-teal-800 hover:bg-emerald-50 px-4 py-2.5 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
            >
              <Send className="w-4 h-4 text-teal-600" />
              Gửi Tâm Sự Bí Mật
            </button>

            <button
              onClick={() => setActiveSubTab("relax")}
              className="inline-flex items-center gap-2 bg-emerald-500/30 hover:bg-emerald-500/40 text-white px-4 py-2.5 rounded-2xl font-semibold text-sm border border-white/20 transition-all"
            >
              <Wind className="w-4 h-4 text-emerald-200" />
              Tập Thở & Thư Giãn 3 Phút
            </button>
          </div>
        </div>
      </div>

      {/* 2. Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: "overview", label: "🌟 Tổng Quan & Check-in", desc: "Cảm xúc hôm nay" },
          { id: "counseling", label: "💬 Hộp Thư Tâm Sự", desc: "Tư vấn bảo mật" },
          { id: "articles", label: "📚 Cẩm Nang Tâm Lý", desc: "Kỹ năng cảm xúc" },
          { id: "relax", label: "🧘 Thư Giãn & Nhật Ký", desc: "Box Breathing & Âm thanh" },
          { id: "ai_companion", label: "🤖 MindCare AI", desc: "Trợ lý đồng hành" },
          { id: "sos", label: "🆘 Hỗ Trợ 3 Cấp Độ", desc: "Đường dây nóng 111" },
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all flex flex-col items-start min-w-[130px] border ${
                isActive
                  ? "bg-teal-700 text-white border-teal-700 shadow-md shadow-teal-700/20"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-teal-50/50 hover:border-teal-300"
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[11px] font-normal mt-0.5 ${isActive ? "text-teal-200" : "text-slate-600"}`}>
                {tab.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. Sub-Tab Content Rendering */}

      {/* 🌟 SUB-TAB 1: OVERVIEW & MOOD CHECK-IN */}
      {activeSubTab === "overview" && (
        <div className="space-y-8 animate-fadeIn">
          {/* Daily Positive Affirmation Card */}
          <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 rounded-3xl p-6 border border-amber-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
                  Thông điệp tích cực hôm nay
                </div>
                <p className="text-slate-800 font-medium text-base italic leading-relaxed">
                  "{todayAffirmation}"
                </p>
              </div>
            </div>
            <div className="shrink-0 text-xs font-semibold text-amber-800 bg-white/80 px-3 py-1.5 rounded-full border border-amber-200">
              🌱 Mỗi ngày là một khởi đầu mới
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Col: 30-Second Mood Check-in Widget (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full mb-1">
                    <Activity className="w-3.5 h-3.5" /> 30 Giây Lắng Nghe Bản Thân
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">
                    Hôm nay cảm xúc của bạn thế nào?
                  </h2>
                </div>

                {hasCheckedInToday && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Đã Check-in hôm nay
                  </span>
                )}
              </div>

              <form onSubmit={handleMoodSubmit} className="space-y-6">
                {/* 5 Mood Levels */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-3 uppercase tracking-wider">
                    1. Chọn mức độ cảm xúc
                  </label>
                  <div className="grid grid-cols-5 gap-2 sm:gap-3">
                    {[
                      { score: 1 as MoodScore, icon: "😫", label: "Mệt mỏi" },
                      { score: 2 as MoodScore, icon: "😔", label: "Lo âu" },
                      { score: 3 as MoodScore, icon: "😐", label: "Tạm ổn" },
                      { score: 4 as MoodScore, icon: "😊", label: "Vui vẻ" },
                      { score: 5 as MoodScore, icon: "🤩", label: "Tuyệt vời" },
                    ].map((item) => (
                      <button
                        key={item.score}
                        type="button"
                        onClick={() => setSelectedScore(item.score)}
                        className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl border-2 transition-all text-center ${
                          selectedScore === item.score
                            ? "border-teal-600 bg-teal-50 text-teal-900 shadow-sm scale-102 font-bold"
                            : "border-slate-200 bg-slate-50/60 text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        <span className="text-2xl sm:text-3xl mb-1">{item.icon}</span>
                        <span className="text-xs leading-tight">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Factors Affecting Mood */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-3 uppercase tracking-wider">
                    2. Điều gì tác động nhiều nhất đến bạn hôm nay?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { factor: "study" as MoodFactor, label: "Học tập & Bài tập", icon: "📚" },
                      { factor: "friends" as MoodFactor, label: "Bạn bè & Tình bạn", icon: "🤝" },
                      { factor: "family" as MoodFactor, label: "Gia đình", icon: "🏡" },
                      { factor: "health" as MoodFactor, label: "Sức khỏe thể chất", icon: "🏃" },
                      { factor: "social_media" as MoodFactor, label: "Mạng xã hội", icon: "📱" },
                      { factor: "other" as MoodFactor, label: "Khác", icon: "✨" },
                    ].map((f) => {
                      const isSelected = selectedFactors.includes(f.factor);
                      return (
                        <button
                          key={f.factor}
                          type="button"
                          onClick={() => toggleMoodFactor(f.factor)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                            isSelected
                              ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                              : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                          }`}
                        >
                          <span>{f.icon}</span>
                          <span>{f.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Optional Note */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">
                    3. Ghi chú nhanh (Tùy chọn)
                  </label>
                  <textarea
                    rows={2}
                    value={moodNote}
                    onChange={(e) => setMoodNote(e.target.value)}
                    placeholder="Viết một vài từ về cảm xúc của bạn... (Ví dụ: Vừa làm xong bài kiểm tra Toán, thấy nhẹ nhõm)"
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-hidden transition-all resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-slate-600 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-teal-600" />
                    <span>Dữ liệu được bảo mật riêng tư</span>
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Lưu Check-in (+15 Điểm)
                  </button>
                </div>
              </form>

              {/* Recent Mood History */}
              {moodCheckIns.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Lịch sử Check-in gần đây ({moodCheckIns.length})
                    </span>
                    <span className="text-xs text-teal-700 font-semibold">Nhật ký cảm xúc</span>
                  </div>
                  <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                    {moodCheckIns.slice(0, 4).map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-2xl">{m.emoji}</span>
                          <div>
                            <div className="font-bold text-slate-800">{m.moodLabel}</div>
                            {m.note && <div className="text-slate-600 line-clamp-1 italic">"{m.note}"</div>}
                          </div>
                        </div>
                        <div className="text-right text-slate-600">
                          {m.date} • {m.time}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Col: Quick Support Channels & Features (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* 4 Pillars Card */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-teal-600" />
                  Bạn đang cần trợ giúp điều gì?
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => setActiveSubTab("counseling")}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-teal-50/70 hover:bg-teal-100/70 border border-teal-200 text-left transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-teal-900 group-hover:text-teal-950">
                          Mình muốn chia sẻ
                        </div>
                        <div className="text-xs text-teal-700">
                          Gửi thư bảo mật tới Cố vấn tâm lý
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-teal-600 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => setActiveSubTab("articles")}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-sky-50/70 hover:bg-sky-100/70 border border-sky-200 text-left transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-sky-900 group-hover:text-sky-950">
                          Mình muốn tìm hiểu
                        </div>
                        <div className="text-xs text-sky-700">
                          8 cẩm nang gỡ rối tâm lý tuổi học trò
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-sky-600 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => setActiveSubTab("relax")}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/70 border border-emerald-200 text-left transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                        <Wind className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-emerald-900 group-hover:text-emerald-950">
                          Mình muốn thư giãn
                        </div>
                        <div className="text-xs text-emerald-700">
                          Bài tập thở Box Breathing & Âm thanh thiên nhiên
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-emerald-600 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => setActiveSubTab("sos")}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50/70 hover:bg-rose-100/70 border border-rose-200 text-left transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0">
                        <PhoneCall className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-rose-900 group-hover:text-rose-950">
                          Mình cần người lớn giúp đỡ
                        </div>
                        <div className="text-xs text-rose-700">
                          Hotline 111 & Danh bạ khẩn cấp
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-rose-600 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Ethics & Non-Diagnostic Guarantee Notice */}
              <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 text-xs text-slate-700 space-y-2">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  Cam kết Đạo đức & Bảo mật Học đường
                </div>
                <p className="leading-relaxed">
                  • <strong>Không chẩn đoán bệnh lý</strong>: Công cụ và trợ lý AI chỉ hỗ trợ định hướng cảm xúc và gợi ý kỹ năng tự chăm sóc, không thay thế chẩn đoán y khoa.
                </p>
                <p className="leading-relaxed">
                  • <strong>Bảo mật tối đa</strong>: Thư tâm sự chỉ được gửi tới Thầy Cô cố vấn đã xác thực. Bạn luôn có quyền gửi ẩn danh.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 💬 SUB-TAB 2: HỘP THƯ TÂM SỰ & CỐ VẤN */}
      {activeSubTab === "counseling" && (
        <div className="space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Message Compose Form (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">
                  Gửi Thư Tâm Sự & Yêu Cầu Cố Vấn
                </h2>
              </div>
              <p className="text-slate-600 text-xs sm:text-sm mb-6 leading-relaxed">
                Mọi chia sẻ của bạn được gửi trực tiếp và bảo mật đến Thầy Bùi Kim Kỳ (Cố vấn tâm lý) hoặc Ban Cố vấn CLB. Thầy Cô sẽ đọc và gửi phản hồi ân cần nhất tới bạn.
              </p>

              <form onSubmit={handleCounselingSubmit} className="space-y-5">
                {/* Advisor Selector */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Người nhận tâm sự
                  </label>
                  <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-2xl flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=120&auto=format&fit=crop&q=80"
                      alt="Thầy Bùi Kim Kỳ"
                      className="w-10 h-10 rounded-full object-cover border-2 border-teal-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-teal-950">Thầy Bùi Kim Kỳ</div>
                      <div className="text-[11px] text-teal-700">Cố vấn Tâm lý học đường - THCS Đề Thám</div>
                    </div>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Chủ đề cần tâm sự
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: "academic_pressure" as CounselingCategory, label: "Áp lực học tập", icon: "📚" },
                      { id: "exam_stress" as CounselingCategory, label: "Lo lắng thi cử", icon: "📝" },
                      { id: "friend_conflict" as CounselingCategory, label: "Mâu thuẫn bạn bè", icon: "🤝" },
                      { id: "cyberbullying" as CounselingCategory, label: "Bắt nạt mạng", icon: "🛡️" },
                      { id: "emotion_control" as CounselingCategory, label: "Kiểm soát cảm xúc", icon: "🌧️" },
                      { id: "self_esteem" as CounselingCategory, label: "Tự tin bản thân", icon: "✨" },
                      { id: "social_media_habit" as CounselingCategory, label: "Mạng xã hội", icon: "📱" },
                      { id: "family_pressure" as CounselingCategory, label: "Gia đình & cha mẹ", icon: "🏡" },
                      { id: "other" as CounselingCategory, label: "Vấn đề khác", icon: "💬" },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCounselingCategory(cat.id)}
                        className={`p-2.5 rounded-2xl text-xs font-bold text-left flex items-center gap-2 border transition-all ${
                          counselingCategory === cat.id
                            ? "bg-teal-50 border-teal-600 text-teal-800 shadow-xs"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Tiêu đề tóm tắt
                  </label>
                  <input
                    type="text"
                    required
                    value={counselingTitle}
                    onChange={(e) => setCounselingTitle(e.target.value)}
                    placeholder="Ví dụ: Em cảm thấy quá lo lắng trước kỳ thi giữa kỳ..."
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-hidden"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Nội dung bạn muốn chia sẻ cùng Thầy Cô
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={counselingContent}
                    onChange={(e) => setCounselingContent(e.target.value)}
                    placeholder="Hãy thoải mái viết ra những gì bạn đang suy nghĩ hoặc trải qua. Bạn luôn được lắng nghe với sự tôn trọng và thấu hiểu..."
                    className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-hidden resize-none"
                  />
                </div>

                {/* Anonymous Checkbox */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-4 h-4 text-teal-600 rounded-md focus:ring-teal-500 border-slate-300"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        {isAnonymous ? <EyeOff className="w-4 h-4 text-teal-700" /> : <Eye className="w-4 h-4 text-slate-600" />}
                        Gửi thư ẩn danh (Không hiển thị tên & email)
                      </div>
                      <div className="text-[11px] text-slate-600">
                        Thầy Cô vẫn có thể gửi phản hồi lại trong mục "Thư của bạn" trên thiết bị này.
                      </div>
                    </div>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingCounseling}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white py-3 rounded-2xl font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSubmittingCounseling ? "Đang gửi an toàn..." : "Gửi Tâm Sự Đến Ban Cố Vấn"}
                </button>
              </form>
            </div>

            {/* Right: Message Inbox / Tracker (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-500" />
                    <h3 className="text-base font-bold text-slate-800">
                      {isCounselorOrAdmin ? "Hộp Thư Tư Vấn (Dành Cho Cố Vấn)" : "Thư Tâm Sự Của Bạn"}
                    </h3>
                  </div>
                  <span className="text-xs font-bold bg-teal-100 text-teal-800 px-2.5 py-1 rounded-full">
                    {visibleMessages.length} Thư
                  </span>
                </div>

                {visibleMessages.length === 0 ? (
                  <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-slate-100 text-slate-600 space-y-2">
                    <MessageSquare className="w-8 h-8 mx-auto text-slate-400" />
                    <p className="text-xs font-medium">Bạn chưa gửi thư tâm sự nào.</p>
                    <p className="text-[11px] text-slate-600">
                      Khi gửi thư, bạn có thể theo dõi phản hồi ân cần từ Thầy Cô tại đây.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                    {visibleMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md text-[11px]">
                            {msg.categoryLabel || "Tâm sự học đường"}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              msg.status === "replied"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {msg.status === "replied" ? "✓ Đã có phản hồi" : "⏳ Đang chờ phản hồi"}
                          </span>
                        </div>

                        <div>
                          <div className="font-bold text-slate-800 text-sm">{msg.title}</div>
                          <p className="text-slate-600 mt-1 line-clamp-3 leading-relaxed">
                            {msg.content}
                          </p>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1 border-t border-slate-200">
                          <span>Gửi bởi: {msg.senderName}</span>
                          <span>{new Date(msg.createdAt).toLocaleDateString("vi-VN")}</span>
                        </div>

                        {/* If Replied, show response box */}
                        {msg.reply && (
                          <div className="p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-emerald-950 space-y-1.5 mt-2">
                            <div className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
                              <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
                              {msg.repliedBy || "Thầy Bùi Kim Kỳ - Cố vấn"} phản hồi:
                            </div>
                            <p className="text-xs leading-relaxed text-slate-700 italic">
                              "{msg.reply}"
                            </p>
                            {msg.repliedAt && (
                              <div className="text-[10px] text-emerald-700 text-right">
                                {new Date(msg.repliedAt).toLocaleDateString("vi-VN")}
                              </div>
                            )}
                          </div>
                        )}

                        {/* If Teacher / Counselor and not yet replied */}
                        {isCounselorOrAdmin && (
                          <div className="pt-2 border-t border-slate-200 space-y-2">
                            <textarea
                              rows={2}
                              value={replyInput[msg.id] || ""}
                              onChange={(e) =>
                                setReplyInput((prev) => ({ ...prev, [msg.id]: e.target.value }))
                              }
                              placeholder="Nhập lời khuyên, động viên ân cần tới học sinh..."
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 outline-hidden resize-none"
                            />
                            <div className="flex items-center justify-between">
                              <button
                                onClick={() => deleteCounselingMessage(msg.id)}
                                className="text-rose-600 hover:text-rose-700 font-semibold text-[11px] inline-flex items-center gap-1"
                              >
                                <Trash2 className="w-3 h-3" /> Xóa thư
                              </button>
                              <button
                                onClick={() => handleReplyMessage(msg.id)}
                                className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl inline-flex items-center gap-1"
                              >
                                <Send className="w-3 h-3" /> Phản hồi học sinh
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Counselor Contact Profile */}
              <div className="bg-gradient-to-br from-teal-800 to-slate-900 text-white rounded-3xl p-5 border border-teal-600/30 space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=120&auto=format&fit=crop&q=80"
                    alt="Thầy Bùi Kim Kỳ"
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-white">Thầy Bùi Kim Kỳ</h4>
                    <p className="text-xs text-emerald-300">Cố Vấn Tâm Lý Học Đường - THCS Đề Thám</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "Không có vấn đề nào của các em là nhỏ bé. Thầy luôn sẵn sàng lắng nghe và đồng hành để mỗi ngày đến trường của các em đều là một ngày vui trọn vẹn."
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📚 SUB-TAB 3: CẨM NANG SỨC KHỎE TINH THẦN */}
      {activeSubTab === "articles" && (
        <div className="space-y-6 animate-fadeIn">
          {/* Filter Pills */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {[
                { id: "all", label: "Tất cả cẩm nang" },
                { id: "học tập", label: "Áp lực học tập" },
                { id: "kỳ thi", label: "Lo lắng kỳ thi" },
                { id: "bạn bè", label: "Mâu thuẫn bạn bè" },
                { id: "mạng", label: "Bắt nạt mạng" },
                { id: "cảm xúc", label: "Kiểm soát cảm xúc" },
                { id: "tự tin", label: "Tự tin bản thân" },
                { id: "nghỉ ngơi", label: "Cân bằng & Nghỉ ngơi" },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setArticleFilter(f.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    articleFilter === f.id
                      ? "bg-teal-700 text-white border-teal-700 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-600 font-medium">
              Hiển thị {filteredArticles.length} cẩm nang tâm lý
            </span>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-400 transition-all cursor-pointer flex flex-col justify-between group p-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {art.category}
                    </span>
                    <span className="text-[11px] text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
                      {art.readTime}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-800 text-base group-hover:text-teal-700 transition-colors leading-snug">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {art.summary}
                  </p>

                  {/* Tips preview */}
                  <div className="space-y-1.5 pt-2">
                    {art.tips.slice(0, 2).map((tip, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
                  <span>Xem hướng dẫn chi tiết</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 🧘 SUB-TAB 4: THƯ GIÃN, BOX BREATHING & NHẬT KÝ */}
      {activeSubTab === "relax" && (
        <div className="space-y-8 animate-fadeIn">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Col: Interactive Box Breathing Exercise (6 cols) */}
            <div className="lg:col-span-6 bg-gradient-to-b from-teal-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-teal-700/30 shadow-xl flex flex-col items-center justify-between text-center min-h-[460px]">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-teal-200 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Wind className="w-3.5 h-3.5" /> Bài Tập Hít Thở 4-4-4 (Box Breathing)
                </div>
                <h3 className="text-xl font-bold text-white">
                  Giải Tỏa Căng Thẳng Trong 1 Phút
                </h3>
                <p className="text-xs text-teal-200 mt-1 max-w-sm">
                  Phương pháp thở hộp giúp làm dịu hệ thần kinh, giảm nhịp tim và cân bằng cảm xúc nhanh chóng.
                </p>
              </div>

              {/* Visual Breathing Bubble Animation */}
              <div className="relative my-8 flex items-center justify-center">
                <div
                  className={`w-48 h-48 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-1000 ${
                    breathingPhase === "inhale"
                      ? "scale-125 border-emerald-400 bg-emerald-500/20 shadow-lg shadow-emerald-500/30"
                      : breathingPhase === "hold"
                      ? "scale-125 border-amber-400 bg-amber-500/20 shadow-lg shadow-amber-500/30"
                      : breathingPhase === "exhale"
                      ? "scale-90 border-sky-400 bg-sky-500/20 shadow-lg shadow-sky-500/30"
                      : "scale-100 border-teal-400 bg-teal-500/20"
                  }`}
                >
                  <span className="text-4xl font-extrabold text-white mb-1">
                    {isBreathingActive ? breathCount : "Ready"}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-200">
                    {isBreathingActive
                      ? breathingPhase === "inhale"
                        ? "HÍT VÀO SÂU..."
                        : breathingPhase === "hold"
                        ? "GIỮ HƠI THỞ..."
                        : breathingPhase === "exhale"
                        ? "THỞ RA TỪ TỪ..."
                        : "THẢ LỎNG..."
                      : "Bắt đầu tập"}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="space-y-3 w-full max-w-xs">
                <button
                  onClick={() => setIsBreathingActive(!isBreathingActive)}
                  className={`w-full py-3 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                    isBreathingActive
                      ? "bg-rose-600 hover:bg-rose-700 text-white"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                  }`}
                >
                  {isBreathingActive ? (
                    <>
                      <Pause className="w-4 h-4" /> Tạm dừng bài tập
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" /> Bắt đầu bài tập thở (1-3 phút)
                    </>
                  )}
                </button>

                {breathingCycle > 0 && (
                  <div className="text-xs text-emerald-300 font-medium">
                    ✨ Bạn đã hoàn thành {breathingCycle} chu kỳ thở thư giãn!
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Ambient Sound Player & Emotion Journal (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              {/* Ambient Sound Synthesizer Player */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-teal-600" />
                    <h3 className="font-bold text-slate-800 text-base">
                      Âm Thanh Thư Giãn (Web Audio)
                    </h3>
                  </div>
                  {activeSound && (
                    <button
                      onClick={stopAmbientSound}
                      className="text-xs text-rose-600 font-bold inline-flex items-center gap-1 hover:underline"
                    >
                      <VolumeX className="w-3.5 h-3.5" /> Tắt âm thanh
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "rain", label: "Mưa Rơi Êm Dịu", icon: "🌧️", desc: "Tập trung & Ngủ ngon" },
                    { id: "waves", label: "Sóng Biển Vỗ Về", icon: "🌊", desc: "Giải tỏa căng thẳng" },
                    { id: "forest", label: "Tần Số 528Hz Bình An", icon: "🌲", desc: "Chữa lành cảm xúc" },
                    { id: "zen", label: "Thiền 432Hz Sâu Lắng", icon: "🧘", desc: "Tĩnh tâm & Sáng suốt" },
                  ].map((s) => {
                    const isPlaying = activeSound === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => toggleSound(s.id)}
                        className={`p-3.5 rounded-2xl border text-left transition-all ${
                          isPlaying
                            ? "bg-teal-700 text-white border-teal-700 shadow-sm"
                            : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-teal-50/50 hover:border-teal-300"
                        }`}
                      >
                        <div className="text-xl mb-1">{s.icon}</div>
                        <div className="font-bold text-xs">{s.label}</div>
                        <div className={`text-[11px] ${isPlaying ? "text-teal-200" : "text-slate-600"}`}>
                          {s.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Emotion Journal & Prompt */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-pink-500" />
                    <h3 className="font-bold text-slate-800 text-base">
                      Nhật Ký Cảm Xúc & Tự Phản Ánh
                    </h3>
                  </div>
                  <span className="text-xs text-teal-700 font-bold bg-teal-50 px-2.5 py-1 rounded-full">
                    +20 Điểm
                  </span>
                </div>

                {/* Prompt Carousel */}
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs">
                  <div className="font-bold text-amber-800 mb-1 flex items-center justify-between">
                    <span>💡 Câu hỏi gợi ý suy ngẫm:</span>
                    <button
                      onClick={() =>
                        setSelectedPromptIndex(
                          (prev) => (prev + 1) % SELF_REFLECTION_PROMPTS.length
                        )
                      }
                      className="text-amber-700 hover:text-amber-900 underline text-[11px]"
                    >
                      Đổi câu hỏi khác
                    </button>
                  </div>
                  <p className="text-slate-800 font-medium italic">
                    "{SELF_REFLECTION_PROMPTS[selectedPromptIndex]}"
                  </p>
                </div>

                <div className="space-y-3">
                  <textarea
                    rows={3}
                    value={journalContent}
                    onChange={(e) => setJournalContent(e.target.value)}
                    placeholder="Viết vài dòng chia sẻ suy nghĩ của bạn..."
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 outline-hidden resize-none"
                  />

                  <input
                    type="text"
                    value={journalGratitude}
                    onChange={(e) => setJournalGratitude(e.target.value)}
                    placeholder="1 điều em biết ơn hôm nay..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 outline-hidden"
                  />

                  <button
                    onClick={() => {
                      if (!journalContent.trim()) return;
                      addEmotionJournal({
                        title: "Ghi chép cảm xúc",
                        content: journalContent.trim(),
                        gratitude: journalGratitude.trim() || undefined,
                        reflectionPrompt: SELF_REFLECTION_PROMPTS[selectedPromptIndex],
                        date: new Date().toISOString().slice(0, 10),
                        moodEmoji: "🌱",
                        moodScore: selectedScore,
                      });
                      setJournalContent("");
                      setJournalGratitude("");
                    }}
                    className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-all shadow-xs"
                  >
                    Lưu Trang Nhật Ký Riêng Tư
                  </button>
                </div>

                {/* Saved Journals List */}
                {emotionJournals.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 space-y-2 max-h-36 overflow-y-auto">
                    <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                      Nhật ký đã lưu ({emotionJournals.length})
                    </div>
                    {emotionJournals.slice(0, 3).map((j) => (
                      <div
                        key={j.id}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                      >
                        <div className="line-clamp-1 text-slate-700 font-medium">
                          {j.content}
                        </div>
                        <button
                          onClick={() => deleteEmotionJournal(j.id)}
                          className="text-slate-600 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🤖 SUB-TAB 5: MINDCARE AI - TRỢ LÝ ĐỒNG HÀNH */}
      {activeSubTab === "ai_companion" && (
        <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-lg overflow-hidden flex flex-col h-[620px]">
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-sky-700 text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
                  <Bot className="w-6 h-6 text-emerald-200" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    MindCare AI
                    <span className="bg-emerald-400/20 text-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-semibold border border-emerald-300/30">
                      Sức Khỏe Tinh Thần
                    </span>
                  </h3>
                  <p className="text-xs text-emerald-100">
                    Trợ lý Lắng Nghe & Đồng Hành Tâm Lý Học Đường
                  </p>
                </div>
              </div>

              <div className="text-xs bg-white/10 px-3 py-1 rounded-full text-emerald-100 border border-white/15 hidden sm:inline-block">
                🔒 Hội thoại riêng tư
              </div>
            </div>

            {/* Chat Messages Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-teal-700 text-white rounded-br-xs shadow-md"
                        : "bg-white text-slate-800 rounded-bl-xs border border-slate-200 shadow-xs"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    <div
                      className={`text-[10px] mt-2 text-right ${
                        msg.role === "user" ? "text-teal-200" : "text-slate-600"
                      }`}
                    >
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}

              {isAiTyping && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-3xl p-4 rounded-bl-xs border border-slate-200 text-xs text-slate-600 flex items-center gap-2 shadow-xs">
                    <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]" />
                    <span>MindCare AI đang lắng nghe và suy ngẫm...</span>
                  </div>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="p-2.5 bg-slate-100 border-t border-slate-200 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
              <span className="text-[11px] font-bold text-slate-600 shrink-0">Gợi ý nhanh:</span>
              {[
                "Mình đang rất lo lắng về kỳ thi sắp tới",
                "Làm sao để giải quyết mâu thuẫn với bạn thân?",
                "Mình thấy bị quá tải vì nhiều bài tập",
                "Hướng dẫn mình bài tập thở 1 phút",
              ].map((chip, i) => (
                <button
                  key={i}
                  onClick={() => setChatInput(chip)}
                  className="px-3 py-1 rounded-full bg-white hover:bg-teal-50 text-slate-700 hover:text-teal-800 border border-slate-200 text-xs font-medium whitespace-nowrap transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendAiMessage()}
                placeholder="Nhập tâm sự hoặc câu hỏi của bạn..."
                className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-hidden"
              />
              <button
                onClick={handleSendAiMessage}
                disabled={!chatInput.trim() || isAiTyping}
                className="bg-teal-700 hover:bg-teal-800 text-white p-3 rounded-2xl font-bold shadow-md transition-all disabled:opacity-40"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🆘 SUB-TAB 6: HỖ TRỢ 3 CẤP ĐỘ & DANH BẠ KHẨN CẤP */}
      {activeSubTab === "sos" && (
        <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
          {/* 3-Tier Support Model */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900">
              Hệ Thống Hỗ Trợ Tâm Lý Học Đường 3 Cấp Độ
            </h2>
            <p className="text-slate-600 text-sm">
              Mô hình chuẩn khoa học giúp học sinh tiếp cận đúng nguồn hỗ trợ tương ứng với mức độ cảm xúc và tình huống thực tế.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cấp 1: Tự Chăm Sóc */}
            <div className="bg-white rounded-3xl p-6 border-2 border-emerald-300 shadow-sm space-y-4 relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-extrabold text-sm">
                CẤP 1
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Tự Chăm Sóc Cảm Xúc</h3>
                <p className="text-xs text-slate-600 mt-1">Dành cho căng thẳng nhẹ, mệt mỏi bài vở hàng ngày</p>
              </div>
              <ul className="text-xs text-slate-700 space-y-2 pt-2 border-t border-slate-100">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Thực hành bài tập thở Box Breathing 3 phút</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Đọc cẩm nang tâm lý & kỹ năng cảm xúc</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Viết nhật ký tự phản ánh và uống nước ấm</span>
                </li>
              </ul>
              <button
                onClick={() => setActiveSubTab("relax")}
                className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-bold text-xs hover:bg-emerald-100 transition-colors"
              >
                Vào Khu Thư Giãn →
              </button>
            </div>

            {/* Cấp 2: Cố Vấn Học Đường */}
            <div className="bg-white rounded-3xl p-6 border-2 border-teal-400 shadow-md space-y-4 relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-extrabold text-sm">
                CẤP 2
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Cố Vấn Tâm Lý Học Đường</h3>
                <p className="text-xs text-slate-600 mt-1">Dành cho lo âu kéo dài, áp lực thi cử, mâu thuẫn bạn bè</p>
              </div>
              <ul className="text-xs text-slate-700 space-y-2 pt-2 border-t border-slate-100">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Gửi thư tâm sự bí mật tới Thầy Bùi Kim Kỳ</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Gặp trực tiếp Thầy Cô tại Phòng Tư Vấn Học Đường</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Trò chuyện cùng Thầy Cô Chủ Nhiệm</span>
                </li>
              </ul>
              <button
                onClick={() => setActiveSubTab("counseling")}
                className="w-full py-2.5 rounded-xl bg-teal-700 text-white font-bold text-xs hover:bg-teal-800 transition-colors"
              >
                Gửi Thư Tâm Sự →
              </button>
            </div>

            {/* Cấp 3: Chuyên Gia & Hotline Quốc Gia */}
            <div className="bg-white rounded-3xl p-6 border-2 border-rose-400 shadow-sm space-y-4 relative overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center font-extrabold text-sm">
                CẤP 3
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Can Thiệp Chuyên Sâu</h3>
                <p className="text-xs text-slate-600 mt-1">Dành cho bạo lực học đường, khủng hoảng cảm xúc nặng</p>
              </div>
              <ul className="text-xs text-slate-700 space-y-2 pt-2 border-t border-slate-100">
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>Tổng đài Quốc Gia Bảo Vệ Trẻ Em <strong>111</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>Hotline Tư Vấn Tâm Lý Học Đường <strong>1900 6440</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>Chuyên gia tâm lý y khoa & Bệnh viện nhi</span>
                </li>
              </ul>
              <div className="bg-rose-50 text-rose-800 text-[11px] font-bold p-2 rounded-xl text-center">
                📞 Hotline 111 (Miễn phí 24/7)
              </div>
            </div>
          </div>

          {/* Emergency Hotline Contact Cards */}
          <div className="bg-gradient-to-r from-rose-600 to-rose-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <PhoneCall className="w-4 h-4 text-white animate-bounce" /> Tổng Đài Khẩn Cấp Miễn Cước
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                Tổng Đài Quốc Gia Bảo Vệ Trẻ Em: 111
              </h3>
              <p className="text-rose-100 text-xs sm:text-sm max-w-xl">
                Hoạt động 24/7 hoàn toàn miễn phí cuộc gọi. Dành cho mọi học sinh, cha mẹ và thầy cô khi gặp nguy cơ bạo lực học đường, xâm hại, hoặc khủng hoảng tâm lý nghiêm trọng.
              </p>
            </div>

            <div className="flex flex-col gap-3 shrink-0 w-full sm:w-auto">
              <a
                href="tel:111"
                className="bg-white text-rose-800 hover:bg-rose-50 px-6 py-3 rounded-2xl font-black text-center text-sm shadow-md transition-all"
              >
                📞 Gọi Ngay 111
              </a>
              <a
                href="tel:19006440"
                className="bg-rose-900/50 hover:bg-rose-900/70 border border-white/30 text-white px-6 py-2.5 rounded-2xl font-bold text-center text-xs transition-all"
              >
                Hotline Tâm Lý: 1900 6440
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 📖 ARTICLE DETAIL MODAL */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200">
            <div className="p-6 sm:p-8 border-b border-slate-100 flex items-start justify-between gap-4 bg-gradient-to-r from-teal-50 to-emerald-50">
              <div className="space-y-1">
                <span className="text-xs font-bold text-teal-800 bg-teal-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {selectedArticle.category} • {selectedArticle.readTime}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                  {selectedArticle.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-slate-100 transition-colors shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-slate-800 text-sm leading-relaxed">
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 font-medium text-teal-900 text-sm">
                📌 {selectedArticle.summary}
              </div>

              {/* Tips */}
              <div className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Lời khuyên thực hành ngay:
                </h4>
                <ul className="space-y-2">
                  {selectedArticle.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center shrink-0 font-bold text-[10px]">
                        {idx + 1}
                      </span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Full Content */}
              <div className="space-y-4 whitespace-pre-wrap text-slate-700 text-xs sm:text-sm leading-relaxed">
                {selectedArticle.content}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-600">
                <span>Cố Vấn Tâm Lý Học Đường THCS Đề Thám</span>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="bg-teal-700 text-white px-5 py-2 rounded-xl font-bold text-xs hover:bg-teal-800 transition-colors"
                >
                  Đã hiểu
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
