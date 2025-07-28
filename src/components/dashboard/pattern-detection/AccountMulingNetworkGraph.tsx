import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowRightLeft, AlertTriangle, DollarSign } from 'lucide-react';

interface MulingNode {
  id: string;
  label: string;
  type: 'source' | 'mule' | 'destination';
  amount: number;
  riskScore: number;
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
}

interface MulingLink {
  source: string | MulingNode;
  target: string | MulingNode;
  amount: number;
  timestamp: Date;
  suspicious: boolean;
}

interface AccountMulingNetworkGraphProps {
  height?: number;
}

export const AccountMulingNetworkGraph: React.FC<AccountMulingNetworkGraphProps> = ({
  height = 500,
}) => {
  const { t } = useLanguage();
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<MulingNode | null>(null);
  const [data, setData] = useState<{ nodes: MulingNode[]; links: MulingLink[] }>({
    nodes: [],
    links: []
  });

  // Generate mock muling network data
  useEffect(() => {
    const generateMulingData = () => {
      const nodes: MulingNode[] = [
        // Source accounts (where money originates)
        { id: 'source-1', label: 'Fraud Source A', type: 'source', amount: 50000, riskScore: 95 },
        { id: 'source-2', label: 'Fraud Source B', type: 'source', amount: 35000, riskScore: 88 },
        
        // Mule accounts (intermediary accounts)
        { id: 'mule-1', label: 'Mule Account 1', type: 'mule', amount: 15000, riskScore: 92 },
        { id: 'mule-2', label: 'Mule Account 2', type: 'mule', amount: 22000, riskScore: 87 },
        { id: 'mule-3', label: 'Mule Account 3', type: 'mule', amount: 18000, riskScore: 90 },
        { id: 'mule-4', label: 'Mule Account 4', type: 'mule', amount: 12000, riskScore: 85 },
        
        // Destination accounts (final destination)
        { id: 'dest-1', label: 'Final Destination A', type: 'destination', amount: 40000, riskScore: 78 },
        { id: 'dest-2', label: 'Final Destination B', type: 'destination', amount: 27000, riskScore: 82 }
      ];

      const links: MulingLink[] = [
        // Money flow from sources to mules
        { source: 'source-1', target: 'mule-1', amount: 15000, timestamp: new Date(), suspicious: true },
        { source: 'source-1', target: 'mule-2', amount: 22000, timestamp: new Date(), suspicious: true },
        { source: 'source-2', target: 'mule-3', amount: 18000, timestamp: new Date(), suspicious: true },
        { source: 'source-2', target: 'mule-4', amount: 12000, timestamp: new Date(), suspicious: true },
        
        // Money flow from mules to destinations
        { source: 'mule-1', target: 'dest-1', amount: 14500, timestamp: new Date(), suspicious: true },
        { source: 'mule-2', target: 'dest-1', amount: 21500, timestamp: new Date(), suspicious: true },
        { source: 'mule-3', target: 'dest-2', amount: 17500, timestamp: new Date(), suspicious: true },
        { source: 'mule-4', target: 'dest-2', amount: 11800, timestamp: new Date(), suspicious: true },
        
        // Inter-mule transfers (layering)
        { source: 'mule-1', target: 'mule-3', amount: 500, timestamp: new Date(), suspicious: true },
        { source: 'mule-2', target: 'mule-4', amount: 700, timestamp: new Date(), suspicious: true }
      ];

      setData({ nodes, links });
    };

    generateMulingData();
  }, []);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const actualHeight = height;

    // Create simulation with custom forces for muling layout
    const simulation = d3.forceSimulation(data.nodes)
      .force('link', d3.forceLink(data.links).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, actualHeight / 2))
      .force('collision', d3.forceCollide().radius(30))
      .force('x', d3.forceX((d: any) => {
        // Position nodes by type: sources left, mules center, destinations right
        if (d.type === 'source') return width * 0.2;
        if (d.type === 'mule') return width * 0.5;
        return width * 0.8;
      }).strength(0.8))
      .force('y', d3.forceY(actualHeight / 2).strength(0.1));

    const container = svg.append('g');

    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 3])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });

    svg.call(zoom as any);

    // Create arrow markers for money flow direction
    const defs = svg.append('defs');
    defs.append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 8)
      .attr('markerHeight', 8)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', 'hsl(var(--destructive))')
      .style('stroke', 'none');

    // Create links (money flow)
    const link = container.append('g')
      .selectAll('line')
      .data(data.links)
      .enter().append('line')
      .attr('stroke', 'hsl(var(--destructive))')
      .attr('stroke-width', d => Math.sqrt(d.amount / 1000) + 2)
      .attr('stroke-opacity', 0.8)
      .attr('marker-end', 'url(#arrowhead)');

    // Node color based on type
    const nodeColor = (node: MulingNode) => {
      switch (node.type) {
        case 'source': return 'hsl(var(--destructive))';
        case 'mule': return 'hsl(var(--warning))';
        case 'destination': return 'hsl(var(--primary))';
        default: return 'hsl(var(--muted))';
      }
    };

    // Node size based on amount
    const nodeSize = (node: MulingNode) => {
      return 15 + Math.sqrt(node.amount / 1000);
    };

    // Create nodes
    const node = container.append('g')
      .selectAll('circle')
      .data(data.nodes)
      .enter().append('circle')
      .attr('r', nodeSize)
      .attr('fill', nodeColor)
      .attr('stroke', 'hsl(var(--background))')
      .attr('stroke-width', 3)
      .style('cursor', 'pointer')
      .call(d3.drag<SVGCircleElement, MulingNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Add node labels
    const labels = container.append('g')
      .selectAll('text')
      .data(data.nodes)
      .enter().append('text')
      .text(d => d.label)
      .attr('font-size', '12px')
      .attr('fill', 'hsl(var(--foreground))')
      .attr('text-anchor', 'middle')
      .attr('dy', -25)
      .style('pointer-events', 'none')
      .style('font-weight', 'bold');

    // Add amount labels on nodes
    const amountLabels = container.append('g')
      .selectAll('text')
      .data(data.nodes)
      .enter().append('text')
      .text(d => `$${(d.amount / 1000).toFixed(0)}K`)
      .attr('font-size', '10px')
      .attr('fill', 'hsl(var(--foreground))')
      .attr('text-anchor', 'middle')
      .attr('dy', 4)
      .style('pointer-events', 'none');

    // Add amount labels on links
    const linkLabels = container.append('g')
      .selectAll('text')
      .data(data.links)
      .enter().append('text')
      .text(d => `$${(d.amount / 1000).toFixed(0)}K`)
      .attr('font-size', '9px')
      .attr('fill', 'hsl(var(--destructive))')
      .attr('text-anchor', 'middle')
      .style('pointer-events', 'none')
      .style('font-weight', 'bold');

    // Node interactions
    node
      .on('mouseover', function(event, d) {
        d3.select(this).attr('r', nodeSize(d) + 3);
        setSelectedNode(d);
      })
      .on('mouseout', function(event, d) {
        d3.select(this).attr('r', nodeSize(d));
        setSelectedNode(null);
      });

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', d => d.x!)
        .attr('cy', d => d.y!);

      labels
        .attr('x', d => d.x!)
        .attr('y', d => d.y!);

      amountLabels
        .attr('x', d => d.x!)
        .attr('y', d => d.y!);

      linkLabels
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2);
    });

    return () => {
      simulation.stop();
    };
  }, [data, height]);

  const totalAmount = data.links.reduce((sum, link) => sum + link.amount, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5 text-destructive" />
          Account Muling Network Analysis
          {selectedNode && (
            <div className="text-sm font-normal text-muted-foreground ml-auto">
              {selectedNode.label} - ${(selectedNode.amount / 1000).toFixed(0)}K - Risk: {selectedNode.riskScore}%
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">${(totalAmount / 1000).toFixed(0)}K</div>
              <div className="text-sm text-muted-foreground">Total Flow</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{data.nodes.filter(n => n.type === 'mule').length}</div>
              <div className="text-sm text-muted-foreground">Mule Accounts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{data.links.length}</div>
              <div className="text-sm text-muted-foreground">Transfers</div>
            </div>
          </div>

          <div className="relative">
            <svg
              ref={svgRef}
              width="100%"
              height={height}
              className="border rounded-lg bg-card"
            />
            
            {/* Legend */}
            <div className="absolute top-4 left-4 bg-card/90 p-3 rounded-lg border text-sm space-y-2">
              <div className="font-semibold flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                Money Muling Network
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <span>Fraud Source</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <span>Mule Account</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span>Final Destination</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <ArrowRightLeft className="h-3 w-3 text-destructive" />
                  <span>Money Flow</span>
                </div>
              </div>
            </div>

            {/* Flow Direction Indicator */}
            <div className="absolute top-4 right-4 bg-card/90 p-3 rounded-lg border text-sm">
              <div className="flex items-center gap-2 text-destructive">
                <DollarSign className="h-4 w-4" />
                <span>Flow Direction: Source → Mule → Destination</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};