import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/footer";
import { Shield, Lock, Eye, Database } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-green-100 text-green-800 border-green-200 px-4 py-2">
            <Shield className="w-4 h-4 mr-2" />
            Privacy & Security
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Commitment to Your Privacy</h2>
            <p className="text-slate-600 leading-relaxed">
              At ConstructionSmartTools, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center mb-4">
              <Database className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900">Information We Collect</h2>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Account Information</h3>
                <p className="text-slate-600">Name, email address, and account preferences when you create an account.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Project Data</h3>
                <p className="text-slate-600">Information you provide about your construction projects, estimates, and planning data.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Usage Information</h3>
                <p className="text-slate-600">How you interact with our platform, features used, and performance data to improve our service.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center mb-4">
              <Eye className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900">How We Use Your Information</h2>
            </div>
            <ul className="space-y-3 text-slate-600">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Provide and maintain our AI-powered construction tools
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Improve our algorithms and user experience
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Send important updates about your account and our service
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                Provide customer support and respond to your inquiries
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center mb-4">
              <Lock className="w-6 h-6 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900">Data Security</h2>
            </div>
            <p className="text-slate-600 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="space-y-2 text-slate-600">
              <li>• End-to-end encryption for data transmission</li>
              <li>• Secure cloud storage with regular backups</li>
              <li>• Regular security audits and monitoring</li>
              <li>• Limited access to personal data by authorized personnel only</li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Sharing */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Information Sharing</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We do not sell, trade, or rent your personal information to third parties. We may share information only in these limited circumstances:
            </p>
            <ul className="space-y-2 text-slate-600">
              <li>• With your explicit consent</li>
              <li>• To comply with legal obligations</li>
              <li>• To protect our rights and safety</li>
              <li>• With trusted service providers who assist in our operations</li>
            </ul>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Rights</h2>
            <p className="text-slate-600 leading-relaxed mb-4">You have the right to:</p>
            <ul className="space-y-2 text-slate-600">
              <li>• Access and review your personal information</li>
              <li>• Request corrections to your data</li>
              <li>• Delete your account and associated data</li>
              <li>• Export your project data</li>
              <li>• Opt out of non-essential communications</li>
            </ul>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Questions About Privacy?</h2>
            <p className="text-blue-100 mb-4">
              If you have any questions about this Privacy Policy or how we handle your data, please contact us.
            </p>
            <p className="text-blue-100 text-sm">
              We're committed to transparency and will respond to your privacy inquiries promptly.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}