import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Play, 
  RefreshCw,
  Server,
  Shield,
  Zap,
  Users,
  Database,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';
import { runProductionTests, quickHealthCheck } from '@/utils/productionTest';

const ProductionChecklist = () => {
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [healthStatus, setHealthStatus] = useState('unknown');

  // Production readiness checklist
  const [checklist, setChecklist] = useState([
    {
      category: 'Server Infrastructure',
      icon: Server,
      items: [
        { name: 'Environment Variables', status: 'unknown', critical: true },
        { name: 'Database Connection', status: 'unknown', critical: true },
        { name: 'Health Check Endpoint', status: 'unknown', critical: false },
        { name: 'Error Handling', status: 'unknown', critical: true },
        { name: 'Logging System', status: 'unknown', critical: false },
        { name: 'CORS Configuration', status: 'unknown', critical: true }
      ]
    },
    {
      category: 'Security',
      icon: Shield,
      items: [
        { name: 'JWT Authentication', status: 'unknown', critical: true },
        { name: 'Input Validation', status: 'unknown', critical: true },
        { name: 'SQL Injection Protection', status: 'unknown', critical: true },
        { name: 'XSS Protection', status: 'unknown', critical: true },
        { name: 'Rate Limiting', status: 'unknown', critical: false },
        { name: 'HTTPS Configuration', status: 'unknown', critical: true }
      ]
    },
    {
      category: 'Performance',
      icon: Zap,
      items: [
        { name: 'API Response Times', status: 'unknown', critical: false },
        { name: 'Database Queries', status: 'unknown', critical: false },
        { name: 'Image Optimization', status: 'unknown', critical: false },
        { name: 'Caching Strategy', status: 'unknown', critical: false },
        { name: 'Bundle Size', status: 'unknown', critical: false }
      ]
    },
    {
      category: 'User Experience',
      icon: Users,
      items: [
        { name: 'Error Boundaries', status: 'passed', critical: true },
        { name: 'Loading States', status: 'passed', critical: true },
        { name: 'Form Validation', status: 'passed', critical: true },
        { name: 'Responsive Design', status: 'unknown', critical: true },
        { name: 'Accessibility', status: 'unknown', critical: false },
        { name: '404 Page', status: 'passed', critical: true }
      ]
    },
    {
      category: 'Data Management',
      icon: Database,
      items: [
        { name: 'User Registration', status: 'unknown', critical: true },
        { name: 'User Authentication', status: 'unknown', critical: true },
        { name: 'Course Management', status: 'unknown', critical: true },
        { name: 'Purchase System', status: 'unknown', critical: true },
        { name: 'Progress Tracking', status: 'unknown', critical: true },
        { name: 'Data Backup', status: 'unknown', critical: false }
      ]
    },
    {
      category: 'Deployment',
      icon: Globe,
      items: [
        { name: 'Build Process', status: 'unknown', critical: true },
        { name: 'Environment Configuration', status: 'unknown', critical: true },
        { name: 'Static Assets', status: 'unknown', critical: true },
        { name: 'API Documentation', status: 'unknown', critical: false },
        { name: 'Monitoring Setup', status: 'unknown', critical: false }
      ]
    }
  ]);

  // Calculate overall progress
  const calculateProgress = () => {
    const allItems = checklist.flatMap(category => category.items);
    const completedItems = allItems.filter(item => item.status === 'passed').length;
    return Math.round((completedItems / allItems.length) * 100);
  };

  // Get status counts
  const getStatusCounts = () => {
    const allItems = checklist.flatMap(category => category.items);
    return {
      passed: allItems.filter(item => item.status === 'passed').length,
      failed: allItems.filter(item => item.status === 'failed').length,
      unknown: allItems.filter(item => item.status === 'unknown').length,
      total: allItems.length
    };
  };

  // Run quick health check
  const runHealthCheck = async () => {
    setHealthStatus('checking');
    const isHealthy = await quickHealthCheck();
    setHealthStatus(isHealthy ? 'healthy' : 'unhealthy');
  };

  // Run comprehensive tests
  const runTests = async () => {
    setIsRunning(true);
    toast.info('Running production tests...');
    
    try {
      const results = await runProductionTests();
      setTestResults(results);
      
      // Update checklist based on test results
      updateChecklistFromResults(results);
      
      toast.success('Production tests completed!');
    } catch (error) {
      toast.error('Failed to run production tests');
      console.error('Test error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  // Update checklist based on test results
  const updateChecklistFromResults = (results) => {
    setChecklist(prev => prev.map(category => ({
      ...category,
      items: category.items.map(item => {
        // Map test results to checklist items
        const testResult = results.details.find(test => 
          test.name.toLowerCase().includes(item.name.toLowerCase())
        );
        
        if (testResult) {
          return { ...item, status: testResult.passed ? 'passed' : 'failed' };
        }
        
        return item;
      })
    })));
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  // Get status badge
  const getStatusBadge = (status, critical) => {
    const variant = status === 'passed' ? 'default' : 
                   status === 'failed' ? 'destructive' : 'secondary';
    
    return (
      <Badge variant={variant} className="text-xs">
        {status === 'unknown' ? 'Pending' : status}
        {critical && status !== 'passed' && ' ⚠️'}
      </Badge>
    );
  };

  useEffect(() => {
    runHealthCheck();
  }, []);

  const progress = calculateProgress();
  const statusCounts = getStatusCounts();

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Production Readiness Checklist
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Comprehensive testing and validation for production deployment
        </p>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Overall Progress</span>
            <Badge variant={progress >= 90 ? 'default' : progress >= 70 ? 'secondary' : 'destructive'}>
              {progress}% Complete
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="mb-4" />
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{statusCounts.passed}</div>
              <div className="text-sm text-gray-500">Passed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">{statusCounts.failed}</div>
              <div className="text-sm text-gray-500">Failed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">{statusCounts.unknown}</div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{statusCounts.total}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <Button 
          onClick={runHealthCheck} 
          variant="outline"
          disabled={healthStatus === 'checking'}
        >
          {healthStatus === 'checking' ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Server className="w-4 h-4 mr-2" />
          )}
          Health Check
        </Button>
        
        <Button 
          onClick={runTests} 
          disabled={isRunning}
        >
          {isRunning ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Play className="w-4 h-4 mr-2" />
          )}
          Run All Tests
        </Button>
      </div>

      {/* Health Status */}
      {healthStatus !== 'unknown' && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center space-x-2">
              {healthStatus === 'healthy' ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : healthStatus === 'unhealthy' ? (
                <XCircle className="w-6 h-6 text-red-500" />
              ) : (
                <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
              )}
              <span className="text-lg font-medium">
                System Status: {healthStatus === 'checking' ? 'Checking...' : 
                               healthStatus === 'healthy' ? 'Healthy' : 'Unhealthy'}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Checklist Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {checklist.map((category, categoryIndex) => {
          const Icon = category.icon;
          const categoryPassed = category.items.filter(item => item.status === 'passed').length;
          const categoryTotal = category.items.length;
          const categoryProgress = Math.round((categoryPassed / categoryTotal) * 100);

          return (
            <Card key={categoryIndex}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-5 h-5" />
                    <span>{category.category}</span>
                  </div>
                  <Badge variant={categoryProgress >= 80 ? 'default' : 'secondary'}>
                    {categoryPassed}/{categoryTotal}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(item.status)}
                        <span className={`text-sm ${item.critical ? 'font-medium' : ''}`}>
                          {item.name}
                        </span>
                      </div>
                      {getStatusBadge(item.status, item.critical)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Test Results */}
      {testResults && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm text-gray-600">
                Success Rate: {((testResults.passed / testResults.total) * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">
                Total Tests: {testResults.total} | Passed: {testResults.passed} | Failed: {testResults.failed}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductionChecklist;
