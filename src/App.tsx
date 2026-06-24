import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Flame,
  Timer,
  Search,
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  RotateCcw,
  Play,
  Pause,
  Utensils,
  Sparkles,
  Check,
  Volume2,
  X,
  ChefHat,
  Info,
  Users,
  BookOpen,
  MessageSquare,
  Send,
} from "lucide-react";
import { recipesData } from "./recipesData";
import { Recipe, Ingredient } from "./types";

interface ChatMessage {
  id: string;
  role: "user" | "chef";
  content: string;
  timestamp: Date;
}

export default function App() {
  // Recipes state
  const [recipes] = useState<Recipe[]>(recipesData);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>("kimchi-jjigae");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  
  // Customization state for current recipe
  const [currentServings, setCurrentServings] = useState<number>(2);
  const [selectedVariationId, setSelectedVariationId] = useState<string>("pork");
  const [preparedIngredients, setPreparedIngredients] = useState<Record<string, boolean>>({});

  // Active cooking mode overlay state
  const [isCookMode, setIsCookMode] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number | null>(null);
  const [timerIsRunning, setTimerIsRunning] = useState<boolean>(false);
  const [lastChimedStepIndex, setLastChimedStepIndex] = useState<number | null>(null);

  // Chatbot states
  const [chatOpen, setChatOpen] = useState<boolean>(false);
  const [chatInput, setChatInput] = useState<boolean | string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "chef",
      content: "안녕하세요! 따뜻한 한식 조리법의 AI 동반자 '온정 한식 셰프'입니다. 🧑‍🍳\n\n한식 요리에 필요한 계량 팁, 재료 보관법, 혹은 요리 중 생기는 돌발 상황이나 대체 재료에 대해 무엇이든 편하게 물어보세요! 신김치가 너무 시거나, 매운맛을 줄이고 싶을 때도 해결해 드릴게요.",
      timestamp: new Date(),
    },
  ]);
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  // Ref for chat scrolling
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Get active recipe
  const activeRecipe = recipes.find((r) => r.id === selectedRecipeId) || recipes[0];

  // Selected recipe ingredients (takes variation into account)
  const currentIngredients =
    activeRecipe.variations && activeRecipe.id === "kimchi-jjigae"
      ? activeRecipe.variations.find((v) => v.id === selectedVariationId)?.ingredients || activeRecipe.ingredients
      : activeRecipe.ingredients;

  // Reset page parameters when changing active recipe
  useEffect(() => {
    setCurrentServings(activeRecipe.baseServings);
    setPreparedIngredients({});
    if (activeRecipe.id === "kimchi-jjigae") {
      setSelectedVariationId("pork");
    }
  }, [selectedRecipeId, activeRecipe]);

  // Handle ingredient prepared toggles
  const togglePrepared = (ingName: string) => {
    setPreparedIngredients((prev) => ({
      ...prev,
      [ingName]: !prev[ingName],
    }));
  };

  // Sound chime synthesizer (Web Audio API)
  const playTimerChime = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const now = audioCtx.currentTime;

      // Bell 1 (low warm gong)
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(440, now); // A4
      osc1.frequency.exponentialRampToValueAtTime(220, now + 1.5);
      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);

      // Bell 2 (high crystal ring)
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(880, now); // A5
      osc2.frequency.exponentialRampToValueAtTime(440, now + 1.2);
      gain2.gain.setValueAtTime(0.15, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.5);
      osc2.stop(now + 1.5);
    } catch (e) {
      console.warn("Audio Context is blocked or not supported on this browser.", e);
    }
  };

  // Timer logic for Cook Mode
  useEffect(() => {
    let interval: any = null;
    if (timerIsRunning && timerSecondsLeft !== null && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (timerSecondsLeft === 0) {
      setTimerIsRunning(false);
      // Play chime only once per step when it hits zero
      if (lastChimedStepIndex !== activeStepIndex) {
        playTimerChime();
        setLastChimedStepIndex(activeStepIndex);
      }
    }
    return () => clearInterval(interval);
  }, [timerIsRunning, timerSecondsLeft, activeStepIndex, lastChimedStepIndex]);

  // Set initial timer value when switching step in Cook Mode
  useEffect(() => {
    const step = activeRecipe.steps[activeStepIndex];
    if (step && step.durationSec) {
      setTimerSecondsLeft(step.durationSec);
      setTimerIsRunning(false);
    } else {
      setTimerSecondsLeft(null);
      setTimerIsRunning(false);
    }
  }, [activeStepIndex, activeRecipe]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatOpen, chatLoading]);

  // Keyboard navigation for Cook Mode steps
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isCookMode) return;
      if (e.key === "ArrowLeft") {
        setActiveStepIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        setActiveStepIndex((prev) => Math.min(activeRecipe.steps.length - 1, prev + 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCookMode, activeRecipe]);

  // Format ingredient quantities beautifully
  const formatAmount = (baseAmount: number, baseServings: number, currentServings: number) => {
    const scaled = (baseAmount / baseServings) * currentServings;
    if (Number.isInteger(scaled)) {
      return scaled.toString();
    }
    return scaled.toFixed(1).replace(/\.0$/, "");
  };

  // Calculate overall preparation checklist progress
  const totalIngredientsCount = currentIngredients.length;
  const preparedCount = currentIngredients.filter((i) => preparedIngredients[i.name]).length;
  const prepPercentage = totalIngredientsCount > 0 ? Math.round((preparedCount / totalIngredientsCount) * 100) : 0;

  // Filter recipes based on category and search query
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesCategory = selectedCategory === "전체" || recipe.category === selectedCategory;
    const matchesSearch =
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.engName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Unique recipe categories
  const categories = ["전체", "찌개 / 국", "고기 요리", "밥 요리", "스낵 / 분식"];

  // Open cook mode
  const startCooking = () => {
    setActiveStepIndex(0);
    setLastChimedStepIndex(null);
    setIsCookMode(true);
  };

  // Ask AI Assistant (Send to backend `/api/chat`)
  const sendChatMessage = async (text: string) => {
    if (!text.trim() || chatLoading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setChatLoading(true);

    try {
      // Map to server payload format
      const history = chatMessages.slice(-8).map((m) => ({
        role: m.role === "user" ? "user" : "model",
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
          history: history,
        }),
      });

      if (!res.ok) {
        throw new Error("서버 응답 오류가 발생했습니다.");
      }

      const data = await res.json();
      const chefMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "chef",
        content: data.reply || "죄송합니다, 잠시 요리 지식을 떠올리는 중 막혔습니다. 다시 한번 여쭤봐 주시겠어요?",
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, chefMsg]);
    } catch (e: any) {
      const errorMsg: ChatMessage = {
        id: Math.random().toString(),
        role: "chef",
        content: `앗, 국물이 끓어넘치는 바람에 연결이 끊겼습니다! 😅 (에러: ${e.message || "연결 실패"}). 비서 상태를 점검해 보세요.`,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMsg]);
    } finally {
      setChatLoading(false);
    }
  };

  // Handle timer format display MM:SS
  const formatTimerTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Custom simple parser to format chat markdown text to html safely
  const formatChefText = (text: string) => {
    return text.split("\n").map((line, i) => {
      // Handle simple lists (bullet points)
      if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
        const content = line.replace(/^[-*]\s+/, "");
        return (
          <li key={i} className="ml-4 list-disc mb-1 leading-relaxed text-sm">
            {formatBoldText(content)}
          </li>
        );
      }
      // Handle simple numbered lists
      const numMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        const content = numMatch[2];
        return (
          <li key={i} className="ml-5 list-decimal mb-1 leading-relaxed text-sm">
            {formatBoldText(content)}
          </li>
        );
      }
      // Default paragraphs
      return (
        <p key={i} className="mb-2 leading-relaxed text-sm">
          {formatBoldText(line)}
        </p>
      );
    });
  };

  // Helper to format text wrapped in **bold**
  const formatBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index} className="font-semibold text-rose-950">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-[#FBF9F6] text-[#2C2621] font-sans flex flex-col antialiased">
      {/* Elegantly Polished Top Nav Bar */}
      <header className="border-b border-[#E8DFD3] bg-[#FAF5EE] sticky top-0 z-10 px-4 py-3.5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#9E2A2B] flex items-center justify-center text-white shadow-sm">
            <ChefHat className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#3A1415]">
              한식 조리법 <span className="font-sans font-normal text-sm text-[#7D6C5E] ml-1.5 sm:inline block">정성과 전통을 담은 밥상</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Helper Toggle Button */}
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium shadow-xs transition-all duration-300 ${
              chatOpen
                ? "bg-[#9E2A2B] text-white hover:bg-[#852324]"
                : "bg-white text-[#5C4D41] border border-[#E0D5C6] hover:bg-[#FAF6F0]"
            }`}
          >
            <Sparkles className={`w-4 h-4 ${chatOpen ? "animate-pulse" : "text-[#9E2A2B]"}`} />
            <span>온정 AI 요리비서 {chatOpen ? "닫기" : "열기"}</span>
          </button>
        </div>
      </header>

      {/* Main Content Layout with sidebar and active area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Recipe Explorer Panel (col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white border border-[#E8DFD3] rounded-2xl p-5 shadow-xs">
            <h2 className="font-serif text-lg font-bold text-[#422213] mb-4 flex items-center gap-2">
              <BookOpen className="w-4.5 h-4.5 text-[#9E2A2B]" />
              요리 책방
            </h2>

            {/* Custom Search Box */}
            <div className="relative mb-5">
              <Search className="w-4.5 h-4.5 text-[#8C7A6B] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="조리법 이름이나 태그 검색..."
                className="w-full bg-[#FAF7F2] border border-[#E2D6C5] rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#9E2A2B]/20 focus:border-[#9E2A2B] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7A6B] hover:text-black"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Categories horizontal scroll pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-3 mb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? "bg-[#9E2A2B] text-white"
                      : "bg-[#FAF7F2] text-[#6E5D4F] border border-[#EAE1D4] hover:bg-[#F5EDE0]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Recipes Card List */}
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[600px] pr-1">
            {filteredRecipes.length > 0 ? (
              filteredRecipes.map((recipe) => {
                const isActive = recipe.id === selectedRecipeId;
                const isKimchi = recipe.id === "kimchi-jjigae";

                return (
                  <motion.div
                    key={recipe.id}
                    layoutId={`recipe-card-${recipe.id}`}
                    onClick={() => setSelectedRecipeId(recipe.id)}
                    className={`group cursor-pointer rounded-2xl p-4.5 transition-all border ${
                      isActive
                        ? "bg-[#FAF5EE] border-[#CBB89D] shadow-sm ring-1 ring-[#CBB89D]/40"
                        : "bg-white border-[#E8DFD3] shadow-xs hover:shadow-sm hover:border-[#D0C2AE]"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2 mb-1.5">
                      <div>
                        <span className="text-[11px] font-medium tracking-wide text-[#9E2A2B] uppercase bg-[#9E2A2B]/10 px-2 py-0.5 rounded-sm">
                          {recipe.category}
                        </span>
                        <h3 className="font-serif text-lg font-bold text-[#3E2715] mt-1 group-hover:text-[#9E2A2B] transition-colors">
                          {recipe.name}
                        </h3>
                        <p className="text-[11px] text-[#8C7A6B] font-mono tracking-wide">
                          {recipe.engName}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            recipe.difficulty === "쉬움"
                              ? "bg-emerald-100 text-emerald-800"
                              : recipe.difficulty === "보통"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          난이도 {recipe.difficulty}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-[#8C7A6B]">
                          <Timer className="w-3.5 h-3.5" />
                          <span>{recipe.prepTimeMin + recipe.cookTimeMin}분</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-[#6B5A4B] line-clamp-2 leading-relaxed mb-3">
                      {recipe.description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {recipe.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] bg-[#F2EDE4] text-[#5C4B3E] px-2 py-0.5 rounded-md"
                        >
                          #{tag}
                        </span>
                      ))}
                      {isKimchi && (
                        <span className="text-[10px] bg-[#9E2A2B]/10 text-[#9E2A2B] font-medium px-2 py-0.5 rounded-md border border-[#9E2A2B]/20">
                          ✨ 3가지 버젼 가능
                        </span>
                      )}
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-white border border-[#E8DFD3] rounded-2xl">
                <ChefHat className="w-10 h-10 text-[#C4B4A2] mx-auto mb-3" />
                <p className="text-[#8C7A6B] text-sm">조건에 맞는 조리법이 없습니다.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("전체");
                  }}
                  className="text-[#9E2A2B] hover:underline text-xs mt-1.5 font-medium"
                >
                  필터 초기화하기
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Active Recipe Details Panel (col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRecipe.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-[#E8DFD3] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col gap-6"
            >
              {/* Recipe Meta Banner */}
              <div className="border-b border-[#F0EAE1] pb-6">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-semibold bg-[#9E2A2B] text-white px-3 py-1 rounded-full">
                    {activeRecipe.category}
                  </span>
                  {activeRecipe.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-[#7A6451] bg-[#FAF6F0] px-2.5 py-0.5 rounded-full border border-[#EDE4D8]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mt-3">
                  <div>
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#33180D] tracking-tight">
                      {activeRecipe.name}
                    </h2>
                    <p className="font-mono text-sm tracking-wide text-[#7A6451] mt-1 uppercase">
                      {activeRecipe.engName}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-sm mt-3 sm:mt-0">
                    <div className="flex flex-col items-center px-4 py-2 bg-[#FAF6F0] border border-[#EADFCF] rounded-xl text-center min-w-[70px]">
                      <span className="text-[10px] text-[#8C7A6B] font-medium uppercase">난이도</span>
                      <span className="font-bold text-sm text-[#3E2312]">{activeRecipe.difficulty}</span>
                    </div>
                    <div className="flex flex-col items-center px-4 py-2 bg-[#FAF6F0] border border-[#EADFCF] rounded-xl text-center min-w-[70px]">
                      <span className="text-[10px] text-[#8C7A6B] font-medium uppercase">준비시간</span>
                      <span className="font-bold text-sm text-[#3E2312]">{activeRecipe.prepTimeMin}분</span>
                    </div>
                    <div className="flex flex-col items-center px-4 py-2 bg-[#FAF6F0] border border-[#EADFCF] rounded-xl text-center min-w-[70px]">
                      <span className="text-[10px] text-[#8C7A6B] font-medium uppercase">조리시간</span>
                      <span className="font-bold text-sm text-[#3E2312]">{activeRecipe.cookTimeMin}분</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm sm:text-base text-[#57473A] leading-relaxed mt-4 font-serif">
                  {activeRecipe.description}
                </p>
              </div>

              {/* Dynamic Interactive Variation Selectors (specifically for Kimchi Jjigae) */}
              {activeRecipe.id === "kimchi-jjigae" && activeRecipe.variations && (
                <div className="bg-[#FAF7F2] border border-[#EBDCC5] rounded-2xl p-4">
                  <h4 className="text-xs font-bold text-[#6B4E38] tracking-wider uppercase mb-3 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-[#9E2A2B]" />
                    조리 버젼 선택 (Variations)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {activeRecipe.variations.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => {
                          setSelectedVariationId(v.id);
                          setPreparedIngredients({});
                        }}
                        className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                          selectedVariationId === v.id
                            ? "bg-white border-[#9E2A2B] shadow-xs ring-1 ring-[#9E2A2B]/40"
                            : "bg-[#FDFCF9] border-[#E8DCCB] hover:border-[#D5C4AD] hover:bg-white"
                        }`}
                      >
                        <div>
                          <h5 className="font-serif text-sm font-bold text-[#3E2312] flex items-center gap-1.5">
                            {selectedVariationId === v.id && (
                              <div className="w-1.5 h-1.5 rounded-full bg-[#9E2A2B]" />
                            )}
                            {v.name}
                          </h5>
                          <p className="text-[11px] text-[#7A6451] leading-relaxed mt-1">
                            {v.description}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Dynamic Portions Calculator */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F7F2EB] px-5 py-4 rounded-2xl border border-[#E3D6C5]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#9E2A2B]/10 flex items-center justify-center text-[#9E2A2B]">
                    <Users className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#3E2312]">기준 인원 조절</h4>
                    <p className="text-xs text-[#7A6451]">인원수 증감 시 필요한 재료의 무게가 자동 조절됩니다.</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 bg-white border border-[#DDD0C0] rounded-xl px-2 py-1 shadow-2xs self-start sm:self-center">
                  <button
                    disabled={currentServings <= 1}
                    onClick={() => {
                      setCurrentServings(currentServings - 1);
                      setPreparedIngredients({});
                    }}
                    className="w-8 h-8 rounded-lg text-lg font-bold flex items-center justify-center hover:bg-[#FAF6F0] disabled:opacity-35 transition-colors"
                  >
                    -
                  </button>
                  <span className="font-mono text-base font-bold text-center px-4 min-w-[40px]">
                    {currentServings}인분
                  </span>
                  <button
                    disabled={currentServings >= 10}
                    onClick={() => {
                      setCurrentServings(currentServings + 1);
                      setPreparedIngredients({});
                    }}
                    className="w-8 h-8 rounded-lg text-lg font-bold flex items-center justify-center hover:bg-[#FAF6F0] disabled:opacity-35 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Ingredients Panels split into categories with preparational checklist */}
              <div className="bg-[#FCFAF7] border border-[#E8DFD3] rounded-2xl p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4.5 border-b border-[#F0EAE1] pb-3">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#3E2312] flex items-center gap-2">
                      <Utensils className="w-4.5 h-4.5 text-[#9E2A2B]" />
                      재료 준비하기
                    </h3>
                    <p className="text-xs text-[#8C7A6B] mt-0.5">준비된 재료를 선택하여 사전 정리를 체크해보세요.</p>
                  </div>

                  {/* Progress Tracker Bar */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-[#8C7A6B]">
                      준비도: {preparedCount}/{totalIngredientsCount} ({prepPercentage}%)
                    </span>
                    <div className="w-24 sm:w-32 bg-[#EADECB] h-2 rounded-full overflow-hidden">
                      <motion.div
                        className="bg-[#9E2A2B] h-full"
                        animate={{ width: `${prepPercentage}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {(["주재료", "부재료", "양념", "육수"] as const).map((cat) => {
                    const categorizedIng = currentIngredients.filter((i) => i.category === cat);
                    if (categorizedIng.length === 0) return null;

                    return (
                      <div key={cat} className="flex flex-col gap-2">
                        <h4 className="text-xs font-extrabold text-[#7A6451] tracking-wider uppercase border-l-2 border-[#9E2A2B] pl-2 mb-1.5">
                          {cat}
                        </h4>
                        <div className="flex flex-col gap-1.5">
                          {categorizedIng.map((ing) => {
                            const isChecked = !!preparedIngredients[ing.name];
                            return (
                              <div
                                key={ing.name}
                                onClick={() => togglePrepared(ing.name)}
                                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                                  isChecked
                                    ? "bg-[#FAF5EE] text-[#8C7A6B] line-through decoration-[#B8A290]"
                                    : "hover:bg-[#FAF6F0]"
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className={`w-4.5 h-4.5 rounded-md flex items-center justify-center transition-all border ${
                                      isChecked
                                        ? "bg-[#9E2A2B] border-[#9E2A2B] text-white"
                                        : "border-[#CBBCA9] bg-white group-hover:border-[#9E2A2B]"
                                    }`}
                                  >
                                    {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                  </div>
                                  <span className="text-sm font-medium">{ing.name}</span>
                                </div>

                                <span className="text-sm font-mono text-[#5C4D41] bg-[#FAF5EE]/40 px-2 py-0.5 rounded-sm">
                                  {formatAmount(ing.baseAmount, activeRecipe.baseServings, currentServings)}
                                  {ing.unit}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cook Mode Trigger Panel */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-amber-50/20 border border-[#9E2A2B]/15 rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#9E2A2B] text-white flex items-center justify-center shadow-xs">
                    <Flame className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-bold text-[#3E2312]">
                      스마트 요리 가이드 실행하기
                    </h3>
                    <p className="text-xs text-[#7A6451] mt-0.5">
                      큰 폰트 크기, 단계별 시간 카운트다운 및 완성 알림 소리를 제공하는 주방 전용 모드입니다.
                    </p>
                  </div>
                </div>

                <button
                  onClick={startCooking}
                  className="w-full sm:w-auto bg-[#9E2A2B] hover:bg-[#852324] text-white font-medium text-sm px-6 py-3 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white text-white" />
                  요리 시작하기 (Cook Mode)
                </button>
              </div>

              {/* Collapsible Cooking Tips Section */}
              <div className="border-t border-[#F0EAE1] pt-6">
                <h3 className="font-serif text-lg font-bold text-[#3E2312] mb-3 flex items-center gap-2">
                  <Info className="w-4.5 h-4.5 text-[#4F6D65]" />
                  셰프의 요리 비결 (Tips)
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {activeRecipe.tips.map((tip, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-[#5C4D41] leading-relaxed bg-[#F7F9F8] border-l-3 border-[#4F6D65] p-3.5 rounded-r-xl"
                    >
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Floating Kitchen Chatbot / Panel (AI Assistant) */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        <AnimatePresence>
          {chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="bg-white border border-[#E2D6C5] rounded-2xl w-[350px] sm:w-[420px] max-w-[90vw] h-[520px] shadow-2xl flex flex-col mb-4 overflow-hidden"
            >
              {/* Chat Header */}
              <div className="bg-[#9E2A2B] text-white px-4 py-4 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8.5 h-8.5 rounded-full bg-white/10 flex items-center justify-center">
                    <ChefHat className="w-4.5 h-4.5 text-amber-100" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm leading-tight">온정 한식 AI 셰프</h3>
                    <p className="text-[10px] text-amber-100 opacity-90">요리법 물어보기 · 대체재 추천</p>
                  </div>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 bg-[#FBF9F6] flex flex-col gap-3.5">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {msg.role === "chef" && (
                      <div className="w-8 h-8 rounded-full bg-[#9E2A2B]/10 text-[#9E2A2B] flex items-center justify-center shrink-0 border border-[#9E2A2B]/20">
                        <ChefHat className="w-4 h-4" />
                      </div>
                    )}
                    <div
                      className={`max-w-[78%] rounded-2xl p-3.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[#9E2A2B] text-white rounded-tr-none"
                          : "bg-white text-[#3E2D1F] border border-[#ECE0D0] rounded-tl-none shadow-2xs"
                      }`}
                    >
                      {msg.role === "chef" ? (
                        <div className="flex flex-col">{formatChefText(msg.content)}</div>
                      ) : (
                        <p>{msg.content}</p>
                      )}
                      <span
                        className={`text-[9px] block text-right mt-1.5 opacity-60 ${
                          msg.role === "user" ? "text-rose-100" : "text-[#8C7A6B]"
                        }`}
                      >
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                ))}

                {chatLoading && (
                  <div className="flex gap-2.5 flex-row">
                    <div className="w-8 h-8 rounded-full bg-[#9E2A2B]/10 text-[#9E2A2B] flex items-center justify-center shrink-0">
                      <ChefHat className="w-4 h-4 animate-bounce" />
                    </div>
                    <div className="bg-white border border-[#ECE0D0] rounded-2xl rounded-tl-none p-3.5 text-sm shadow-2xs flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#9E2A2B] animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-[#9E2A2B] animate-bounce [animation-delay:0.2s]" />
                      <span className="w-2 h-2 rounded-full bg-[#9E2A2B] animate-bounce [animation-delay:0.4s]" />
                      <span className="text-xs text-[#8C7A6B] ml-1">가장 알맞은 비결을 떠올리는 중...</span>
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Prebaked Quick Chips Questions */}
              <div className="px-3 py-2 bg-[#FAF6F0] border-t border-[#EFE5D9] flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
                {[
                  "김치찌개 신맛 없애는 법은?",
                  "스팸이나 돼지고기 대신 참치 넣는 순서?",
                  "된장찌개 뚝배기 없이도 맛있나요?",
                  "불고기 재울 때 키위는 안 되나요?",
                ].map((q) => (
                  <button
                    key={q}
                    onClick={() => sendChatMessage(q)}
                    className="text-[11px] bg-white border border-[#E5D7C6] text-[#6E5945] rounded-full px-3 py-1.5 whitespace-nowrap hover:border-[#9E2A2B] hover:bg-[#FAF5EE] transition-all cursor-pointer shrink-0"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (typeof chatInput === "string") sendChatMessage(chatInput);
                }}
                className="p-3 border-t border-[#EFE5D9] bg-white flex items-center gap-2 shrink-0"
              >
                <input
                  type="text"
                  value={typeof chatInput === "string" ? chatInput : ""}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="셰프에게 질문해 보세요 (예: 쌀뜨물 대신 생수는?)"
                  className="flex-1 bg-[#FAF8F5] border border-[#DDD0C0] rounded-xl px-3.5 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#9E2A2B]/20 focus:border-[#9E2A2B]"
                />
                <button
                  type="submit"
                  disabled={!chatInput || chatLoading}
                  className="w-10 h-10 rounded-xl bg-[#9E2A2B] hover:bg-[#852324] text-white flex items-center justify-center transition-colors disabled:opacity-40 shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Chat Floating Circle */}
        {!chatOpen && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setChatOpen(true)}
            className="w-14 h-14 rounded-full bg-[#9E2A2B] hover:bg-[#852324] text-white flex items-center justify-center shadow-2xl relative cursor-pointer"
          >
            <MessageSquare className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[9px] text-white items-center justify-center font-bold">
                AI
              </span>
            </span>
          </motion.button>
        )}
      </div>

      {/* Immersive Kitchen "Cook Mode" Full Screen Overlay */}
      <AnimatePresence>
        {isCookMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#1F1914] text-[#F3ECE4] z-50 flex flex-col justify-between overflow-hidden"
          >
            {/* Overlay Header */}
            <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0 bg-[#2C231B]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#9E2A2B] flex items-center justify-center text-white">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-amber-100">
                    스마트 쿡가이드: {activeRecipe.name}
                  </h3>
                  <p className="text-[11px] text-white/50">
                    {activeRecipe.id === "kimchi-jjigae"
                      ? `${activeRecipe.variations?.find((v) => v.id === selectedVariationId)?.name} · ${currentServings}인분`
                      : `${currentServings}인분`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCookMode(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 hover:text-white transition-colors text-xs font-medium cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                가이드 종료
              </button>
            </header>

            {/* Step Content Stage */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-6 max-w-4xl w-full mx-auto">
              <div className="w-full text-center mb-4">
                <span className="font-mono text-sm tracking-widest text-[#9E2A2B] font-bold uppercase bg-[#9E2A2B]/15 border border-[#9E2A2B]/40 px-3.5 py-1 rounded-full inline-block">
                  단계 {activeStepIndex + 1} / {activeRecipe.steps.length}
                </span>
              </div>

              {/* Big Step Instruction Box */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeStepIndex}
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.25 }}
                  className="w-full text-center flex flex-col items-center justify-center"
                >
                  <h2 className="font-serif text-2xl sm:text-4xl font-semibold leading-relaxed tracking-tight max-w-3xl text-amber-50">
                    {activeRecipe.steps[activeStepIndex]?.instruction}
                  </h2>

                  {/* Estimated Step Timer */}
                  {timerSecondsLeft !== null && (
                    <div className="mt-8 flex flex-col items-center gap-3">
                      <div className="relative flex items-center justify-center w-40 h-40">
                        {/* Circle Progress Frame */}
                        <svg className="absolute w-full h-full rotate-270" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="44"
                            stroke="#362C23"
                            strokeWidth="4"
                            fill="transparent"
                          />
                          <motion.circle
                            cx="50"
                            cy="50"
                            r="44"
                            stroke="#9E2A2B"
                            strokeWidth="4"
                            fill="transparent"
                            strokeDasharray="276.46"
                            animate={{
                              strokeDashoffset:
                                276.46 -
                                (276.46 * (timerSecondsLeft || 0)) /
                                  (activeRecipe.steps[activeStepIndex]?.durationSec || 1),
                            }}
                            transition={{ duration: 0.5, ease: "linear" }}
                          />
                        </svg>

                        {/* Numeric Timer Code */}
                        <div className="flex flex-col items-center z-10">
                          <span className="font-mono text-3xl sm:text-4xl font-extrabold tracking-wider text-amber-50">
                            {formatTimerTime(timerSecondsLeft)}
                          </span>
                          <span className="text-[10px] text-white/50 uppercase mt-1 tracking-wider">
                            권장 소요시간
                          </span>
                        </div>
                      </div>

                      {/* Timer Play / Pause Controls */}
                      <div className="flex items-center gap-3 mt-1">
                        <button
                          onClick={() => {
                            const step = activeRecipe.steps[activeStepIndex];
                            if (step && step.durationSec) {
                              setTimerSecondsLeft(step.durationSec);
                              setTimerIsRunning(false);
                            }
                          }}
                          className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                          title="시간 초기화"
                        >
                          <RotateCcw className="w-4.5 h-4.5" />
                        </button>

                        <button
                          onClick={() => setTimerIsRunning(!timerIsRunning)}
                          className={`px-5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                            timerIsRunning
                              ? "bg-amber-100 text-amber-950 hover:bg-amber-200"
                              : "bg-[#9E2A2B] text-white hover:bg-[#852324]"
                          }`}
                        >
                          {timerIsRunning ? (
                            <>
                              <Pause className="w-4 h-4 fill-current" />
                              일시정지
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 fill-current" />
                              시작
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Chef Tip Card inside overlay */}
                  {activeRecipe.steps[activeStepIndex]?.tip && (
                    <div className="mt-8 bg-[#2C231B] border border-[#443629] rounded-2xl p-5 max-w-xl text-left shadow-lg">
                      <h4 className="text-xs font-bold text-amber-200 uppercase tracking-widest flex items-center gap-2 mb-1.5">
                        <Info className="w-4 h-4 text-emerald-400" />
                        비결 코칭 (Step Tip)
                      </h4>
                      <p className="text-sm text-white/80 leading-relaxed font-serif">
                        {activeRecipe.steps[activeStepIndex]?.tip}
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Keyboard Shortcuts and Step Nav Controls */}
            <footer className="px-6 py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 bg-[#2C231B]">
              <div className="text-[11px] text-white/40 font-mono sm:block hidden">
                💡 키보드 단축키 지원: 왼쪽 화살표 (이전 단계) / 오른쪽 화살표 (다음 단계)
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button
                  disabled={activeStepIndex === 0}
                  onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                  className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-30 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                  이전 단계
                </button>

                {activeStepIndex === activeRecipe.steps.length - 1 ? (
                  <button
                    onClick={() => setIsCookMode(false)}
                    className="flex-1 sm:flex-none px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Check className="w-5 h-5 stroke-[2.5]" />
                    조리 완성!
                  </button>
                ) : (
                  <button
                    onClick={() => setActiveStepIndex((prev) => Math.min(activeRecipe.steps.length - 1, prev + 1))}
                    className="flex-1 sm:flex-none px-8 py-3.5 rounded-xl bg-[#9E2A2B] hover:bg-[#852324] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    다음 단계
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
