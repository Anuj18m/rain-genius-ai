import { Button } from "@/components/ui/button";
import { ArrowRight, Droplets, TreePine } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-rainwater.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Rainwater Harvesting Infrastructure" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-eco/80" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="flex justify-center gap-4 mb-6">
            <Droplets className="h-16 w-16 text-primary-glow animate-pulse" />
            <TreePine className="h-16 w-16 text-eco-glow animate-pulse" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Smart Water
            <span className="block bg-gradient-to-r from-primary-glow to-eco-glow bg-clip-text text-transparent">
              Management
            </span>
            for India
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
            CGWB-compliant calculations for Rainwater Harvesting and Artificial Recharge. 
            Scientific precision meets environmental sustainability.
          </p>

          {/* Dual Selection Cards */}
          <div className="grid md:grid-cols-2 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 hover:bg-white/15 transition-smooth group cursor-pointer"
                 onClick={() => navigate('/calculator/rwh')}>
              <Droplets className="h-12 w-12 text-primary-glow mx-auto mb-4 group-hover:scale-110 transition-bounce" />
              <h3 className="text-2xl font-bold mb-3">Rainwater Harvesting</h3>
              <p className="text-white/80 mb-6">Calculate storage potential, tank sizing, and cost-benefit analysis for rooftop collection systems.</p>
              <Button variant="hero" size="lg" className="w-full group-hover:shadow-glow">
                Start RWH Calculator <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 hover:bg-white/15 transition-smooth group cursor-pointer"
                 onClick={() => navigate('/calculator/ar')}>
              <TreePine className="h-12 w-12 text-eco-glow mx-auto mb-4 group-hover:scale-110 transition-bounce" />
              <h3 className="text-2xl font-bold mb-3">Artificial Recharge</h3>
              <p className="text-white/80 mb-6">Design groundwater recharge structures with scientific feasibility and environmental impact assessment.</p>
              <Button variant="eco" size="lg" className="w-full group-hover:shadow-glow">
                Start AR Calculator <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-glow">50,000+</div>
              <div className="text-white/70">Calculations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-eco-glow">98%</div>
              <div className="text-white/70">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-glow">CGWB</div>
              <div className="text-white/70">Compliant</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;