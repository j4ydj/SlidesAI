import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Send, FileUp, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Slide } from "@/lib/slides/schema";
import { normalizeSlides } from "@/lib/slides/normalize";
import { validateSlides } from "@/lib/slides/validation";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatPanelProps = {
  presentationId: string | null;
  userId: string;
  onSlidesGenerated: (slides: Slide[]) => void;
};

export const ChatPanel = ({ presentationId, userId, onSlidesGenerated }: ChatPanelProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const streamChat = async (userMessage: string, action: string = "chat") => {
    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
    
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({
        messages: [...messages, { role: "user", content: userMessage }],
        action,
      }),
    });

    if (!resp.ok) {
      if (resp.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      if (resp.status === 402) {
        throw new Error("Payment required. Please add credits.");
      }
      throw new Error("Failed to start stream");
    }

    // For generate action, response is JSON not stream
    if (action === "generate") {
      const data = await resp.json();
      return JSON.stringify(data);
    }

    // For other actions, handle streaming
    if (!resp.body) throw new Error("No response body");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;
    let assistantContent = "";

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) {
            assistantContent += content;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last?.role === "assistant") {
                return prev.map((m, i) =>
                  i === prev.length - 1 ? { ...m, content: assistantContent } : m
                );
              }
              return [...prev, { role: "assistant", content: assistantContent }];
            });
          }
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    return assistantContent;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const isGenerateRequest = userMessage.toLowerCase().includes("generate") || 
                                userMessage.toLowerCase().includes("create presentation");
      
      const response = await streamChat(userMessage, isGenerateRequest ? "generate" : "chat");

      // Try to parse slides if it's a generation request
      if (isGenerateRequest) {
        try {
          console.log("Raw AI response:", response);
          const parsed = JSON.parse(response);
          const slidesData = parsed.slides || parsed;
          
          if (Array.isArray(slidesData) && slidesData.length > 0) {
            // Normalize and validate slides
            const normalizedSlides = normalizeSlides(slidesData);
            
            // Validate slide structure
            const validSlides = normalizedSlides.filter((slide) => {
              try {
                // Ensure slide has required fields
                return (
                  slide.title &&
                  slide.layout &&
                  slide.blocks &&
                  Array.isArray(slide.blocks) &&
                  slide.blocks.length > 0
                );
              } catch {
                return false;
              }
            });
            
            if (validSlides.length > 0) {
              // Further validate using Zod schema
              try {
                const validatedSlides = validateSlides(validSlides);
                onSlidesGenerated(validatedSlides);
                toast.success(`✨ Generated ${validatedSlides.length} slides!`);
                
                // Update message to be user-friendly
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastMsg = newMessages[newMessages.length - 1];
                  if (lastMsg?.role === "assistant") {
                    lastMsg.content = `✨ Created a ${validatedSlides.length}-slide presentation! Use the arrows below the preview to navigate through your slides.`;
                  }
                  return newMessages;
                });
              } catch (validationError) {
                console.error("Validation error:", validationError);
                // Still use slides even if validation fails (graceful degradation)
                onSlidesGenerated(validSlides);
                toast.success(`✨ Generated ${validSlides.length} slides!`);
              }
            } else {
              throw new Error("No valid slides found in response");
            }
          } else {
            throw new Error("Response is not an array of slides");
          }
        } catch (e) {
          console.error("Failed to parse slides:", e);
          console.error("Response was:", response);
          toast.error("Couldn't create slides. Try: 'Generate a presentation about [topic]'");
        }
      }

      // Save message to database
      if (presentationId) {
        await supabase.from("chat_messages").insert([
          { presentation_id: presentationId, user_id: userId, role: "user", content: userMessage },
          { presentation_id: presentationId, user_id: userId, role: "assistant", content: response },
        ]);
      }
    } catch (error: any) {
      console.error("Chat error:", error);
      toast.error(error.message || "Failed to send message");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-96 border-l border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          AI Assistant
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <Card className="p-4 bg-muted/30">
            <p className="text-sm font-medium mb-3">👋 Welcome! I can help you create presentations instantly.</p>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-semibold text-primary mb-2">🚀 Quick Start:</p>
                <p className="text-xs text-muted-foreground mb-2">
                  Just type: <span className="font-mono bg-background px-1 py-0.5 rounded">"Generate a presentation about [your topic]"</span>
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold mb-1">Example topics:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Renewable energy solutions</li>
                  <li>• AI in healthcare</li>
                  <li>• Startup growth strategies</li>
                  <li>• Climate change action</li>
                </ul>
              </div>
            </div>
          </Card>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground ml-8"
                : "bg-muted mr-8"
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}
        {isLoading && (
          <div className="bg-muted p-3 rounded-lg mr-8">
            <p className="text-sm text-muted-foreground">Thinking...</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex gap-2 mb-3">
          <Button variant="outline" size="sm" className="flex-1">
            <FileUp className="w-4 h-4 mr-2" />
            Upload Doc
          </Button>
        </div>
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI to generate or improve slides..."
            className="resize-none"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="icon">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
