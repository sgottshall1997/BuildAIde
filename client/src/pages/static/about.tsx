import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/footer";
import { 
  Building, 
  Users, 
  Target, 
  Sparkles,
  Heart,
  Code,
  Zap
} from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-6 bg-blue-100 text-blue-800 border-blue-200 px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            Our Story
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            About BuildAIde
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We're revolutionizing construction planning with AI-powered tools that help both professionals and homeowners make smarter, faster decisions.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-12 border-2 border-blue-200">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                To eliminate guesswork from construction projects by providing intelligent, data-driven tools that save time, reduce costs, and improve outcomes for everyone in the building industry.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* What We Do */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">What We Do</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Building className="w-8 h-8 text-orange-600 mr-3" />
                  <h3 className="text-xl font-semibold text-slate-900">For Professionals</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  We provide contractors, builders, and construction professionals with advanced AI-powered tools for accurate estimating, efficient scheduling, subcontractor management, and lead generation.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Users className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-slate-900">For Homeowners</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  We help homeowners and investors plan renovations with confidence through smart budget planning, permit research, ROI analysis, and AI-powered renovation guidance.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Values */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Innovation</h3>
                <p className="text-slate-600 text-sm">
                  We leverage cutting-edge AI technology to solve real construction challenges.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Heart className="w-12 h-12 text-red-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">User-Centric</h3>
                <p className="text-slate-600 text-sm">
                  Every feature is designed with our users' real needs and workflows in mind.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Code className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Reliability</h3>
                <p className="text-slate-600 text-sm">
                  We build robust, accurate tools you can depend on for your most important projects.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="text-blue-100 mb-6">
              Have questions, feedback, or want to learn more about our platform?
            </p>
            <p className="text-blue-100">
              We'd love to hear from you. Reach out through our support channels or join our early access program.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}