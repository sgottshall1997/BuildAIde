import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calculator, Sparkles } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import EnhancedEstimateDisplay from './enhanced-estimate-display';
import InteractiveCostBreakdownEnhanced from './interactive-cost-breakdown-enhanced';
import CostBreakdownChartEnhanced from './cost-breakdown-chart-enhanced';
import AIRiskAssessmentEnhanced from './ai-risk-assessment-enhanced';
import SimilarProjectsEnhanced from './similar-projects-enhanced';

export default function EnhancedEstimateForm() {
  const [formData, setFormData] = useState({
    userInput: '',
    area: '',
    materialQuality: '',
    timeline: '',
    zipCode: '',
    needsPermits: false,
    permitTypes: '',
    needsEquipment: false,
    equipmentTypes: '',
    laborRate: ''
  });
  const [estimate, setEstimate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest('POST', '/api/enhanced-estimate', {
        userInput: formData.userInput,
        area: formData.area ? Number(formData.area) : undefined,
        materialQuality: formData.materialQuality || undefined,
        timeline: formData.timeline || undefined,
        zipCode: formData.zipCode || undefined,
        needsPermits: formData.needsPermits,
        permitTypes: formData.permitTypes || undefined,
        needsEquipment: formData.needsEquipment,
        equipmentTypes: formData.equipmentTypes || undefined,
        laborRate: formData.laborRate ? Number(formData.laborRate) : undefined
      });

      const data = await response.json();
      setEstimate(data.estimate);
    } catch (error) {
      console.error('Error generating enhanced estimate:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (estimate) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Enhanced Project Estimate</h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setEstimate(null)}
              className="flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              Edit Inputs
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setEstimate(null);
                setFormData({
                  userInput: '',
                  area: '',
                  materialQuality: '',
                  timeline: '',
                  zipCode: '',
                  needsPermits: false,
                  permitTypes: '',
                  needsEquipment: false,
                  equipmentTypes: '',
                  laborRate: ''
                });
              }}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              New Estimate
            </Button>
          </div>
        </div>
        
        <EnhancedEstimateDisplay 
          estimate={estimate}
          projectDetails={{
            area: formData.area ? Number(formData.area) : undefined,
            timeline: formData.timeline
          }}
        />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-600" />
          AI Project Estimator
        </CardTitle>
        <p className="text-gray-600 dark:text-gray-400">
          Get a comprehensive cost breakdown with detailed labor hours, materials, permits, and more.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Project Description */}
          <div className="space-y-2">
            <Label htmlFor="userInput" className="text-sm font-medium">
              Project Description *
            </Label>
            <Textarea
              id="userInput"
              placeholder="Describe your project in detail... e.g., 'I want to remodel a 350 sq ft kitchen with mid-level finishes, including new cabinets, countertops, flooring, and electrical work'"
              value={formData.userInput}
              onChange={(e) => handleInputChange('userInput', e.target.value)}
              className="min-h-[100px]"
              required
            />
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="area" className="text-sm font-medium">
                Area (sq ft)
              </Label>
              <Input
                id="area"
                type="number"
                placeholder="350"
                value={formData.area}
                onChange={(e) => handleInputChange('area', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="materialQuality" className="text-sm font-medium">
                Material Quality
              </Label>
              <Select onValueChange={(value) => handleInputChange('materialQuality', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select quality level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="mid-range">Mid-Range</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline" className="text-sm font-medium">
                Timeline
              </Label>
              <Input
                id="timeline"
                placeholder="e.g., 4-6 weeks, 32 hours, ASAP"
                value={formData.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode" className="text-sm font-medium">
                ZIP Code
              </Label>
              <Input
                id="zipCode"
                placeholder="20814"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="laborRate" className="text-sm font-medium">
                Labor Rate ($/hour)
              </Label>
              <Input
                id="laborRate"
                type="number"
                placeholder="25"
                value={formData.laborRate}
                onChange={(e) => handleInputChange('laborRate', e.target.value)}
              />
            </div>
          </div>

          {/* Project Requirements */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Project Requirements</h3>
            
            {/* Permits & Fees */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="needsPermits"
                  checked={formData.needsPermits}
                  onCheckedChange={(checked) => 
                    handleInputChange('needsPermits', checked === true)
                  }
                />
                <Label htmlFor="needsPermits" className="text-sm font-medium">
                  This project requires permits or fees
                </Label>
              </div>
              
              {formData.needsPermits && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="permitTypes" className="text-sm font-medium">
                    Permit Types (optional)
                  </Label>
                  <Input
                    id="permitTypes"
                    placeholder="e.g., Building permit, Electrical permit, Plumbing permit"
                    value={formData.permitTypes}
                    onChange={(e) => handleInputChange('permitTypes', e.target.value)}
                  />
                </div>
              )}
            </div>

            {/* Equipment & Overhead */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="needsEquipment"
                  checked={formData.needsEquipment}
                  onCheckedChange={(checked) => 
                    handleInputChange('needsEquipment', checked === true)
                  }
                />
                <Label htmlFor="needsEquipment" className="text-sm font-medium">
                  This project requires special equipment or overhead costs
                </Label>
              </div>
              
              {formData.needsEquipment && (
                <div className="ml-6 space-y-2">
                  <Label htmlFor="equipmentTypes" className="text-sm font-medium">
                    Equipment Types (optional)
                  </Label>
                  <Input
                    id="equipmentTypes"
                    placeholder="e.g., Scaffolding, Concrete mixer, Dumpster rental"
                    value={formData.equipmentTypes}
                    onChange={(e) => handleInputChange('equipmentTypes', e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isLoading || !formData.userInput.trim()}
            className="w-full flex items-center gap-2"
          >
            <Calculator className="w-4 h-4" />
            {isLoading ? 'Generating Enhanced Estimate...' : 'Generate Enhanced Estimate'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}