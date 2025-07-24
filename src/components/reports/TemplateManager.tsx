import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Download, 
  Upload,
  FileText,
  Shield,
  AlertTriangle,
  Users,
  Search,
  FileCheck,
  Eye,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { SAMATemplate, TemplateSection, TemplateField } from '@/types/sama-reporting';
import { SAMA_TEMPLATES } from '@/services/samaReportService';

interface TemplateManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const TemplateManager: React.FC<TemplateManagerProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<SAMATemplate[]>(SAMA_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<SAMATemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Partial<SAMATemplate>>({});

  const templateTypes = [
    { value: 'incident', label: 'Incident Report', icon: AlertTriangle, color: 'text-red-500' },
    { value: 'regulatory', label: 'Regulatory Report', icon: Shield, color: 'text-blue-500' },
    { value: 'investigation', label: 'Investigation Report', icon: Search, color: 'text-purple-500' },
    { value: 'risk-assessment', label: 'Risk Assessment', icon: FileText, color: 'text-orange-500' },
    { value: 'compliance-audit', label: 'Compliance Audit', icon: FileCheck, color: 'text-green-500' },
    { value: 'executive', label: 'Executive Summary', icon: Users, color: 'text-indigo-500' }
  ];

  const standards = [
    { value: 'sama-standard', label: 'SAMA Standard', description: 'Saudi Central Bank regulatory standard' },
    { value: 'iso27001', label: 'ISO 27001', description: 'Information security management' },
    { value: 'nist', label: 'NIST Framework', description: 'US National Institute of Standards' },
    { value: 'custom', label: 'Custom Template', description: 'Organization-specific template' }
  ];

  const handleCreateTemplate = () => {
    setEditingTemplate({
      name: '',
      type: 'incident',
      standard: 'sama-standard',
      version: '1.0',
      sections: [],
      mandatoryFields: [],
      approvalWorkflow: [],
      retentionPeriod: 7,
      autoArchive: true
    });
    setIsEditing(true);
  };

  const handleEditTemplate = (template: SAMATemplate) => {
    setEditingTemplate({ ...template });
    setIsEditing(true);
  };

  const handleSaveTemplate = () => {
    if (!editingTemplate.name || !editingTemplate.type) {
      toast({
        title: "Validation Error",
        description: "Template name and type are required",
        variant: "destructive"
      });
      return;
    }

    const newTemplate: SAMATemplate = {
      id: editingTemplate.id || `template-${Date.now()}`,
      name: editingTemplate.name!,
      type: editingTemplate.type!,
      standard: editingTemplate.standard || 'sama-standard',
      version: editingTemplate.version || '1.0',
      sections: editingTemplate.sections || [],
      mandatoryFields: editingTemplate.mandatoryFields || [],
      approvalWorkflow: editingTemplate.approvalWorkflow || [],
      retentionPeriod: editingTemplate.retentionPeriod || 7,
      autoArchive: editingTemplate.autoArchive || true
    };

    if (editingTemplate.id) {
      // Update existing template
      setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? newTemplate : t));
      toast({
        title: "Template Updated",
        description: `Template "${newTemplate.name}" has been updated successfully`
      });
    } else {
      // Create new template
      setTemplates(prev => [...prev, newTemplate]);
      toast({
        title: "Template Created",
        description: `Template "${newTemplate.name}" has been created successfully`
      });
    }

    setIsEditing(false);
    setEditingTemplate({});
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(t => t.id !== templateId));
    toast({
      title: "Template Deleted",
      description: "Template has been deleted successfully"
    });
  };

  const handleDuplicateTemplate = (template: SAMATemplate) => {
    const duplicatedTemplate: SAMATemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Copy)`,
      version: '1.0'
    };
    setTemplates(prev => [...prev, duplicatedTemplate]);
    toast({
      title: "Template Duplicated",
      description: `Template "${duplicatedTemplate.name}" has been created`
    });
  };

  const handleExportTemplate = (template: SAMATemplate) => {
    const dataStr = JSON.stringify(template, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${template.name.replace(/\s+/g, '_')}_template.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Template Exported",
      description: `Template "${template.name}" has been exported`
    });
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = templateTypes.find(t => t.value === type);
    if (!typeConfig) return FileText;
    return typeConfig.icon;
  };

  const getTypeColor = (type: string) => {
    const typeConfig = templateTypes.find(t => t.value === type);
    return typeConfig?.color || 'text-gray-500';
  };

  const getStandardBadgeColor = (standard: string) => {
    switch (standard) {
      case 'sama-standard': return 'bg-blue-100 text-blue-800';
      case 'iso27001': return 'bg-green-100 text-green-800';
      case 'nist': return 'bg-purple-100 text-purple-800';
      case 'custom': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            SAMA Template Manager
          </DialogTitle>
          <DialogDescription>
            Manage SAMA-compliant report templates for your organization
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="templates" className="h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="editor">Template Editor</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-4 overflow-y-auto max-h-[60vh]">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-medium">Available Templates</h3>
                <Badge variant="outline">{templates.length} templates</Badge>
              </div>
              <Button onClick={handleCreateTemplate} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Template
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => {
                const TypeIcon = getTypeIcon(template.type);
                return (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group"
                  >
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <TypeIcon className={`h-5 w-5 ${getTypeColor(template.type)}`} />
                            <div>
                              <CardTitle className="text-sm">{template.name}</CardTitle>
                              <p className="text-xs text-muted-foreground">
                                Version {template.version}
                              </p>
                            </div>
                          </div>
                          <Badge className={getStandardBadgeColor(template.standard)}>
                            {template.standard.toUpperCase()}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-muted-foreground">Type:</span>
                            <p className="font-medium">{template.type.replace('-', ' ')}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Sections:</span>
                            <p className="font-medium">{template.sections.length}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Retention:</span>
                            <p className="font-medium">{template.retentionPeriod} years</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Auto Archive:</span>
                            <p className="font-medium">{template.autoArchive ? 'Yes' : 'No'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedTemplate(template)}
                            className="h-8 px-2"
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTemplate(template)}
                            className="h-8 px-2"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDuplicateTemplate(template)}
                            className="h-8 px-2"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleExportTemplate(template)}
                            className="h-8 px-2"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="h-8 px-2 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="editor" className="space-y-4 overflow-y-auto max-h-[60vh]">
            {isEditing ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">
                    {editingTemplate.id ? 'Edit Template' : 'Create New Template'}
                  </h3>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveTemplate} className="gap-2">
                      <Save className="h-4 w-4" />
                      Save Template
                    </Button>
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Template Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Template Name</Label>
                        <Input
                          id="name"
                          value={editingTemplate.name || ''}
                          onChange={(e) => setEditingTemplate({...editingTemplate, name: e.target.value})}
                          placeholder="Enter template name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="version">Version</Label>
                        <Input
                          id="version"
                          value={editingTemplate.version || ''}
                          onChange={(e) => setEditingTemplate({...editingTemplate, version: e.target.value})}
                          placeholder="1.0"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="type">Template Type</Label>
                        <Select
                          value={editingTemplate.type || ''}
                          onValueChange={(value) => setEditingTemplate({...editingTemplate, type: value as any})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select template type" />
                          </SelectTrigger>
                          <SelectContent>
                            {templateTypes.map((type) => {
                              const Icon = type.icon;
                              return (
                                <SelectItem key={type.value} value={type.value}>
                                  <div className="flex items-center gap-2">
                                    <Icon className={`h-4 w-4 ${type.color}`} />
                                    {type.label}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="standard">Standard</Label>
                        <Select
                          value={editingTemplate.standard || ''}
                          onValueChange={(value) => setEditingTemplate({...editingTemplate, standard: value as any})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select standard" />
                          </SelectTrigger>
                          <SelectContent>
                            {standards.map((standard) => (
                              <SelectItem key={standard.value} value={standard.value}>
                                <div>
                                  <div className="font-medium">{standard.label}</div>
                                  <div className="text-xs text-muted-foreground">{standard.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="retention">Retention Period (years)</Label>
                        <Input
                          id="retention"
                          type="number"
                          min="1"
                          max="50"
                          value={editingTemplate.retentionPeriod || 7}
                          onChange={(e) => setEditingTemplate({...editingTemplate, retentionPeriod: parseInt(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="autoArchive">Auto Archive</Label>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="autoArchive"
                            checked={editingTemplate.autoArchive || false}
                            onCheckedChange={(checked) => setEditingTemplate({...editingTemplate, autoArchive: checked})}
                          />
                          <span className="text-sm text-muted-foreground">
                            Automatically archive after retention period
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Template Selected</h3>
                <p className="text-muted-foreground mb-6">
                  Select a template to edit or create a new one
                </p>
                <Button onClick={handleCreateTemplate} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create New Template
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateManager;