import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, FileText, AlertTriangle, CheckCircle } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-6 bg-amber-100 text-amber-800 border-amber-200 px-4 py-2">
            <Scale className="w-4 h-4 mr-2" />
            Legal Terms
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Terms of Service
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Introduction */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Agreement to Terms</h2>
            <p className="text-slate-600 leading-relaxed">
              By accessing and using ConstructionSmartTools, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.
            </p>
          </CardContent>
        </Card>

        {/* Service Description */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 text-blue-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900">Service Description</h2>
            </div>
            <p className="text-slate-600 leading-relaxed mb-4">
              ConstructionSmartTools provides AI-powered construction planning and estimation tools for professionals and homeowners. Our services include:
            </p>
            <ul className="space-y-2 text-slate-600">
              <li>• Project estimation and cost analysis</li>
              <li>• Schedule planning and management</li>
              <li>• Permit research and compliance guidance</li>
              <li>• AI-powered insights and recommendations</li>
              <li>• Material pricing and market data</li>
            </ul>
          </CardContent>
        </Card>

        {/* User Responsibilities */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900">User Responsibilities</h2>
            </div>
            <p className="text-slate-600 leading-relaxed mb-4">As a user of our platform, you agree to:</p>
            <ul className="space-y-2 text-slate-600">
              <li>• Provide accurate and truthful information</li>
              <li>• Use the service for lawful purposes only</li>
              <li>• Maintain the security of your account credentials</li>
              <li>• Respect intellectual property rights</li>
              <li>• Not attempt to reverse engineer or hack the platform</li>
              <li>• Follow all applicable building codes and regulations</li>
            </ul>
          </CardContent>
        </Card>

        {/* Disclaimers */}
        <Card className="mb-8 border-2 border-amber-200">
          <CardContent className="p-8">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-600 mr-3" />
              <h2 className="text-2xl font-bold text-slate-900">Important Disclaimers</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-amber-800 mb-2">Professional Consultation Required</h3>
                <p className="text-amber-700 text-sm">
                  Our AI-generated estimates and recommendations are for planning purposes only. Always consult with licensed professionals for final decisions, structural work, and permit applications.
                </p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-amber-800 mb-2">No Warranty</h3>
                <p className="text-amber-700 text-sm">
                  While we strive for accuracy, we cannot guarantee the precision of cost estimates, timelines, or regulatory information. Market conditions and local requirements may vary.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Limitation of Liability</h2>
            <p className="text-slate-600 leading-relaxed">
              ConstructionSmartTools shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business interruption, arising from your use of our service.
            </p>
          </CardContent>
        </Card>

        {/* Account Termination */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Account Termination</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              We reserve the right to terminate or suspend accounts that violate these terms. You may also delete your account at any time through your account settings.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Upon termination, your access to the service will cease, but these terms will remain in effect regarding any prior use of the service.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to Terms</h2>
            <p className="text-slate-600 leading-relaxed">
              We may update these Terms of Service from time to time. We will notify users of any material changes via email or through the platform. Continued use of the service after changes constitutes acceptance of the new terms.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Questions About These Terms?</h2>
            <p className="text-green-100 mb-4">
              If you have any questions about these Terms of Service, please contact our support team.
            </p>
            <p className="text-green-100 text-sm">
              We're here to help clarify any aspect of our service agreement.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}