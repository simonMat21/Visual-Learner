"use client";

import { useState, useEffect } from "react";

import { Slider } from "@/components/ui/slider2";
import NumberInput from "@/components/NumberInput";

import { CodeBlock, TextBox } from "@/components/CodeBlock";
import PhoneScreenBlock from "@/components/phoneScreenBlocker";
import AdBanner from "@/components/AdBanner";

import P5Sketch from "./P5Sketch";

export default function Home() {
  const [AEBool, setAEBool] = useState(true);
  const [addForm, setAddForm] = useState({ val: [], pos: 0, start: false });
  const [animSpd, setAnimSpd] = useState(1);
  const [sliderValue, setSliderValue] = useState([1]);
  const [sliderValue2, setSliderValue2] = useState([1]);
  const [sliderValue3, setSliderValue3] = useState([0.1]);

  const codeSnippets = {
    js: `// Adjacency List for Directed/Undirected Graph
class Graph {
  constructor(numVertices, isDirected = true) {
    this.numVertices = numVertices;
    this.isDirected = isDirected;
    this.adjList = {};
    
    // Initialize adjacency list
    for (let i = 0; i < numVertices; i++) {
      this.adjList[i] = [];
    }
  }
  
  // Add an edge between vertices
  addEdge(vertex1, vertex2) {
    if (vertex1 >= 0 && vertex1 < this.numVertices && 
        vertex2 >= 0 && vertex2 < this.numVertices) {
      
      // Add edge from vertex1 to vertex2
      if (!this.adjList[vertex1].includes(vertex2)) {
        this.adjList[vertex1].push(vertex2);
      }
      
      // For undirected graphs, add reverse edge
      if (!this.isDirected && vertex1 !== vertex2) {
        if (!this.adjList[vertex2].includes(vertex1)) {
          this.adjList[vertex2].push(vertex1);
        }
      }
    }
  }
  
  // Remove an edge between vertices
  removeEdge(vertex1, vertex2) {
    if (vertex1 >= 0 && vertex1 < this.numVertices && 
        vertex2 >= 0 && vertex2 < this.numVertices) {
      
      // Remove edge from vertex1 to vertex2
      this.adjList[vertex1] = this.adjList[vertex1].filter(v => v !== vertex2);
      
      // For undirected graphs, remove reverse edge
      if (!this.isDirected && vertex1 !== vertex2) {
        this.adjList[vertex2] = this.adjList[vertex2].filter(v => v !== vertex1);
      }
    }
  }
  
  // Check if edge exists
  hasEdge(vertex1, vertex2) {
    if (vertex1 >= 0 && vertex1 < this.numVertices && 
        vertex2 >= 0 && vertex2 < this.numVertices) {
      return this.adjList[vertex1].includes(vertex2);
    }
    return false;
  }
  
  // Get all neighbors of a vertex
  getNeighbors(vertex) {
    return this.adjList[vertex] || [];
  }
  
  // Get degree of a vertex
  getDegree(vertex) {
    return this.getNeighbors(vertex).length;
  }
  
  // Create from edge list
  static fromEdgeList(numVertices, edges, isDirected = true) {
    let graph = new Graph(numVertices, isDirected);
    edges.forEach(([vertex1, vertex2]) => {
      graph.addEdge(vertex1, vertex2);
    });
    return graph;
  }
  
  // Display adjacency list
  printAdjList() {
    console.log(\`Adjacency List (\${this.isDirected ? 'Directed' : 'Undirected'}):\`);
    for (let vertex in this.adjList) {
      console.log(\`\${vertex}: [\${this.adjList[vertex].join(', ')}]\`);
    }
  }
}

// Example usage
let directedGraph = new Graph(5, true);
directedGraph.addEdge(0, 1);
directedGraph.addEdge(0, 2);
directedGraph.addEdge(1, 3);
directedGraph.printAdjList();

let undirectedGraph = new Graph(5, false);
undirectedGraph.addEdge(0, 1);
undirectedGraph.addEdge(0, 2);
undirectedGraph.addEdge(1, 3);
undirectedGraph.printAdjList();`,

    idea: `Adjacency List for Directed/Undirected Graphs:

1. Array of lists where each index represents a vertex
2. adjList[i] contains all vertices connected to vertex i  
3. For directed graphs: only outgoing edges stored
4. For undirected graphs: both directions stored (symmetric)

Properties:
- Space complexity: O(V + E) where V=vertices, E=edges
- Add edge: O(1) 
- Remove edge: O(degree of vertex)
- Check edge: O(degree of vertex)
- Get neighbors: O(1) to access list

Use cases:
- Sparse graphs (few edges relative to vertices)
- When you need to iterate over neighbors frequently
- Social networks, web graphs, transportation networks`,
  };

  const updateForm = (n, key, value) => {
    if (key !== "start" || AEBool) {
      if (n == 1) {
        setAddForm((prev) => ({ ...prev, [key]: value }));
      }
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 50, behavior: "smooth" });
  }, []);

  return (
    <main className="vl-page">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />

      {/* Title */}
      <div className="max-w-6xl mx-auto px-8 mb-6">
        <div className="vl-hero">
          <div>
            <h1 className="vl-title text-4xl mb-2">
              Adjacency List for Directed Graphs
            </h1>
            <div className="vl-meta mt-3">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-rust rounded-full mr-2"></span>
                Space: O(V + E)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-rust rounded-full mr-2"></span>
                Add Edge: O(1)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pen-green rounded-full mr-2"></span>
                Dynamic Size
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization Section */}
      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="vl-card p-6">
          <P5Sketch
            k1={sliderValue[0]}
            k2={sliderValue2[0]}
            t={sliderValue3[0]}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-8 space-y-8">
        <AdBanner position="bottom" size="responsive" adTest="off" />

        {/* Description */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-4">
            Understanding Adjacency Lists
          </h2>
          <div className="space-y-4 text-ink-2 leading-relaxed">
            <p className="text-lg">
              An adjacency list is a collection of lists used to represent a
              graph. Each vertex has a list containing all vertices it is
              connected to. This representation is particularly efficient for
              sparse graphs where the number of edges is much smaller than the
              maximum possible number of edges.
            </p>
            <p className="text-lg">
              The key advantage is that it only stores existing edges, making it
              space-efficient for graphs with few connections relative to the
              total number of possible edges.
            </p>
            <div className="vl-note vl-note-rust p-4 my-4">
              <p className="text-center text-lg font-bold text-pen-rust">
                Space Usage: O(V + E) instead of O(V²) for adjacency matrix
              </p>
            </div>
          </div>
        </div>

        {/* Code Block */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Implementation
          </h2>
          <CodeBlock
            codeSnippets={codeSnippets}
            defaultLang="js"
            height="600px"
          />
        </div>

        {/* Performance Analysis */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Performance Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="vl-note vl-note-rust p-6">
              <h3 className="vl-h3 mb-2">
                Time Complexity
              </h3>
              <ul className="text-ink-2 space-y-2">
                <li>
                  •{" "}
                  <span className="text-pen-green font-semibold">
                    Add Edge:
                  </span>{" "}
                  O(1)
                </li>
                <li>
                  •{" "}
                  <span className="text-pen-gold font-semibold">
                    Remove Edge:
                  </span>{" "}
                  O(degree)
                </li>
                <li>
                  •{" "}
                  <span className="text-pen-gold font-semibold">
                    Check Edge:
                  </span>{" "}
                  O(degree)
                </li>
                <li>
                  •{" "}
                  <span className="text-pen-green font-semibold">
                    Get Neighbors:
                  </span>{" "}
                  O(1)
                </li>
              </ul>
            </div>
            <div className="vl-note vl-note-blue p-6">
              <h3 className="vl-h3 mb-2">
                Space Complexity
              </h3>
              <ul className="text-ink-2 space-y-2">
                <li>
                  •{" "}
                  <span className="text-pen-blue font-semibold">
                    Total Space:
                  </span>{" "}
                  O(V + E)
                </li>
                <li>
                  •{" "}
                  <span className="text-pen-blue font-semibold">
                    Per Vertex:
                  </span>{" "}
                  O(degree)
                </li>
                <li>
                  •{" "}
                  <span className="text-pen-blue font-semibold">
                    Sparse Graphs:
                  </span>{" "}
                  Much better than O(V²)
                </li>
                <li>
                  •{" "}
                  <span className="text-pen-blue font-semibold">Dynamic:</span>{" "}
                  Grows with actual edges
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Comparisons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Advantages</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>
                • <span className="text-pen-green">Space efficient:</span>{" "}
                Only stores existing edges
              </li>
              <li>
                •{" "}
                <span className="text-pen-green">
                  Fast neighbor iteration:
                </span>{" "}
                Direct access to adjacency list
              </li>
              <li>
                • <span className="text-pen-green">Dynamic size:</span> Adapts
                to actual graph density
              </li>
              <li>
                • <span className="text-pen-green">Memory locality:</span>{" "}
                Better cache performance for sparse graphs
              </li>
              <li>
                •{" "}
                <span className="text-pen-green">Easy to add vertices:</span>{" "}
                Just add new list
              </li>
            </ul>
          </div>
          <div className="vl-card p-6">
            <h3 className="vl-h3 mb-4">
               <span>Disadvantages</span>
            </h3>
            <ul className="text-ink-2 leading-relaxed space-y-2">
              <li>
                • <span className="text-pen-gold">Slower edge queries:</span>{" "}
                O(degree) vs O(1) for matrix
              </li>
              <li>
                • <span className="text-pen-gold">Complex deletion:</span> Need
                to search through lists
              </li>
              <li>
                • <span className="text-pen-gold">No direct indexing:</span>{" "}
                Can&apos;t directly access edge weights
              </li>
              <li>
                • <span className="text-pen-gold">Memory fragmentation:</span>{" "}
                Dynamic allocation overhead
              </li>
              <li>
                • <span className="text-pen-gold">Dense graphs:</span> May use
                more space than matrix
              </li>
            </ul>
          </div>
        </div>

        {/* Use Cases */}
        <div className="vl-card p-8">
          <h2 className="vl-h2 mb-6">
            Best Use Cases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="vl-note vl-note-plum p-4">
              <h4 className="text-md font-semibold text-pen-plum mb-2">
                Sparse Graphs
              </h4>
              <p className="text-sm text-ink-2">
                When edges &lt;&lt; V², adjacency lists save significant space
              </p>
            </div>
            <div className="vl-note vl-note-blue p-4">
              <h4 className="text-md font-semibold text-pen-blue mb-2">
                Graph Traversal
              </h4>
              <p className="text-sm text-ink-2">
                DFS, BFS benefit from fast neighbor iteration
              </p>
            </div>
            <div className="vl-note vl-note-green p-4">
              <h4 className="text-md font-semibold text-pen-green mb-2">
                Dynamic Graphs
              </h4>
              <p className="text-sm text-ink-2">
                When vertices/edges are frequently added/removed
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Banner Ad */}
        <AdBanner
          position="bottom"
          size="responsive"
          adTest="off"
          adSlot="9575932649"
        />

        {/* Bottom Spacer */}
        <div className="h-12"></div>
      </div>
    </main>
  );
}
