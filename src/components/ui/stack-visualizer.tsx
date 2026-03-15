"use client";

import { useEffect, useRef, useState } from "react";
// @ts-ignore
import ForceGraph3D from "react-force-graph-3d";
import * as THREE from "three";

const mockGraphData = {
    nodes: [
        { id: "TypeScript", group: 1, val: 20 },
        { id: "Next.js", group: 2, val: 15 },
        { id: "React", group: 2, val: 15 },
        { id: "Tailwind", group: 3, val: 10 },
        { id: "Node.js", group: 4, val: 10 },
        { id: "Prisma", group: 4, val: 12 },
        { id: "PostgreSQL", group: 5, val: 18 }
    ],
    links: [
        { source: "TypeScript", target: "Next.js" },
        { source: "TypeScript", target: "Node.js" },
        { source: "Next.js", target: "React" },
        { source: "React", target: "Tailwind" },
        { source: "Next.js", target: "Prisma" },
        { source: "Prisma", target: "PostgreSQL" }
    ]
};

export function StackVisualizer({ data }: { data?: any }) {
    const fgRef = useRef<any>(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 400 });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const updateDimensions = () => {
            const container = document.getElementById("stack-container");
            if (container) {
                setDimensions({
                    width: container.offsetWidth,
                    height: container.offsetHeight
                });
            }
        };

        updateDimensions();
        setTimeout(updateDimensions, 100);
        window.addEventListener("resize", updateDimensions);

        return () => {
            window.removeEventListener("resize", updateDimensions);
        };
    }, []);

    useEffect(() => {
        if (mounted && fgRef.current) {
            // Configure forces to prevent overlap and increase spacing
            // Heavy clustering for a massive "Neural Core" aesthetic
            fgRef.current.d3Force("charge").strength(-80);
            fgRef.current.d3Force("link").distance(40);
            fgRef.current.d3Force("collide", (d: any) => Math.sqrt(d.val || 10) * 12);
            
            // Auto rotate camera
            let angle = 0;
            const distance = 250;
            const interval = setInterval(() => {
                if (fgRef.current) {
                    fgRef.current.cameraPosition({
                        x: distance * Math.sin(angle),
                        z: distance * Math.cos(angle),
                        y: 80 * Math.cos(angle * 0.5)
                    });
                    angle += Math.PI / 600;
                }
            }, 20);

            return () => clearInterval(interval);
        }
    }, [mounted]);

    const colors = ["#6366f1", "#0ea5e9", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6", "#d946ef"];
    
    if (!mounted) return (
        <div id="stack-container" className="w-full h-[350px] md:h-[450px] rounded-[2rem] overflow-hidden border border-white/5 bg-black/40 relative animate-pulse flex items-center justify-center">
             <div className="text-white/20 font-black text-[10px] uppercase tracking-widest text-center">
                Syncing_Graph_Data...
             </div>
        </div>
    );

    return (
        <div id="stack-container" className="w-full h-[350px] md:h-[450px] rounded-[2rem] overflow-hidden border border-white/5 bg-black/40 relative">
            <ForceGraph3D
                ref={fgRef}
                graphData={data || mockGraphData}
                width={dimensions.width}
                height={dimensions.height}
                backgroundColor="#050505"
                showNavInfo={false}
                
                nodeColor={(node: any) => colors[node.group % colors.length]}
                linkColor={() => "#222222"}
                
                // Node Aesthetics
                nodeThreeObject={(node: any) => {
                    const groupIndex = (node && typeof node.group === 'number' && !isNaN(node.group)) ? node.group : 0;
                    const color = colors[Math.abs(groupIndex) % colors.length] || colors[0];
                    const size = Math.sqrt((node && node.val) || 10) * 4;
                    
                    const group = new THREE.Group();
                    
                    // Core glow sphere
                    const coreGeom = new THREE.SphereGeometry(size * 0.5, 32, 32);
                    const coreMat = new THREE.MeshPhongMaterial({
                        color: new THREE.Color(color),
                        emissive: new THREE.Color(color),
                        emissiveIntensity: 2,
                        transparent: true,
                        opacity: 0.9
                    });
                    group.add(new THREE.Mesh(coreGeom, coreMat));

                    // Outer glass shell
                    const shellGeom = new THREE.SphereGeometry(size, 32, 32);
                    const shellMat = new THREE.MeshPhongMaterial({
                        color: new THREE.Color(color),
                        transparent: true,
                        opacity: 0.1,
                        shininess: 100,
                        specular: new THREE.Color("#ffffff")
                    });
                    group.add(new THREE.Mesh(shellGeom, shellMat));

                    return group;
                }}

                // Link Aesthetics
                // Link Aesthetics
                linkWidth={0.8}
                linkDirectionalParticles={1}
                linkDirectionalParticleWidth={1}
                linkDirectionalParticleSpeed={0.002}
                
                // Interaction
                enableNodeDrag={false}
                enableNavigationControls={false}
            />

            <div className="absolute top-8 left-8 pointer-events-none">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 block mb-1">Architecture</span>
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">Tech-Stack Topology</h3>
            </div>

            <div className="absolute inset-0 pointer-events-none rounded-[2rem] shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
        </div>
    );
}
