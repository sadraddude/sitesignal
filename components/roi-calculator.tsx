"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Share2, Calculator, TrendingUp, DollarSign, Users, Check } from "lucide-react"

export function ROICalculator() {
  // Business inputs
  const [monthlyVisitors, setMonthlyVisitors] = useState(1000)
  const [conversionRate, setConversionRate] = useState(1.5)
  const [averageOrderValue, setAverageOrderValue] = useState(75)

  // Website improvement estimates
  const [trafficIncrease, setTrafficIncrease] = useState(30)
  const [conversionIncrease, setConversionIncrease] = useState(50)
  const [projectCost, setProjectCost] = useState(5000)

  // Calculate current metrics
  const currentMonthlyConversions = monthlyVisitors * (conversionRate / 100)
  const currentMonthlyRevenue = currentMonthlyConversions * averageOrderValue
  const currentAnnualRevenue = currentMonthlyRevenue * 12

  // Calculate improved metrics
  const improvedMonthlyVisitors = monthlyVisitors * (1 + trafficIncrease / 100)
  const improvedConversionRate = conversionRate * (1 + conversionIncrease / 100)
  const improvedMonthlyConversions = improvedMonthlyVisitors * (improvedConversionRate / 100)
  const improvedMonthlyRevenue = improvedMonthlyConversions * averageOrderValue
  const improvedAnnualRevenue = improvedMonthlyRevenue * 12

  // Calculate ROI
  const additionalAnnualRevenue = improvedAnnualRevenue - currentAnnualRevenue
  const roi = ((additionalAnnualRevenue - projectCost) / projectCost) * 100
  const paybackPeriodMonths = projectCost / (additionalAnnualRevenue / 12)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-purple-500" />
          Website Redesign ROI Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="calculator">
          <TabsList className="w-full">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
            <TabsTrigger value="report">Client Report</TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6 pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Current Business Metrics */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Current Business Metrics</h3>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="monthly-visitors">Monthly Website Visitors</Label>
                    <span className="text-sm font-medium">{monthlyVisitors.toLocaleString()}</span>
                  </div>
                  <Slider
                    id="monthly-visitors"
                    min={100}
                    max={10000}
                    step={100}
                    value={[monthlyVisitors]}
                    onValueChange={(value) => setMonthlyVisitors(value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="conversion-rate">Current Conversion Rate (%)</Label>
                    <span className="text-sm font-medium">{conversionRate.toFixed(1)}%</span>
                  </div>
                  <Slider
                    id="conversion-rate"
                    min={0.1}
                    max={5}
                    step={0.1}
                    value={[conversionRate]}
                    onValueChange={(value) => setConversionRate(value[0])}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="average-order">Average Order Value ($)</Label>
                    <span className="text-sm font-medium">${averageOrderValue}</span>
                  </div>
                  <Slider
                    id="average-order"
                    min={10}
                    max={500}
                    step={5}
                    value={[averageOrderValue]}
                    onValueChange={(value) => setAverageOrderValue(value[0])}
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Monthly Conversions:</span>
                    <span className="font-medium">{currentMonthlyConversions.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Monthly Revenue:</span>
                    <span className="font-medium">
                      ${currentMonthlyRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Annual Revenue:</span>
                    <span className="font-medium">
                      ${currentAnnualRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Website Improvement Estimates */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Website Improvement Estimates</h3>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="traffic-increase">Traffic Increase (%)</Label>
                    <span className="text-sm font-medium">{trafficIncrease}%</span>
                  </div>
                  <Slider
                    id="traffic-increase"
                    min={10}
                    max={100}
                    step={5}
                    value={[trafficIncrease]}
                    onValueChange={(value) => setTrafficIncrease(value[0])}
                  />
                  <p className="text-xs text-muted-foreground">
                    Estimated increase in traffic from improved SEO, mobile-friendliness, and user experience.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="conversion-increase">Conversion Rate Improvement (%)</Label>
                    <span className="text-sm font-medium">{conversionIncrease}%</span>
                  </div>
                  <Slider
                    id="conversion-increase"
                    min={10}
                    max={200}
                    step={5}
                    value={[conversionIncrease]}
                    onValueChange={(value) => setConversionIncrease(value[0])}
                  />
                  <p className="text-xs text-muted-foreground">
                    Estimated improvement in conversion rate from better design, clear CTAs, and improved user flow.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="project-cost">Website Redesign Cost ($)</Label>
                    <span className="text-sm font-medium">${projectCost.toLocaleString()}</span>
                  </div>
                  <Slider
                    id="project-cost"
                    min={1000}
                    max={20000}
                    step={500}
                    value={[projectCost]}
                    onValueChange={(value) => setProjectCost(value[0])}
                  />
                </div>

                <div className="p-4 bg-purple-50 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">New Monthly Conversions:</span>
                    <span className="font-medium">{improvedMonthlyConversions.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">New Monthly Revenue:</span>
                    <span className="font-medium">
                      ${improvedMonthlyRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">New Annual Revenue:</span>
                    <span className="font-medium">
                      ${improvedAnnualRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="results" className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Current Performance</h3>
                  <div className="space-y-4">
                    <MetricItem
                      icon={<Users className="h-5 w-5 text-blue-500" />}
                      label="Monthly Visitors"
                      value={monthlyVisitors.toLocaleString()}
                    />
                    <MetricItem
                      icon={<TrendingUp className="h-5 w-5 text-orange-500" />}
                      label="Conversion Rate"
                      value={`${conversionRate.toFixed(1)}%`}
                    />
                    <MetricItem
                      icon={<DollarSign className="h-5 w-5 text-green-500" />}
                      label="Monthly Revenue"
                      value={`${currentMonthlyRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    />
                  </div>
                </div>

                <div className="p-6 bg-purple-50 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">After Redesign</h3>
                  <div className="space-y-4">
                    <MetricItem
                      icon={<Users className="h-5 w-5 text-blue-500" />}
                      label="Monthly Visitors"
                      value={improvedMonthlyVisitors.toLocaleString()}
                      increase={`+${trafficIncrease}%`}
                    />
                    <MetricItem
                      icon={<TrendingUp className="h-5 w-5 text-orange-500" />}
                      label="Conversion Rate"
                      value={`${improvedConversionRate.toFixed(1)}%`}
                      increase={`+${conversionIncrease}%`}
                    />
                    <MetricItem
                      icon={<DollarSign className="h-5 w-5 text-green-500" />}
                      label="Monthly Revenue"
                      value={`${improvedMonthlyRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                      increase={`+${(improvedMonthlyRevenue - currentMonthlyRevenue).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-br from-purple-500 to-blue-600 text-white rounded-lg">
                  <h3 className="text-xl font-medium mb-6">ROI Summary</h3>
                  <div className="space-y-6">
                    <div className="text-center">
                      <p className="text-sm text-white/80">Return on Investment</p>
                      <p className="text-4xl font-bold">{roi.toFixed(0)}%</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <p className="text-sm text-white/80">Payback Period</p>
                        <p className="text-2xl font-bold">{paybackPeriodMonths.toFixed(1)} months</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-white/80">Additional Annual Revenue</p>
                        <p className="text-2xl font-bold">
                          ${additionalAnnualRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white border rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Key Benefits</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span>Increased website traffic from improved SEO and mobile-friendliness</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span>Higher conversion rates from better user experience and clear calls-to-action</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span>Improved brand perception and customer trust</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span>Reduced bounce rates and increased time on site</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6 gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button size="sm">Generate Client Proposal</Button>
            </div>
          </TabsContent>

          <TabsContent value="report" className="pt-6">
            <div className="space-y-6">
              <div className="p-6 bg-white border rounded-lg">
                <h3 className="text-xl font-medium mb-4">Website ROI Analysis for Client</h3>
                <p className="text-muted-foreground mb-4">
                  This report provides an analysis of the potential return on investment for your website redesign
                  project.
                </p>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Current Website Performance</h4>
                    <ul className="space-y-1 text-sm">
                      <li className="flex justify-between">
                        <span>Monthly Website Visitors:</span>
                        <span className="font-medium">{monthlyVisitors.toLocaleString()}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Current Conversion Rate:</span>
                        <span className="font-medium">{conversionRate.toFixed(1)}%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Average Order Value:</span>
                        <span className="font-medium">${averageOrderValue}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Monthly Conversions:</span>
                        <span className="font-medium">{currentMonthlyConversions.toFixed(0)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Monthly Revenue:</span>
                        <span className="font-medium">
                          ${currentMonthlyRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span>Annual Revenue:</span>
                        <span className="font-medium">
                          ${currentAnnualRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Projected Improvements</h4>
                    <ul className="space-y-1 text-sm">
                      <li className="flex justify-between">
                        <span>Traffic Increase:</span>
                        <span className="font-medium">{trafficIncrease}%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Conversion Rate Improvement:</span>
                        <span className="font-medium">{conversionIncrease}%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>New Monthly Visitors:</span>
                        <span className="font-medium">{improvedMonthlyVisitors.toLocaleString()}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>New Conversion Rate:</span>
                        <span className="font-medium">{improvedConversionRate.toFixed(1)}%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>New Monthly Conversions:</span>
                        <span className="font-medium">{improvedMonthlyConversions.toFixed(0)}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>New Monthly Revenue:</span>
                        <span className="font-medium">
                          ${improvedMonthlyRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span>New Annual Revenue:</span>
                        <span className="font-medium">
                          ${improvedAnnualRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Investment Analysis</h4>
                    <ul className="space-y-1 text-sm">
                      <li className="flex justify-between">
                        <span>Website Redesign Cost:</span>
                        <span className="font-medium">${projectCost.toLocaleString()}</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Additional Annual Revenue:</span>
                        <span className="font-medium">
                          ${additionalAnnualRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                      </li>
                      <li className="flex justify-between">
                        <span>Return on Investment (ROI):</span>
                        <span className="font-medium">{roi.toFixed(0)}%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Payback Period:</span>
                        <span className="font-medium">{paybackPeriodMonths.toFixed(1)} months</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button size="sm">Schedule Presentation</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Helper component for displaying metrics with icons
function MetricItem({ icon, label, value, increase }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-medium">{value}</span>
        {increase && <span className="text-xs text-green-600 font-medium">{increase}</span>}
      </div>
    </div>
  )
}
