import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { NetworkNode, NetworkLink, PatternType } from '@/types/pattern-detection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface NetworkGraphProps {
  nodes: NetworkNode[];
  links: NetworkLink[];
  selectedPattern?: PatternType | null;
  onNodeClick?: (node: NetworkNode) => void;
  height?: number;
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({
  nodes,
  links,
  selectedPattern,
  onNodeClick,
  height = 400,
}) => {
  const { t } = useLanguage();
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);

  useEffect(() => {
    if (!svgRef.current || !nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const actualHeight = height;

    // Filter data based on selected pattern
    const filteredNodes = selectedPattern 
      ? nodes.filter(node => node.suspicious || node.riskScore > 70)
      : nodes;
    
    const filteredLinks = selectedPattern
      ? links.filter(link => link.suspicious)
      : links;

    // Create simulation
    const simulation = d3.forceSimulation(filteredNodes)
      .force('link', d3.forceLink(filteredLinks).id((d: any) => d.id).distance(50))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, actualHeight / 2))
      .force('collision', d3.forceCollide().radius(20));

    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 3])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
      });

    svg.call(zoom as any);

    // Create container for zoom/pan
    const container = svg.append('g');

    // Create links
    const link = container.append('g')
      .selectAll('line')
      .data(filteredLinks)
      .enter().append('line')
      .attr('stroke', d => d.suspicious ? 'hsl(var(--destructive))' : 'hsl(var(--border))')
      .attr('stroke-opacity', d => d.suspicious ? 0.8 : 0.3)
      .attr('stroke-width', d => Math.sqrt(d.strength * 5) + 1);

    // Node color scale
    const nodeColor = (node: NetworkNode) => {
      if (node.suspicious) return 'hsl(var(--destructive))';
      if (node.riskScore > 70) return 'hsl(var(--warning))';
      if (node.riskScore > 30) return 'hsl(var(--primary))';
      return 'hsl(var(--muted))';
    };

    // Node size scale
    const nodeSize = (node: NetworkNode) => {
      const baseSize = node.type === 'transaction' ? 8 : 12;
      return baseSize + (node.riskScore / 100) * 8;
    };

    // Create nodes
    const node = container.append('g')
      .selectAll('circle')
      .data(filteredNodes)
      .enter().append('circle')
      .attr('r', nodeSize)
      .attr('fill', nodeColor)
      .attr('stroke', 'hsl(var(--background))')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .call(d3.drag<SVGCircleElement, NetworkNode>()
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
      .data(filteredNodes)
      .enter().append('text')
      .text(d => d.label)
      .attr('font-size', '10px')
      .attr('fill', 'hsl(var(--foreground))')
      .attr('text-anchor', 'middle')
      .attr('dy', -15)
      .style('pointer-events', 'none');

    // Node interactions
    node
      .on('mouseover', function(event, d) {
        d3.select(this).attr('r', nodeSize(d) + 2);
        setSelectedNode(d);
      })
      .on('mouseout', function(event, d) {
        d3.select(this).attr('r', nodeSize(d));
        setSelectedNode(null);
      })
      .on('click', (event, d) => {
        onNodeClick?.(d);
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
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, links, selectedPattern, height, onNodeClick]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {t('patternDetection.networkGraph')}
          {selectedNode && (
            <div className="text-sm font-normal text-muted-foreground">
              {selectedNode.label} - Risk: {selectedNode.riskScore.toFixed(1)}%
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <svg
            ref={svgRef}
            width="100%"
            height={height}
            className="border rounded-lg bg-card"
          />
          
          {/* Legend */}
          <div className="absolute top-4 left-4 bg-card/90 p-3 rounded-lg border text-sm">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span>{t('patternDetection.legend.suspicious')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-warning" />
                <span>{t('patternDetection.legend.highRisk')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span>{t('patternDetection.legend.mediumRisk')}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted" />
                <span>{t('patternDetection.legend.lowRisk')}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};