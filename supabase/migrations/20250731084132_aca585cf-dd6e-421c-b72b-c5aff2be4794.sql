-- Create enum types
CREATE TYPE public.pattern_type AS ENUM (
  'velocity_attack', 
  'account_takeover', 
  'location_anomaly', 
  'amount_pattern', 
  'merchant_fraud', 
  'time_based',
  'account_muling'
);

CREATE TYPE public.node_type AS ENUM ('transaction', 'account', 'merchant', 'location');
CREATE TYPE public.relationship_type AS ENUM ('same_account', 'same_merchant', 'same_location', 'time_proximity');
CREATE TYPE public.severity_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE public.alert_status AS ENUM ('new', 'investigating', 'resolved', 'dismissed');
CREATE TYPE public.transaction_status AS ENUM ('pending', 'completed', 'failed', 'cancelled');
CREATE TYPE public.report_type AS ENUM ('daily', 'weekly', 'monthly', 'quarterly', 'incident', 'sama_compliance');

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  transaction_id TEXT NOT NULL UNIQUE,
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  merchant_name TEXT NOT NULL,
  merchant_category TEXT,
  location TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status transaction_status NOT NULL DEFAULT 'completed',
  risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  is_suspicious BOOLEAN NOT NULL DEFAULT false,
  card_number_masked TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create network nodes table
CREATE TABLE public.network_nodes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  node_id TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  type node_type NOT NULL,
  risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  amount DECIMAL(15,2),
  suspicious BOOLEAN NOT NULL DEFAULT false,
  x_position DECIMAL(10,2),
  y_position DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create network links table
CREATE TABLE public.network_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  source_node_id TEXT NOT NULL,
  target_node_id TEXT NOT NULL,
  relationship relationship_type NOT NULL,
  strength DECIMAL(3,2) NOT NULL CHECK (strength >= 0 AND strength <= 1),
  suspicious BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  FOREIGN KEY (source_node_id) REFERENCES public.network_nodes(node_id),
  FOREIGN KEY (target_node_id) REFERENCES public.network_nodes(node_id)
);

-- Create timeline events table
CREATE TABLE public.timeline_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  risk_score INTEGER NOT NULL CHECK (risk_score >= 0 AND risk_score <= 100),
  pattern_type pattern_type NOT NULL,
  location TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  merchant TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create heatmap data table
CREATE TABLE public.heatmap_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  x_coordinate TEXT NOT NULL,
  y_coordinate TEXT NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  suspicious BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pattern badges table
CREATE TABLE public.pattern_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type pattern_type NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  severity severity_level NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create alerts table
CREATE TABLE public.alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity severity_level NOT NULL,
  status alert_status NOT NULL DEFAULT 'new',
  transaction_id TEXT,
  user_id UUID,
  assigned_to UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create reports table
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type report_type NOT NULL,
  description TEXT,
  generated_by UUID NOT NULL,
  file_path TEXT,
  file_size INTEGER,
  parameters JSONB,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create report templates table
CREATE TABLE public.report_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type report_type NOT NULL,
  description TEXT,
  template_config JSONB NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create metrics table for dashboard
CREATE TABLE public.dashboard_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  total_transactions INTEGER NOT NULL DEFAULT 0,
  flagged_transactions INTEGER NOT NULL DEFAULT 0,
  risk_score_avg DECIMAL(5,2) NOT NULL DEFAULT 0,
  false_positive_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(date)
);

-- Enable Row Level Security
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heatmap_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pattern_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_metrics ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing all authenticated users for now - adjust as needed)
CREATE POLICY "Allow authenticated users to view transactions" ON public.transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to view network nodes" ON public.network_nodes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to view network links" ON public.network_links FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to view timeline events" ON public.timeline_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to view heatmap data" ON public.heatmap_data FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to view pattern badges" ON public.pattern_badges FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to view alerts" ON public.alerts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to view reports" ON public.reports FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to view report templates" ON public.report_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated users to view dashboard metrics" ON public.dashboard_metrics FOR SELECT TO authenticated USING (true);

-- Create indexes for better performance
CREATE INDEX idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX idx_transactions_timestamp ON public.transactions(timestamp);
CREATE INDEX idx_transactions_risk_score ON public.transactions(risk_score);
CREATE INDEX idx_transactions_suspicious ON public.transactions(is_suspicious);
CREATE INDEX idx_alerts_status ON public.alerts(status);
CREATE INDEX idx_alerts_severity ON public.alerts(severity);
CREATE INDEX idx_alerts_created_at ON public.alerts(created_at);
CREATE INDEX idx_reports_type ON public.reports(type);
CREATE INDEX idx_network_nodes_type ON public.network_nodes(type);
CREATE INDEX idx_timeline_events_timestamp ON public.timeline_events(timestamp);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pattern_badges_updated_at
  BEFORE UPDATE ON public.pattern_badges
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alerts_updated_at
  BEFORE UPDATE ON public.alerts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_report_templates_updated_at
  BEFORE UPDATE ON public.report_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();