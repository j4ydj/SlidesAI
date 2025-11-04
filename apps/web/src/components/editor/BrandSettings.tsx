import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Upload, Save, Palette } from "lucide-react";
import { DEFAULT_TYPOGRAPHY_SCALE } from "@/lib/theme/theme";

type BrandSetting = {
  id: string;
  name: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  font_family: string;
  heading_font?: string;
  body_font?: string;
  type_scale?: string; // JSON string
  palette_json?: string; // JSON string
};

type BrandSettingsProps = {
  userId: string;
  onBrandSelected: (brandId: string) => void;
};

export const BrandSettings = ({ userId, onBrandSelected }: BrandSettingsProps) => {
  const [brands, setBrands] = useState<BrandSetting[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newBrand, setNewBrand] = useState({
    name: "",
    primary_color: "#000000",
    secondary_color: "#666666",
    accent_color: "#0066cc",
    font_family: "Inter",
    heading_font: "Inter",
    body_font: "Inter",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  useEffect(() => {
    loadBrands();
  }, [userId]);

  const loadBrands = async () => {
    const { data, error } = await supabase
      .from("brand_settings")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load brand settings");
      return;
    }
    setBrands(data || []);
  };

  const handleLogoUpload = async (brandId: string): Promise<string | null> => {
    if (!logoFile) return null;

    const fileExt = logoFile.name.split(".").pop();
    const filePath = `${userId}/${brandId}/logo.${fileExt}`;

    const { error } = await supabase.storage
      .from("brand-assets")
      .upload(filePath, logoFile, { upsert: true });

    if (error) {
      toast.error("Failed to upload logo");
      return null;
    }

    const { data } = supabase.storage.from("brand-assets").getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleCreateBrand = async () => {
    if (!newBrand.name.trim()) {
      toast.error("Please enter a brand name");
      return;
    }

    setIsCreating(true);

    // Create brand first
    const { data, error } = await supabase
      .from("brand_settings")
      .insert([{ ...newBrand, user_id: userId }])
      .select()
      .single();

    if (error) {
      toast.error("Failed to create brand");
      setIsCreating(false);
      return;
    }

    // Upload logo if provided
    if (logoFile && data) {
      const logoUrl = await handleLogoUpload(data.id);
      if (logoUrl) {
        await supabase
          .from("brand_settings")
          .update({ logo_url: logoUrl })
          .eq("id", data.id);
      }
    }

    toast.success("Brand created successfully!");
    loadBrands();
    setIsCreating(false);
    setNewBrand({
      name: "",
      primary_color: "#000000",
      secondary_color: "#666666",
      accent_color: "#0066cc",
      font_family: "Inter",
      heading_font: "Inter",
      body_font: "Inter",
    });
    setLogoFile(null);
  };

  const handleSelectBrand = (brandId: string) => {
    setSelectedBrand(brandId);
    onBrandSelected(brandId);
    toast.success("Brand applied to presentation");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5" />
        <h3 className="font-semibold">Brand Settings</h3>
      </div>

      {/* Existing Brands */}
      <div className="space-y-2">
        {brands.map((brand) => (
          <Card
            key={brand.id}
            className={`p-4 cursor-pointer transition-all ${
              selectedBrand === brand.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleSelectBrand(brand.id)}
          >
            <div className="flex items-center gap-4">
              {brand.logo_url && (
                <img src={brand.logo_url} alt={brand.name} className="w-12 h-12 object-contain" />
              )}
              <div className="flex-1">
                <p className="font-medium">{brand.name}</p>
                  <div className="flex gap-2 mt-2">
                    <div
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: brand.primary_color }}
                      title={`Primary: ${brand.primary_color}`}
                    />
                    <div
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: brand.secondary_color }}
                      title={`Secondary: ${brand.secondary_color}`}
                    />
                    <div
                      className="w-6 h-6 rounded border"
                      style={{ backgroundColor: brand.accent_color }}
                      title={`Accent: ${brand.accent_color}`}
                    />
                  </div>
                  {(brand.heading_font || brand.body_font) && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {brand.heading_font || brand.font_family} / {brand.body_font || brand.font_family}
                    </p>
                  )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create New Brand */}
      <Card className="p-4 space-y-4">
        <h4 className="font-medium">Create New Brand</h4>
        <div className="space-y-3">
          <div>
            <Label>Brand Name</Label>
            <Input
              value={newBrand.name}
              onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
              placeholder="e.g., Siemens Energy"
            />
          </div>
          <div>
            <Label>Logo</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label>Primary Color</Label>
              <Input
                type="color"
                value={newBrand.primary_color}
                onChange={(e) => setNewBrand({ ...newBrand, primary_color: e.target.value })}
              />
            </div>
            <div>
              <Label>Secondary Color</Label>
              <Input
                type="color"
                value={newBrand.secondary_color}
                onChange={(e) => setNewBrand({ ...newBrand, secondary_color: e.target.value })}
              />
            </div>
            <div>
              <Label>Accent Color</Label>
              <Input
                type="color"
                value={newBrand.accent_color}
                onChange={(e) => setNewBrand({ ...newBrand, accent_color: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Heading Font</Label>
              <Input
                value={newBrand.heading_font}
                onChange={(e) => setNewBrand({ ...newBrand, heading_font: e.target.value })}
                placeholder="Inter"
              />
            </div>
            <div>
              <Label>Body Font</Label>
              <Input
                value={newBrand.body_font}
                onChange={(e) => setNewBrand({ ...newBrand, body_font: e.target.value })}
                placeholder="Inter"
              />
            </div>
          </div>
          <Button onClick={handleCreateBrand} disabled={isCreating} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Create Brand
          </Button>
        </div>
      </Card>
    </div>
  );
};
