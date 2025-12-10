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
    js: `// Adjacency Matrix for Undirected Graph
class UndirectedGraph {
  constructor(numVertices) {
    this.numVertices = numVertices;
    this.adjMatrix = Array(numVertices).fill(null)
      .map(() => Array(numVertices).fill(0));
  }
  
  // Add an edge between two vertices (symmetric)
  addEdge(vertex1, vertex2) {
    if (vertex1 >= 0 && vertex1 < this.numVertices && 
        vertex2 >= 0 && vertex2 < this.numVertices) {
      this.adjMatrix[vertex1][vertex2] = 1;
      this.adjMatrix[vertex2][vertex1] = 1; // Symmetric for undirected
    }
  }
  
  // Remove an edge between two vertices (symmetric)
  removeEdge(vertex1, vertex2) {
    if (vertex1 >= 0 && vertex1 < this.numVertices && 
        vertex2 >= 0 && vertex2 < this.numVertices) {
      this.adjMatrix[vertex1][vertex2] = 0;
      this.adjMatrix[vertex2][vertex1] = 0; // Symmetric for undirected
    }
  }
  
  // Check if edge exists between two vertices
  hasEdge(vertex1, vertex2) {
    if (vertex1 >= 0 && vertex1 < this.numVertices && 
        vertex2 >= 0 && vertex2 < this.numVertices) {
      return this.adjMatrix[vertex1][vertex2] === 1;
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
  
  // Get degree of a vertex (number of edges)
  getDegree(vertex) {
    return this.getNeighbors(vertex).length;
  }
  
  // Create from edge list
  static fromEdgeList(numVertices, edges) {
    let graph = new UndirectedGraph(numVertices);
    edges.forEach(([vertex1, vertex2]) => {
      graph.addEdge(vertex1, vertex2);
    });
    return graph;
  }
  
  // Display matrix
  printMatrix() {
    console.log("Adjacency Matrix (Undirected):");
    for (let i = 0; i < this.numVertices; i++) {
      console.log(this.adjMatrix[i].join(" "));
    }
  }
}

// Example usage
let graph = new UndirectedGraph(5);
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
} UndirectedGraph;

// Create a new undirected graph
UndirectedGraph* createGraph(int numVertices) {
    UndirectedGraph* graph = malloc(sizeof(UndirectedGraph));
    graph->numVertices = numVertices;
    
    // Allocate memory for adjacency matrix
    graph->matrix = malloc(numVertices * sizeof(int*));
    for (int i = 0; i < numVertices; i++) {
        graph->matrix[i] = calloc(numVertices, sizeof(int));
    }
    
    return graph;
}

// Add edge between two vertices (symmetric)
void addEdge(UndirectedGraph* graph, int vertex1, int vertex2) {
    if (vertex1 >= 0 && vertex1 < graph->numVertices && 
        vertex2 >= 0 && vertex2 < graph->numVertices) {
        graph->matrix[vertex1][vertex2] = 1;
        graph->matrix[vertex2][vertex1] = 1; // Symmetric
    }
}

// Remove edge between two vertices (symmetric)
void removeEdge(UndirectedGraph* graph, int vertex1, int vertex2) {
    if (vertex1 >= 0 && vertex1 < graph->numVertices && 
        vertex2 >= 0 && vertex2 < graph->numVertices) {
        graph->matrix[vertex1][vertex2] = 0;
        graph->matrix[vertex2][vertex1] = 0; // Symmetric
    }
}

// Check if edge exists
int hasEdge(UndirectedGraph* graph, int vertex1, int vertex2) {
    if (vertex1 >= 0 && vertex1 < graph->numVertices && 
        vertex2 >= 0 && vertex2 < graph->numVertices) {
        return graph->matrix[vertex1][vertex2];
    }
    return 0;
}

// Get degree of a vertex
int getDegree(UndirectedGraph* graph, int vertex) {
    int degree = 0;
    for (int i = 0; i < graph->numVertices; i++) {
        if (graph->matrix[vertex][i] == 1) {
            degree++;
        }
    }
    return degree;
}

// Print adjacency matrix
void printMatrix(UndirectedGraph* graph) {
    printf("Adjacency Matrix (Undirected):\\n");
    for (int i = 0; i < graph->numVertices; i++) {
        for (int j = 0; j < graph->numVertices; j++) {
            printf("%d ", graph->matrix[i][j]);
        }
        printf("\\n");
    }
}

// Create graph from edge list
UndirectedGraph* createFromEdges(int numVertices, int edges[][2], int numEdges) {
    UndirectedGraph* graph = createGraph(numVertices);
    for (int i = 0; i < numEdges; i++) {
        addEdge(graph, edges[i][0], edges[i][1]);
    }
    return graph;
}

// Free memory
void freeGraph(UndirectedGraph* graph) {
    for (int i = 0; i < graph->numVertices; i++) {
        free(graph->matrix[i]);
    }
    free(graph->matrix);
    free(graph);
}`,
    py: `class UndirectedGraph:
    def __init__(self, num_vertices):
        self.num_vertices = num_vertices
        self.adj_matrix = [[0 for _ in range(num_vertices)] 
                          for _ in range(num_vertices)]
    
    def add_edge(self, vertex1, vertex2):
        """Add an edge between two vertices (symmetric)"""
        if (0 <= vertex1 < self.num_vertices and 
            0 <= vertex2 < self.num_vertices):
            self.adj_matrix[vertex1][vertex2] = 1
            self.adj_matrix[vertex2][vertex1] = 1  # Symmetric
    
    def remove_edge(self, vertex1, vertex2):
        """Remove an edge between two vertices (symmetric)"""
        if (0 <= vertex1 < self.num_vertices and 
            0 <= vertex2 < self.num_vertices):
            self.adj_matrix[vertex1][vertex2] = 0
            self.adj_matrix[vertex2][vertex1] = 0  # Symmetric
    
    def has_edge(self, vertex1, vertex2):
        """Check if edge exists between two vertices"""
        if (0 <= vertex1 < self.num_vertices and 
            0 <= vertex2 < self.num_vertices):
            return self.adj_matrix[vertex1][vertex2] == 1
        return False
    
    def get_neighbors(self, vertex):
        """Get all neighbors of a vertex"""
        neighbors = []
        for i in range(self.num_vertices):
            if self.adj_matrix[vertex][i] == 1:
                neighbors.append(i)
        return neighbors
    
    def get_degree(self, vertex):
        """Get degree of a vertex (number of edges)"""
        return len(self.get_neighbors(vertex))
    
    @classmethod
    def from_edge_list(cls, num_vertices, edges):
        """Create graph from list of edges"""
        graph = cls(num_vertices)
        for vertex1, vertex2 in edges:
            graph.add_edge(vertex1, vertex2)
        return graph
    
    def print_matrix(self):
        """Print the adjacency matrix"""
        print("Adjacency Matrix (Undirected):")
        for row in self.adj_matrix:
            print(" ".join(map(str, row)))
    
    def is_symmetric(self):
        """Check if matrix is symmetric (should always be true for undirected)"""
        for i in range(self.num_vertices):
            for j in range(self.num_vertices):
                if self.adj_matrix[i][j] != self.adj_matrix[j][i]:
                    return False
        return True

# Example usage
if __name__ == "__main__":
    # Create a graph with 5 vertices
    graph = UndirectedGraph(5)
    
    # Add edges
    edges = [(0, 1), (0, 2), (1, 3), (2, 4), (3, 4)]
    for vertex1, vertex2 in edges:
        graph.add_edge(vertex1, vertex2)
    
    graph.print_matrix()
    print(f"Is symmetric: {graph.is_symmetric()}")`,
    cpp: `#include <vector>
#include <iostream>

class UndirectedGraph {
private:
    std::vector<std::vector<int>> adjMatrix;
    int numVertices;

public:
    UndirectedGraph(int vertices) : numVertices(vertices) {
        adjMatrix.resize(vertices, std::vector<int>(vertices, 0));
    }
    
    // Add edge between two vertices (symmetric)
    void addEdge(int vertex1, int vertex2) {
        if (vertex1 >= 0 && vertex1 < numVertices && 
            vertex2 >= 0 && vertex2 < numVertices) {
            adjMatrix[vertex1][vertex2] = 1;
            adjMatrix[vertex2][vertex1] = 1; // Symmetric
        }
    }
    
    // Remove edge between two vertices (symmetric)
    void removeEdge(int vertex1, int vertex2) {
        if (vertex1 >= 0 && vertex1 < numVertices && 
            vertex2 >= 0 && vertex2 < numVertices) {
            adjMatrix[vertex1][vertex2] = 0;
            adjMatrix[vertex2][vertex1] = 0; // Symmetric
        }
    }
    
    // Check if edge exists
    bool hasEdge(int vertex1, int vertex2) const {
        if (vertex1 >= 0 && vertex1 < numVertices && 
            vertex2 >= 0 && vertex2 < numVertices) {
            return adjMatrix[vertex1][vertex2] == 1;
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
    
    // Get degree of a vertex
    int getDegree(int vertex) const {
        return getNeighbors(vertex).size();
    }
    
    // Create from edge list
    static UndirectedGraph fromEdgeList(int vertices, 
                                       const std::vector<std::pair<int, int>>& edges) {
        UndirectedGraph graph(vertices);
        for (const auto& edge : edges) {
            graph.addEdge(edge.first, edge.second);
        }
        return graph;
    }
    
    // Print adjacency matrix
    void printMatrix() const {
        std::cout << "Adjacency Matrix (Undirected):\\n";
        for (int i = 0; i < numVertices; i++) {
            for (int j = 0; j < numVertices; j++) {
                std::cout << adjMatrix[i][j] << " ";
            }
            std::cout << "\\n";
        }
    }
    
    // Check if matrix is symmetric
    bool isSymmetric() const {
        for (int i = 0; i < numVertices; i++) {
            for (int j = 0; j < numVertices; j++) {
                if (adjMatrix[i][j] != adjMatrix[j][i]) {
                    return false;
                }
            }
        }
        return true;
    }
    
    // Get matrix reference
    const std::vector<std::vector<int>>& getMatrix() const {
        return adjMatrix;
    }
};`,
    idea: `Adjacency Matrix for Undirected Graph:

1. Create n×n matrix where n = number of vertices
2. matrix[i][j] = 1 if edge exists between vertex i and vertex j
3. matrix[i][j] = 0 if no edge exists
4. For undirected graphs: matrix[i][j] = matrix[j][i] (symmetric)

Properties:
- Space complexity: O(n²)
- Edge lookup: O(1)
- Add/Remove edge: O(1) (but updates 2 cells)
- Get all neighbors: O(n)
- Matrix is always symmetric

Use cases:
- Dense graphs (many edges)
- Fast edge queries needed
- When direction doesn't matter
- Social networks, road networks`,
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent mb-2">
              Adjacency Matrix for Undirected Graphs
            </h1>
            <div className="inline-flex items-center space-x-4 text-sm bg-gradient-to-r from-green-400/20 to-teal-400/20 rounded-full px-4 py-2 mt-3 border border-green-400/30">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Space: O(n²)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-teal-400 rounded-full mr-2"></span>
                Edge Query: O(1)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Symmetric Matrix
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-green-300 mb-4 flex items-center">
            <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3 text-sm">
              📊
            </span>
            Understanding Undirected Graph Adjacency Matrices
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p className="text-lg">
              An adjacency matrix for an undirected graph is a square matrix
              used to represent connections between vertices. For a graph with{" "}
              <span className="text-green-400 font-semibold">n vertices</span>,
              the adjacency matrix is an{" "}
              <span className="text-green-400 font-semibold">
                n×n symmetric matrix
              </span>{" "}
              where each cell [i][j] indicates whether there is an edge between
              vertex i and vertex j.
            </p>
            <p className="text-lg">
              In an undirected graph, the matrix is always{" "}
              <span className="text-teal-400 font-semibold">symmetric</span>{" "}
              because if there&apos;s an edge from vertex A to vertex B,
              there&apos;s also an edge from B to A.
            </p>
            <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-lg p-4 my-4">
              <p className="text-center text-lg font-bold text-green-400">
                matrix[i][j] = matrix[j][i] = 1 if edge exists between vertices
                i and j, 0 otherwise
              </p>
            </div>
          </div>
        </div>

        {/* Code Block */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-teal-300 mb-6 flex items-center">
            <span className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center mr-3 text-sm">
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
            <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-300 mb-2">
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
                  O(1) - updates 2 cells
                </li>
                <li>
                  •{" "}
                  <span className="text-green-400 font-semibold">
                    Remove edge:
                  </span>{" "}
                  O(1) - updates 2 cells
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
                  •{" "}
                  <span className="text-blue-400 font-semibold">Symmetry:</span>{" "}
                  Matrix is always symmetric
                </li>
                <li>
                  •{" "}
                  <span className="text-blue-400 font-semibold">Diagonal:</span>{" "}
                  Usually 0 (no self-loops)
                </li>
                <li>
                  •{" "}
                  <span className="text-blue-400 font-semibold">
                    Memory efficiency:
                  </span>{" "}
                  Can store only upper triangle
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
                • <span className="text-emerald-400">Social networks:</span>{" "}
                Friendship connections
              </li>
              <li>
                • <span className="text-emerald-400">Road networks:</span>{" "}
                Bidirectional roads
              </li>
              <li>
                •{" "}
                <span className="text-emerald-400">
                  Communication networks:
                </span>{" "}
                Two-way connections
              </li>
              <li>
                • <span className="text-emerald-400">Dense graphs:</span> When
                most vertices are connected
              </li>
              <li>
                • <span className="text-emerald-400">Matrix operations:</span>{" "}
                Graph algorithms using linear algebra
              </li>
            </ul>
          </div>
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-amber-300 mb-4 flex items-center">
              🔄 <span className="ml-2">Key Differences</span>
            </h3>
            <ul className="text-gray-300 leading-relaxed space-y-2">
              <li>
                • <span className="text-amber-400">Symmetric matrix:</span>{" "}
                matrix[i][j] = matrix[j][i]
              </li>
              <li>
                • <span className="text-amber-400">Degree concept:</span> Number
                of neighbors for each vertex
              </li>
              <li>
                • <span className="text-amber-400">Memory optimization:</span>{" "}
                Can store only upper/lower triangle
              </li>
              <li>
                • <span className="text-amber-400">Edge counting:</span> Each
                edge counted once, not twice
              </li>
              <li>
                • <span className="text-amber-400">No direction:</span>{" "}
                Relationships are bidirectional
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-12"></div>
      </div>
    </main>
  );
}
