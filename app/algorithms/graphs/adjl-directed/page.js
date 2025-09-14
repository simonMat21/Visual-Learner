"use client";

import { useState, useEffect } from "react";

import { Slider } from "@/components/ui/slider2";
import NumberInput from "@/components/NumberInput";

import { CodeBlock, TextBox } from "@/components/CodeBlock";
import PhoneScreenBlock from "@/components/phoneScreenBlocker";

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
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white pt-5">
      <PhoneScreenBlock message="Please switch to desktop mode to view this website" />

      {/* Visualization Section */}
      <div className="max-w-6xl mx-auto px-8 mb-12">
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
          <P5Sketch
            k1={sliderValue[0]}
            k2={sliderValue2[0]}
            t={sliderValue3[0]}
          />
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-8 space-y-8">
        {/* Algorithm Info */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent mb-2">
              Adjacency List for Directed/Undirected Graphs
            </h1>
            <div className="inline-flex items-center space-x-4 text-sm bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-full px-4 py-2 mt-3 border border-orange-400/30">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-orange-400 rounded-full mr-2"></span>
                Space: O(V + E)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                Add Edge: O(1)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Dynamic Size
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-orange-300 mb-4 flex items-center">
            <span className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-3 text-sm">
              📋
            </span>
            Understanding Adjacency Lists
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
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
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-4 my-4">
              <p className="text-center text-lg font-bold text-orange-400">
                Space Usage: O(V + E) instead of O(V²) for adjacency matrix
              </p>
            </div>
          </div>
        </div>

        {/* Code Block */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-red-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3 text-sm">
              💻
            </span>
            Implementation
          </h2>
          <CodeBlock
            codeSnippets={codeSnippets}
            defaultLang="js"
            height="600px"
          />
        </div>

        {/* Performance Analysis */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-blue-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-sm">
              📊
            </span>
            Performance Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-orange-300 mb-2">
                Time Complexity
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>
                  •{" "}
                  <span className="text-green-400 font-semibold">
                    Add Edge:
                  </span>{" "}
                  O(1)
                </li>
                <li>
                  •{" "}
                  <span className="text-yellow-400 font-semibold">
                    Remove Edge:
                  </span>{" "}
                  O(degree)
                </li>
                <li>
                  •{" "}
                  <span className="text-yellow-400 font-semibold">
                    Check Edge:
                  </span>{" "}
                  O(degree)
                </li>
                <li>
                  •{" "}
                  <span className="text-green-400 font-semibold">
                    Get Neighbors:
                  </span>{" "}
                  O(1)
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">
                Space Complexity
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>
                  •{" "}
                  <span className="text-blue-400 font-semibold">
                    Total Space:
                  </span>{" "}
                  O(V + E)
                </li>
                <li>
                  •{" "}
                  <span className="text-blue-400 font-semibold">
                    Per Vertex:
                  </span>{" "}
                  O(degree)
                </li>
                <li>
                  •{" "}
                  <span className="text-blue-400 font-semibold">
                    Sparse Graphs:
                  </span>{" "}
                  Much better than O(V²)
                </li>
                <li>
                  •{" "}
                  <span className="text-blue-400 font-semibold">Dynamic:</span>{" "}
                  Grows with actual edges
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Comparisons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-emerald-300 mb-4 flex items-center">
              ✅ <span className="ml-2">Advantages</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>
                • <span className="text-emerald-400">Space efficient:</span>{" "}
                Only stores existing edges
              </li>
              <li>
                •{" "}
                <span className="text-emerald-400">
                  Fast neighbor iteration:
                </span>{" "}
                Direct access to adjacency list
              </li>
              <li>
                • <span className="text-emerald-400">Dynamic size:</span> Adapts
                to actual graph density
              </li>
              <li>
                • <span className="text-emerald-400">Memory locality:</span>{" "}
                Better cache performance for sparse graphs
              </li>
              <li>
                •{" "}
                <span className="text-emerald-400">Easy to add vertices:</span>{" "}
                Just add new list
              </li>
            </ul>
          </div>
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-amber-300 mb-4 flex items-center">
              ⚠️ <span className="ml-2">Disadvantages</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>
                • <span className="text-amber-400">Slower edge queries:</span>{" "}
                O(degree) vs O(1) for matrix
              </li>
              <li>
                • <span className="text-amber-400">Complex deletion:</span> Need
                to search through lists
              </li>
              <li>
                • <span className="text-amber-400">No direct indexing:</span>{" "}
                Can't directly access edge weights
              </li>
              <li>
                • <span className="text-amber-400">Memory fragmentation:</span>{" "}
                Dynamic allocation overhead
              </li>
              <li>
                • <span className="text-amber-400">Dense graphs:</span> May use
                more space than matrix
              </li>
            </ul>
          </div>
        </div>

        {/* Use Cases */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-violet-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center mr-3 text-sm">
              🎯
            </span>
            Best Use Cases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 rounded-lg p-4">
              <h4 className="text-md font-semibold text-violet-300 mb-2">
                Sparse Graphs
              </h4>
              <p className="text-sm text-gray-300">
                When edges &lt;&lt; V², adjacency lists save significant space
              </p>
            </div>
            <div className="bg-gradient-to-r from-indigo-500/10 to-blue-500/10 border border-indigo-500/20 rounded-lg p-4">
              <h4 className="text-md font-semibold text-indigo-300 mb-2">
                Graph Traversal
              </h4>
              <p className="text-sm text-gray-300">
                DFS, BFS benefit from fast neighbor iteration
              </p>
            </div>
            <div className="bg-gradient-to-r from-teal-500/10 to-green-500/10 border border-teal-500/20 rounded-lg p-4">
              <h4 className="text-md font-semibold text-teal-300 mb-2">
                Dynamic Graphs
              </h4>
              <p className="text-sm text-gray-300">
                When vertices/edges are frequently added/removed
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-12"></div>
      </div>
    </main>
  );
}
