import { Button } from "@/components/ui/button";
import { Droplets, Leaf, Menu } from "lucide-react";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50 shadow-soft">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Droplets className="h-8 w-8 text-primary" />
            <Leaf className="h-6 w-6 text-eco" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              AquaRecharge
            </h1>
            <p className="text-xs text-muted-foreground">CGWB Compliant</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" className="text-foreground hover:text-primary transition-smooth">
            Home
          </NavLink>
          <NavLink to="/calculator/rwh" className="text-foreground hover:text-primary transition-smooth">
            RWH Calculator
          </NavLink>
          <NavLink to="/calculator/ar" className="text-foreground hover:text-primary transition-smooth">
            AR Calculator
          </NavLink>
          <NavLink to="/education" className="text-foreground hover:text-primary transition-smooth">
            Learn
          </NavLink>
        </nav>

        <div className="flex items-center gap-4">
          <Button size="sm" variant="outline" className="hidden sm:flex">
            हिन्दी
          </Button>
          <Button size="sm" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;