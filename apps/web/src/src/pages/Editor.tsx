import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { EditorHeader } from "@/components/editor/EditorHeader";
import { ChatPanel } from "@/components/editor/ChatPanel";
import { SlideViewer } from "@/components/editor/SlideViewer";
import { BrandSettings } from "@/components/editor/BrandSettings";
import { ExportPPT } from "@/components/editor/ExportPPT";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Palette } from "lucide-react";
import { toast } from "sonner";
import { Slide } from "@/lib/slides/schema";
import { normalizeSlides } from "@/lib/slides/normalize";
import { createBrandTheme } from "@/lib/theme/theme";

type BrandSetting = {
  id: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  logo_url: string | null;
  heading_font?: string;
  body_font?: string;
  font_family?: string;
};

const Editor = () => {
  const [user, setUser] = useState<User | null>(null);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [presentationId, setPresentationId] = useState<string | null>(null);
  const [brandSettings, setBrandSettings] = useState<BrandSetting | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        if (!session?.user) {
          navigate("/auth");
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        navigate("/auth");
      } else {
        loadOrCreatePresentation(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadOrCreatePresentation = async (userId: string) => {
    try {
      // Try to load the most recent presentation
      const { data, error } = await supabase
        .from("presentations")
        .select("*, brand_settings(*)")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setPresentationId(data.id);
        // Normalize slides from legacy format if needed
        const rawSlides = (data.slides as any[]) || [];
        const normalizedSlides = normalizeSlides(rawSlides);
        setSlides(normalizedSlides);
        if (data.brand_settings) {
          setBrandSettings(data.brand_settings as any);
        }
      } else {
        // Create a new presentation
        const { data: newPresentation, error: createError } = await supabase
          .from("presentations")
          .insert({
            user_id: userId,
            title: "Untitled Presentation",
            slides: [],
          })
          .select()
          .single();

        if (createError) throw createError;
        setPresentationId(newPresentation.id);
      }
    } catch (error: any) {
      console.error("Error loading presentation:", error);
      toast.error("Failed to load presentation");
    }
  };

  const handleBrandSelected = async (brandId: string) => {
    if (!presentationId) return;

    try {
      // Load brand settings
      const { data: brand } = await supabase
        .from("brand_settings")
        .select("*")
        .eq("id", brandId)
        .single();

      if (brand) {
        setBrandSettings(brand as any);

        // Update presentation with brand
        await supabase
          .from("presentations")
          .update({ brand_settings_id: brandId })
          .eq("id", presentationId);
      }
    } catch (error) {
      console.error("Error applying brand:", error);
      toast.error("Failed to apply brand");
    }
  };

  const handleSlidesGenerated = async (newSlides: Slide[]) => {
    setSlides(newSlides);
    setCurrentSlideIndex(0);

    if (presentationId && user) {
      try {
        const { error } = await supabase
          .from("presentations")
          .update({ slides: newSlides })
          .eq("id", presentationId);

        if (error) throw error;
        toast.success("Presentation updated!");
      } catch (error: any) {
        console.error("Error saving slides:", error);
        toast.error("Failed to save slides");
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <EditorHeader onLogout={handleLogout}>
        <div className="flex gap-2">
          <ExportPPT
            slides={slides}
            presentationTitle="My Presentation"
            brandSettings={brandSettings || undefined}
          />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Palette className="w-4 h-4 mr-2" />
                Brand
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="overflow-y-auto">
              <BrandSettings userId={user.id} onBrandSelected={handleBrandSelected} />
            </SheetContent>
          </Sheet>
        </div>
      </EditorHeader>
      <div className="flex-1 flex overflow-hidden">
        <SlideViewer
          slides={slides}
          currentSlideIndex={currentSlideIndex}
          onSlideChange={setCurrentSlideIndex}
          brandSettings={brandSettings ? {
            ...brandSettings,
            theme: brandSettings ? createBrandTheme(
              brandSettings.primary_color,
              brandSettings.secondary_color,
              brandSettings.accent_color,
              brandSettings.heading_font || brandSettings.font_family || "Inter",
              brandSettings.body_font || brandSettings.font_family || "Inter",
              brandSettings.logo_url
            ) : undefined
          } : undefined}
        />
        <ChatPanel
          presentationId={presentationId}
          userId={user.id}
          onSlidesGenerated={handleSlidesGenerated}
        />
      </div>
    </div>
  );
};

export default Editor;
