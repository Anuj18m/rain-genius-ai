import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, Droplets, Home, MapPin } from "lucide-react";

type RWHFormData = {
  location: string;
  roofArea: number;
  roofType: string;
  rainfall: number;
  waterDemand: number;
  residents: number;
  environmentType: string;
  budget: string;
};

const RWHCalculator = () => {
  const [formData, setFormData] = useState<RWHFormData>({
    location: "",
    roofArea: 0,
    roofType: "",
    rainfall: 0,
    waterDemand: 0,
    residents: 0,
    environmentType: "",
    budget: ""
  });

  const [results, setResults] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const runoffCoefficients = {
    concrete: 0.85,
    metal: 0.95,
    tile: 0.75,
    asbestos: 0.80
  };

  const handleInputChange = (field: keyof RWHFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'residents' && { waterDemand: Number(value) * 135 }) // 135 L/day/person
    }));
  };

  const calculateRWH = () => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const runoffCoeff = runoffCoefficients[formData.roofType as keyof typeof runoffCoefficients] || 0.8;
      const harvestableVolume = formData.roofArea * formData.rainfall * runoffCoeff * 0.8; // 80% efficiency
      const annualHarvest = harvestableVolume;
      const annualDemand = formData.waterDemand * 365;
      const coverage = (annualHarvest / annualDemand) * 100;
      
      // Tank sizing (for 15 days storage)
      const tankSize = formData.waterDemand * 15;
      
      // Cost estimation based on tank size and budget
      const costMultiplier = formData.budget === 'high' ? 1.5 : formData.budget === 'medium' ? 1.2 : 1.0;
      const estimatedCost = tankSize * 15 * costMultiplier; // ₹15 per liter capacity
      
      // Savings calculation
      const waterRate = 8; // ₹8 per 1000L
      const annualSavings = (annualHarvest / 1000) * waterRate;
      const paybackPeriod = estimatedCost / annualSavings;

      setResults({
        harvestableVolume: Math.round(harvestableVolume),
        annualHarvest: Math.round(annualHarvest),
        coverage: Math.round(coverage * 10) / 10,
        tankSize: Math.round(tankSize),
        estimatedCost: Math.round(estimatedCost),
        annualSavings: Math.round(annualSavings),
        paybackPeriod: Math.round(paybackPeriod * 10) / 10,
        feasibility: coverage > 60 ? 'Highly Feasible' : coverage > 30 ? 'Moderately Feasible' : 'Limited Feasibility'
      });
      setIsCalculating(false);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center gap-2 mb-4">
            <Droplets className="h-8 w-8 text-primary" />
            <Calculator className="h-8 w-8 text-eco" />
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-water bg-clip-text text-transparent">
            Rainwater Harvesting Calculator
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Calculate your rainwater harvesting potential using CGWB-compliant formulas and get detailed feasibility analysis.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Project Details
              </CardTitle>
              <CardDescription>Enter your building and location information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="Enter city/district"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="roofArea">Roof Area (sq.m)</Label>
                  <Input
                    id="roofArea"
                    type="number"
                    placeholder="200"
                    value={formData.roofArea || ''}
                    onChange={(e) => handleInputChange('roofArea', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="roofType">Roof Type</Label>
                  <Select value={formData.roofType} onValueChange={(value) => handleInputChange('roofType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="concrete">Concrete (0.85)</SelectItem>
                      <SelectItem value="metal">Metal Sheet (0.95)</SelectItem>
                      <SelectItem value="tile">Clay Tile (0.75)</SelectItem>
                      <SelectItem value="asbestos">Asbestos (0.80)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rainfall">Annual Rainfall (mm)</Label>
                  <Input
                    id="rainfall"
                    type="number"
                    placeholder="1200"
                    value={formData.rainfall || ''}
                    onChange={(e) => handleInputChange('rainfall', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="residents">No. of Residents</Label>
                  <Input
                    id="residents"
                    type="number"
                    placeholder="4"
                    value={formData.residents || ''}
                    onChange={(e) => handleInputChange('residents', parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Daily Water Demand (Litres)</Label>
                <Input
                  value={formData.waterDemand || ''}
                  placeholder="Calculated automatically"
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  Auto-calculated: {formData.residents} residents × 135 L/day
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Environment Type</Label>
                  <Select value={formData.environmentType} onValueChange={(value) => handleInputChange('environmentType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="agricultural">Agricultural</SelectItem>
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
                variant="water" 
                size="lg" 
                className="w-full"
                onClick={calculateRWH}
                disabled={isCalculating || !formData.roofArea || !formData.rainfall || !formData.residents}
              >
                {isCalculating ? 'Calculating...' : 'Calculate RWH Potential'}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {results && (
            <Card className="shadow-medium bg-gradient-subtle">
              <CardHeader>
                <CardTitle className="text-primary">Calculation Results</CardTitle>
                <CardDescription>Based on CGWB guidelines and scientific formulas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-soft">
                    <div className="text-2xl font-bold text-primary">{results.harvestableVolume.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Harvestable Volume (L/year)</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-soft">
                    <div className="text-2xl font-bold text-eco">{results.coverage}%</div>
                    <div className="text-sm text-muted-foreground">Annual Demand Coverage</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-soft">
                    <div className="text-2xl font-bold text-primary">{results.tankSize.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Recommended Tank Size (L)</div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-soft">
                    <div className="text-2xl font-bold text-eco">₹{results.estimatedCost.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Estimated Setup Cost</div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-soft">
                  <div className="text-lg font-semibold mb-2">Economic Analysis</div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Annual Savings:</span>
                      <span className="font-semibold ml-2">₹{results.annualSavings.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Payback Period:</span>
                      <span className="font-semibold ml-2">{results.paybackPeriod} years</span>
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
                    {results.feasibility === 'Highly Feasible' && "Excellent potential for rainwater harvesting implementation."}
                    {results.feasibility === 'Moderately Feasible' && "Good potential with some limitations to consider."}
                    {results.feasibility === 'Limited Feasibility' && "Consider supplementary water sources or system optimization."}
                  </div>
                </div>

                <Button variant="success" size="lg" className="w-full">
                  Download Detailed Report
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RWHCalculator;