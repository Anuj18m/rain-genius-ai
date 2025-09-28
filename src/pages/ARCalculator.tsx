import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TreePine, Layers, Zap } from "lucide-react";
import artificialRechargeImage from "@/assets/artificial-recharge.jpg";

type ARFormData = {
  location: string;
  catchmentArea: number;
  soilType: string;
  rainfall: number;
  groundwaterDepth: number;
  openSpace: number;
  existingBorewell: boolean;
  budget: string;
  permeability: number;
};

const ARCalculator = () => {
  const [formData, setFormData] = useState<ARFormData>({
    location: "",
    catchmentArea: 0,
    soilType: "",
    rainfall: 0,
    groundwaterDepth: 0,
    openSpace: 0,
    existingBorewell: false,
    budget: "",
    permeability: 0
  });

  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const soilPermeability = {
    clay: 0.01,
    silt: 0.1,
    sand: 1.0,
    gravel: 10.0,
    rock: 0.001
  };

  const handleInputChange = (field: keyof ARFormData, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'soilType' && { permeability: soilPermeability[value as keyof typeof soilPermeability] || 0 })
    }));
  };

  const calculateAR = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const rechargeVolume = formData.catchmentArea * formData.rainfall * 0.7; // 70% efficiency
      const infiltrationRate = formData.permeability * 24; // mm/day
      const requiredArea = rechargeVolume / (infiltrationRate * 365);
      
      // Structure recommendation logic
      let recommendedStructure = "";
      let structureCost = 0;
      
      if (formData.groundwaterDepth < 5 && formData.openSpace > 50) {
        recommendedStructure = "Recharge Pit";
        structureCost = 25000;
      } else if (formData.groundwaterDepth < 15 && formData.openSpace > 100) {
        recommendedStructure = "Percolation Tank";
        structureCost = 75000;
      } else if (formData.existingBorewell) {
        recommendedStructure = "Borewell Recharge";
        structureCost = 15000;
      } else {
        recommendedStructure = "Infiltration Trench";
        structureCost = 50000;
      }
      
      const costMultiplier = formData.budget === 'high' ? 1.3 : formData.budget === 'medium' ? 1.1 : 0.9;
      const totalCost = structureCost * costMultiplier;
      
      // Environmental benefits
      const annualRecharge = rechargeVolume * 0.8; // 80% reaches groundwater
      const carbonOffset = annualRecharge * 0.0002; // kg CO2 per liter
      
      const feasibilityScore = Math.min(100, 
        (formData.permeability * 20) + 
        (formData.openSpace > requiredArea ? 30 : 10) +
        (formData.groundwaterDepth < 20 ? 25 : 5) +
        (formData.rainfall > 600 ? 25 : 10)
      );

      setResults({
        rechargeVolume: Math.round(rechargeVolume),
        annualRecharge: Math.round(annualRecharge),
        requiredArea: Math.round(requiredArea),
        recommendedStructure,
        totalCost: Math.round(totalCost),
        infiltrationRate: Math.round(infiltrationRate * 10) / 10,
        carbonOffset: Math.round(carbonOffset * 10) / 10,
        feasibilityScore: Math.round(feasibilityScore),
        feasibility: feasibilityScore > 75 ? 'Highly Feasible' : 
                   feasibilityScore > 50 ? 'Moderately Feasible' : 'Requires Optimization'
      });
      setIsCalculating(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center gap-2 mb-4">
            <TreePine className="h-8 w-8 text-eco" />
            <Layers className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-eco bg-clip-text text-transparent">
            Artificial Recharge Calculator
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Design groundwater recharge structures using scientific principles and CGWB guidelines for sustainable water management.
          </p>
        </div>

        {/* Info Image */}
        <div className="mb-8">
          <img 
            src={artificialRechargeImage} 
            alt="Artificial Recharge Systems" 
            className="w-full h-64 object-cover rounded-xl shadow-medium"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Site Assessment
              </CardTitle>
              <CardDescription>Enter geological and hydrological parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="ar-location">Location</Label>
                <Input
                  id="ar-location"
                  placeholder="Enter city/district"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="catchmentArea">Catchment Area (sq.m)</Label>
                  <Input
                    id="catchmentArea"
                    type="number"
                    placeholder="500"
                    value={formData.catchmentArea || ''}
                    onChange={(e) => handleInputChange('catchmentArea', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="openSpace">Available Open Space (sq.m)</Label>
                  <Input
                    id="openSpace"
                    type="number"
                    placeholder="100"
                    value={formData.openSpace || ''}
                    onChange={(e) => handleInputChange('openSpace', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Soil Type</Label>
                  <Select value={formData.soilType} onValueChange={(value) => handleInputChange('soilType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select soil type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clay">Clay (Low Permeability)</SelectItem>
                      <SelectItem value="silt">Silt (Low-Medium Permeability)</SelectItem>
                      <SelectItem value="sand">Sandy Soil (High Permeability)</SelectItem>
                      <SelectItem value="gravel">Gravel (Very High Permeability)</SelectItem>
                      <SelectItem value="rock">Rocky (Very Low Permeability)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Permeability (m/day)</Label>
                  <Input
                    value={formData.permeability || ''}
                    placeholder="Auto-calculated"
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ar-rainfall">Annual Rainfall (mm)</Label>
                  <Input
                    id="ar-rainfall"
                    type="number"
                    placeholder="1200"
                    value={formData.rainfall || ''}
                    onChange={(e) => handleInputChange('rainfall', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="groundwaterDepth">Groundwater Depth (m)</Label>
                  <Input
                    id="groundwaterDepth"
                    type="number"
                    placeholder="10"
                    value={formData.groundwaterDepth || ''}
                    onChange={(e) => handleInputChange('groundwaterDepth', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Existing Borewell</Label>
                  <Select 
                    value={formData.existingBorewell.toString()} 
                    onValueChange={(value) => handleInputChange('existingBorewell', value === 'true')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Yes, Available</SelectItem>
                      <SelectItem value="false">No Borewell</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Budget Range</Label>
                  <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low Budget</SelectItem>
                      <SelectItem value="medium">Medium Budget</SelectItem>
                      <SelectItem value="high">High Budget</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                variant="eco" 
                size="lg" 
                className="w-full"
                onClick={calculateAR}
                disabled={isCalculating || !formData.catchmentArea || !formData.rainfall || !formData.soilType}
              >
                {isCalculating ? 'Calculating...' : 'Calculate AR Potential'}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <Card className="shadow-medium bg-gradient-subtle">
              <CardHeader>
                <CardTitle className="text-eco">Recharge Analysis</CardTitle>
                <CardDescription>Based on hydrogeological principles and CGWB standards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-soft">
                    <div className="text-2xl font-bold text-eco">{results.rechargeVolume.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Annual Recharge Potential (L)</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-soft">
                    <div className="text-2xl font-bold text-primary">{results.feasibilityScore}%</div>
                    <div className="text-sm text-muted-foreground">Feasibility Score</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-soft">
                    <div className="text-2xl font-bold text-eco">{results.requiredArea}</div>
                    <div className="text-sm text-muted-foreground">Min. Required Area (sq.m)</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-soft">
                    <div className="text-2xl font-bold text-primary">₹{results.totalCost.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Estimated Cost</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-soft">
                  <div className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-eco" />
                    Recommended Structure
                  </div>
                  <div className="text-xl font-bold text-eco mb-2">{results.recommendedStructure}</div>
                  <div className="text-sm text-muted-foreground">
                    Infiltration Rate: {results.infiltrationRate} mm/day
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-soft">
                  <div className="text-lg font-semibold mb-2">Environmental Impact</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Annual Groundwater Recharge:</span>
                      <span className="font-semibold ml-2">{results.annualRecharge.toLocaleString()}L</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Carbon Offset:</span>
                      <span className="font-semibold ml-2">{results.carbonOffset} kg CO₂/year</span>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${
                  results.feasibility === 'Highly Feasible' ? 'bg-eco/10 border border-eco/20' :
                  results.feasibility === 'Moderately Feasible' ? 'bg-warning/10 border border-warning/20' :
                  'bg-destructive/10 border border-destructive/20'
                }`}>
                  <div className="font-semibold">{results.feasibility}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {results.feasibility === 'Highly Feasible' && "Excellent site conditions for artificial recharge implementation."}
                    {results.feasibility === 'Moderately Feasible' && "Good potential with site optimization recommendations."}
                    {results.feasibility === 'Requires Optimization' && "Consider site modifications or alternative recharge methods."}
                  </div>
                </div>

                <Button variant="success" size="lg" className="w-full">
                  Download Technical Report
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ARCalculator;