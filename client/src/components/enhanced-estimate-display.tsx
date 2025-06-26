import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, DollarSign, Wrench, FileText, AlertTriangle, TrendingUp } from 'lucide-react';

interface EnhancedEstimateProps {
  estimate: {
    Materials?: Record<string, number>;
    Labor?: Record<string, { hours: number; cost: number }>;
    "Permits & Fees"?: Record<string, number>;
    "Equipment & Overhead"?: Record<string, number>;
    "Profit & Contingency"?: Record<string, number>;
    TotalEstimate?: number;
    Notes?: string;
  };
  projectDetails?: {
    projectType?: string;
    area?: number;
    timeline?: string;
  };
}

export default function EnhancedEstimateDisplay({ estimate, projectDetails }: EnhancedEstimateProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateSectionTotal = (section: Record<string, any>) => {
    if (!section) return 0;
    return Object.values(section).reduce((total, item) => {
      if (typeof item === 'number') return total + item;
      if (typeof item === 'object' && item.cost) return total + item.cost;
      return total;
    }, 0);
  };

  const materialsTotal = calculateSectionTotal(estimate.Materials || {});
  const laborTotal = calculateSectionTotal(estimate.Labor || {});
  const permitsTotal = calculateSectionTotal(estimate["Permits & Fees"] || {});
  const equipmentTotal = calculateSectionTotal(estimate["Equipment & Overhead"] || {});
  const profitTotal = calculateSectionTotal(estimate["Profit & Contingency"] || {});

  const totalLaborHours = Object.values(estimate.Labor || {}).reduce((total, item) => {
    return total + (typeof item === 'object' && item.hours ? item.hours : 0);
  }, 0);

  return (
    <div className="space-y-6">
      {/* Project Summary Header */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <FileText className="w-5 h-5" />
            Enhanced Project Estimate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(estimate.TotalEstimate || 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Estimate</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                {totalLaborHours}h
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Labor Hour Rate</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-purple-600 dark:text-purple-400">
                {projectDetails?.area || 'N/A'} {projectDetails?.area ? 'sq ft' : ''}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Project Size</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-semibold text-orange-600 dark:text-orange-400">
                {projectDetails?.timeline || 'TBD'}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Timeline</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materials Breakdown */}
      {estimate.Materials && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-orange-600" />
              Materials ({formatCurrency(materialsTotal)})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(estimate.Materials).length === 0 ? (
                <div className="col-span-2 text-center py-4 text-gray-500">
                  {formatCurrency(0)} - No materials specified
                </div>
              ) : (
                Object.entries(estimate.Materials).map(([item, cost]) => (
                  <div key={item} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="font-medium">{item}</span>
                    <Badge variant="secondary">{formatCurrency(typeof cost === 'number' ? cost : 0)}</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Labor Breakdown */}
      {estimate.Labor && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Labor ({formatCurrency(laborTotal)})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(estimate.Labor).map(([task, details]) => {
                if (typeof details === 'object' && details.hours > 0) {
                  return (
                    <div key={task} className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div>
                        <span className="font-medium">{task}</span>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {details.hours} hours @ ${(details.cost / details.hours).toFixed(0)}/hr
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">{formatCurrency(details.cost)}</Badge>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Permits & Fees */}
      {estimate["Permits & Fees"] && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              Permits & Fees ({formatCurrency(permitsTotal)})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(estimate["Permits & Fees"]).map(([permit, cost]) => (
                cost > 0 && (
                  <div key={permit} className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <span className="font-medium">{permit}</span>
                    <Badge variant="secondary">{formatCurrency(cost)}</Badge>
                  </div>
                )
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Equipment & Overhead */}
      {estimate["Equipment & Overhead"] && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="w-5 h-5 text-purple-600" />
              Equipment & Overhead ({formatCurrency(equipmentTotal)})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(estimate["Equipment & Overhead"]).map(([item, cost]) => (
                cost > 0 && (
                  <div key={item} className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-950 rounded-lg">
                    <span className="font-medium">{item}</span>
                    <Badge variant="secondary">{formatCurrency(cost)}</Badge>
                  </div>
                )
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profit & Contingency */}
      {estimate["Profit & Contingency"] && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-yellow-600" />
              Profit & Contingency ({formatCurrency(profitTotal)})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(estimate["Profit & Contingency"]).map(([item, cost]) => (
                cost > 0 && (
                  <div key={item} className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                    <span className="font-medium">{item}</span>
                    <Badge variant="secondary">{formatCurrency(cost)}</Badge>
                  </div>
                )
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes Section */}
      {estimate.Notes && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <AlertTriangle className="w-5 h-5" />
              Important Notes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-amber-800 dark:text-amber-200">{estimate.Notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Cost Summary */}
      <Card className="border-2 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
            <DollarSign className="w-5 h-5" />
            Cost Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Materials:</span>
              <span className="font-semibold">{formatCurrency(materialsTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Labor:</span>
              <span className="font-semibold">{formatCurrency(laborTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Permits & Fees:</span>
              <span className="font-semibold">{formatCurrency(permitsTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Equipment & Overhead:</span>
              <span className="font-semibold">{formatCurrency(equipmentTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Profit & Contingency:</span>
              <span className="font-semibold">{formatCurrency(profitTotal)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold text-green-700 dark:text-green-300">
              <span>Total Estimate:</span>
              <span>{formatCurrency(estimate.TotalEstimate || 0)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}