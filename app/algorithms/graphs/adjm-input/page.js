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
    js: `// Adjacency Matrix for Directed Graph
class DirectedGraph {
  constructor(numVertices) {
    this.numVertices = numVertices;
    this.adjMatrix = Array(numVertices).fill(null)
      .map(() => Array(numVertices).fill(0));
  }
  
  // Add an edge from source to destination
  addEdge(src, dest) {
    if (src >= 0 && src < this.numVertices && 
        dest >= 0 && dest < this.numVertices) {
      this.adjMatrix[src][dest] = 1;
    }
  }
  
  // Remove an edge from source to destination
  removeEdge(src, dest) {
    if (src >= 0 && src < this.numVertices && 
        dest >= 0 && dest < this.numVertices) {
      this.adjMatrix[src][dest] = 0;
    }
  }
  
  // Check if edge exists
  hasEdge(src, dest) {
    if (src >= 0 && src < this.numVertices && 
        dest >= 0 && dest < this.numVertices) {
      return this.adjMatrix[src][dest] === 1;
    }
    return false;
  }
  
  // Get all neighbors of a vertex
  getNeighbors(vertex) {
    let neighbors = [];
    for (let i = 0; i < this.numVertices; i++) {
      if (this.adjMatrix[vertex][i] === 1) {
        neighbors.push(i);
      }
    }
    return neighbors;
  }
  
  // Create from edge list
  static fromEdgeList(numVertices, edges) {
    let graph = new DirectedGraph(numVertices);
    edges.forEach(([src, dest]) => {
      graph.addEdge(src, dest);
    });
    return graph;
  }
  
  // Display matrix
  printMatrix() {
    console.log("Adjacency Matrix:");
    for (let i = 0; i < this.numVertices; i++) {
      console.log(this.adjMatrix[i].join(" "));
    }
  }
}

// Example usage
let graph = new DirectedGraph(5);
graph.addEdge(0, 1);
graph.addEdge(0, 2);
graph.addEdge(1, 3);
graph.addEdge(2, 4);
graph.addEdge(3, 4);
graph.printMatrix();`,
    c: `#include <stdio.h>
#include <stdlib.h>

typedef struct {
    int** matrix;
    int numVertices;
} DirectedGraph;

// Create a new directed graph
DirectedGraph* createGraph(int numVertices) {
    DirectedGraph* graph = malloc(sizeof(DirectedGraph));
    graph->numVertices = numVertices;
    
    // Allocate memory for adjacency matrix
    graph->matrix = malloc(numVertices * sizeof(int*));
    for (int i = 0; i < numVertices; i++) {
        graph->matrix[i] = calloc(numVertices, sizeof(int));
    }
    
    return graph;
}

// Add edge from src to dest
void addEdge(DirectedGraph* graph, int src, int dest) {
    if (src >= 0 && src < graph->numVertices && 
        dest >= 0 && dest < graph->numVertices) {
        graph->matrix[src][dest] = 1;
    }
}

// Remove edge from src to dest
void removeEdge(DirectedGraph* graph, int src, int dest) {
    if (src >= 0 && src < graph->numVertices && 
        dest >= 0 && dest < graph->numVertices) {
        graph->matrix[src][dest] = 0;
    }
}

// Check if edge exists
int hasEdge(DirectedGraph* graph, int src, int dest) {
    if (src >= 0 && src < graph->numVertices && 
        dest >= 0 && dest < graph->numVertices) {
        return graph->matrix[src][dest];
    }
    return 0;
}

// Print adjacency matrix
void printMatrix(DirectedGraph* graph) {
    printf("Adjacency Matrix:\\n");
    for (int i = 0; i < graph->numVertices; i++) {
        for (int j = 0; j < graph->numVertices; j++) {
            printf("%d ", graph->matrix[i][j]);
        }
        printf("\\n");
    }
}

// Create graph from edge list
DirectedGraph* createFromEdges(int numVertices, int edges[][2], int numEdges) {
    DirectedGraph* graph = createGraph(numVertices);
    for (int i = 0; i < numEdges; i++) {
        addEdge(graph, edges[i][0], edges[i][1]);
    }
    return graph;
}

// Free memory
void freeGraph(DirectedGraph* graph) {
    for (int i = 0; i < graph->numVertices; i++) {
        free(graph->matrix[i]);
    }
    free(graph->matrix);
    free(graph);
}`,
    py: `class DirectedGraph:
    def __init__(self, num_vertices):
        self.num_vertices = num_vertices
        self.adj_matrix = [[0 for _ in range(num_vertices)] 
                          for _ in range(num_vertices)]
    
    def add_edge(self, src, dest):
        """Add an edge from source to destination"""
        if (0 <= src < self.num_vertices and 
            0 <= dest < self.num_vertices):
            self.adj_matrix[src][dest] = 1
    
    def remove_edge(self, src, dest):
        """Remove an edge from source to destination"""
        if (0 <= src < self.num_vertices and 
            0 <= dest < self.num_vertices):
            self.adj_matrix[src][dest] = 0
    
    def has_edge(self, src, dest):
        """Check if edge exists"""
        if (0 <= src < self.num_vertices and 
            0 <= dest < self.num_vertices):
            return self.adj_matrix[src][dest] == 1
        return False
    
    def get_neighbors(self, vertex):
        """Get all neighbors of a vertex"""
        neighbors = []
        for i in range(self.num_vertices):
            if self.adj_matrix[vertex][i] == 1:
                neighbors.append(i)
        return neighbors
    
    @classmethod
    def from_edge_list(cls, num_vertices, edges):
        """Create graph from list of edges"""
        graph = cls(num_vertices)
        for src, dest in edges:
            graph.add_edge(src, dest)
        return graph
    
    def print_matrix(self):
        """Print the adjacency matrix"""
        print("Adjacency Matrix:")
        for row in self.adj_matrix:
            print(" ".join(map(str, row)))
    
    def get_in_degree(self, vertex):
        """Get in-degree of a vertex"""
        return sum(self.adj_matrix[i][vertex] 
                  for i in range(self.num_vertices))
    
    def get_out_degree(self, vertex):
        """Get out-degree of a vertex"""
        return sum(self.adj_matrix[vertex])

# Example usage
if __name__ == "__main__":
    # Create a graph with 5 vertices
    graph = DirectedGraph(5)
    
    # Add edges
    edges = [(0, 1), (0, 2), (1, 3), (2, 4), (3, 4)]
    for src, dest in edges:
        graph.add_edge(src, dest)
    
    graph.print_matrix()`,
    cpp: `#include <vector>
#include <iostream>

class DirectedGraph {
private:
    std::vector<std::vector<int>> adjMatrix;
    int numVertices;

public:
    DirectedGraph(int vertices) : numVertices(vertices) {
        adjMatrix.resize(vertices, std::vector<int>(vertices, 0));
    }
    
    // Add edge from src to dest
    void addEdge(int src, int dest) {
        if (src >= 0 && src < numVertices && 
            dest >= 0 && dest < numVertices) {
            adjMatrix[src][dest] = 1;
        }
    }
    
    // Remove edge from src to dest
    void removeEdge(int src, int dest) {
        if (src >= 0 && src < numVertices && 
            dest >= 0 && dest < numVertices) {
            adjMatrix[src][dest] = 0;
        }
    }
    
    // Check if edge exists
    bool hasEdge(int src, int dest) const {
        if (src >= 0 && src < numVertices && 
            dest >= 0 && dest < numVertices) {
            return adjMatrix[src][dest] == 1;
        }
        return false;
    }
    
    // Get neighbors of a vertex
    std::vector<int> getNeighbors(int vertex) const {
        std::vector<int> neighbors;
        for (int i = 0; i < numVertices; i++) {
            if (adjMatrix[vertex][i] == 1) {
                neighbors.push_back(i);
            }
        }
        return neighbors;
    }
    
    // Create from edge list
    static DirectedGraph fromEdgeList(int vertices, 
                                     const std::vector<std::pair<int, int>>& edges) {
        DirectedGraph graph(vertices);
        for (const auto& edge : edges) {
            graph.addEdge(edge.first, edge.second);
        }
        return graph;
    }
    
    // Print adjacency matrix
    void printMatrix() const {
        std::cout << "Adjacency Matrix:\\n";
        for (int i = 0; i < numVertices; i++) {
            for (int j = 0; j < numVertices; j++) {
                std::cout << adjMatrix[i][j] << " ";
            }
            std::cout << "\\n";
        }
    }
    
    // Get matrix reference
    const std::vector<std::vector<int>>& getMatrix() const {
        return adjMatrix;
    }
};`,
    idea: `Adjacency Matrix for Directed Graph:

1. Create n×n matrix where n = number of vertices
2. matrix[i][j] = 1 if edge exists from vertex i to vertex j
3. matrix[i][j] = 0 if no edge exists
4. For directed graphs: matrix[i][j] ≠ matrix[j][i] (not symmetric)

Properties:
- Space complexity: O(n²)
- Edge lookup: O(1)
- Add/Remove edge: O(1)
- Get all neighbors: O(n)

Use cases:
- Dense graphs (many edges)
- Fast edge queries needed
- Matrix operations on graphs`,
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
        <AdBanner position="bottom" size="responsive" adTest="off" />
        {/* Algorithm Info */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Adjacency Matrix for Directed Graphs
            </h1>
            <div className="inline-flex items-center space-x-4 text-sm bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full px-4 py-2 mt-3 border border-purple-400/30">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                Space: O(n²)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pink-400 rounded-full mr-2"></span>
                Edge Query: O(1)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Matrix-based
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-purple-300 mb-4 flex items-center">
            <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3 text-sm">
              📊
            </span>
            Understanding Adjacency Matrices
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p className="text-lg">
              An adjacency matrix is a square matrix used to represent a
              directed graph. For a graph with{" "}
              <span className="text-purple-400 font-semibold">n vertices</span>,
              the adjacency matrix is an{" "}
              <span className="text-purple-400 font-semibold">n×n matrix</span>
              where each cell [i][j] indicates whether there is an edge from
              vertex i to vertex j.
            </p>
            <p className="text-lg">
              In a directed graph, the matrix is typically{" "}
              <span className="text-pink-400 font-semibold">not symmetric</span>
              because an edge from vertex A to vertex B doesn&apos;t necessarily
              mean there&apos;s an edge from B to A.
            </p>
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4 my-4">
              <p className="text-center text-lg font-bold text-purple-400">
                matrix[i][j] = 1 if edge exists from vertex i to vertex j, 0
                otherwise
              </p>
            </div>
          </div>
        </div>

        {/* Code Block */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-pink-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center mr-3 text-sm">
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

        {/* Properties Analysis */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-blue-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3 text-sm">
              🔍
            </span>
            Properties & Complexity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-300 mb-2">
                Time Complexity
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>
                  •{" "}
                  <span className="text-green-400 font-semibold">
                    Edge lookup:
                  </span>{" "}
                  O(1)
                </li>
                <li>
                  •{" "}
                  <span className="text-green-400 font-semibold">
                    Add edge:
                  </span>{" "}
                  O(1)
                </li>
                <li>
                  •{" "}
                  <span className="text-green-400 font-semibold">
                    Remove edge:
                  </span>{" "}
                  O(1)
                </li>
                <li>
                  •{" "}
                  <span className="text-yellow-400 font-semibold">
                    Get neighbors:
                  </span>{" "}
                  O(n)
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">
                Space & Properties
              </h3>
              <ul className="text-gray-300 space-y-2">
                <li>
                  • <span className="text-blue-400 font-semibold">Space:</span>{" "}
                  O(n²) always
                </li>
                <li>
                  • <span className="text-blue-400 font-semibold">Memory:</span>{" "}
                  Fixed regardless of edge count
                </li>
                <li>
                  •{" "}
                  <span className="text-blue-400 font-semibold">
                    Representation:
                  </span>{" "}
                  Dense storage
                </li>
                <li>
                  •{" "}
                  <span className="text-blue-400 font-semibold">
                    Matrix ops:
                  </span>{" "}
                  Easy to perform
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Use Cases & Comparisons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-emerald-300 mb-4 flex items-center">
              ✅ <span className="ml-2">Best Use Cases</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>
                • <span className="text-emerald-400">Dense graphs:</span> Many
                edges relative to vertices
              </li>
              <li>
                • <span className="text-emerald-400">Fast edge queries:</span>{" "}
                Frequent &quot;is there an edge?&quot; checks
              </li>
              <li>
                • <span className="text-emerald-400">Matrix operations:</span>{" "}
                Graph algorithms using linear algebra
              </li>
              <li>
                • <span className="text-emerald-400">Small graphs:</span> When
                n² space is acceptable
              </li>
              <li>
                • <span className="text-emerald-400">Complete graphs:</span>{" "}
                Nearly all possible edges exist
              </li>
            </ul>
          </div>
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-amber-300 mb-4 flex items-center">
              ⚠️ <span className="ml-2">Limitations</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>
                • <span className="text-amber-400">Space inefficient:</span>{" "}
                Wastes memory for sparse graphs
              </li>
              <li>
                • <span className="text-amber-400">Fixed size:</span> Difficult
                to add/remove vertices
              </li>
              <li>
                • <span className="text-amber-400">Large graphs:</span> O(n²)
                space becomes prohibitive
              </li>
              <li>
                • <span className="text-amber-400">Iteration:</span> O(n) to
                find all neighbors
              </li>
              <li>
                • <span className="text-amber-400">Cache performance:</span>{" "}
                Poor for very large matrices
              </li>
            </ul>
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
