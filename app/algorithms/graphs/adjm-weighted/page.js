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
    js: `// Weighted Adjacency Matrix for Directed Graph
class WeightedDirectedGraph {
  constructor(numVertices) {
    this.numVertices = numVertices;
    this.adjMatrix = Array(numVertices).fill(null)
      .map(() => Array(numVertices).fill(0));
  }
  
  // Add a weighted edge from source to destination
  addEdge(src, dest, weight) {
    if (src >= 0 && src < this.numVertices && 
        dest >= 0 && dest < this.numVertices && weight > 0) {
      this.adjMatrix[src][dest] = weight;
    }
  }
  
  // Remove an edge from source to destination
  removeEdge(src, dest) {
    if (src >= 0 && src < this.numVertices && 
        dest >= 0 && dest < this.numVertices) {
      this.adjMatrix[src][dest] = 0;
    }
  }
  
  // Get weight of edge between vertices
  getEdgeWeight(src, dest) {
    if (src >= 0 && src < this.numVertices && 
        dest >= 0 && dest < this.numVertices) {
      return this.adjMatrix[src][dest];
    }
    return 0;
  }
  
  // Check if edge exists
  hasEdge(src, dest) {
    return this.getEdgeWeight(src, dest) > 0;
  }
  
  // Get all neighbors with their weights
  getNeighborsWithWeights(vertex) {
    let neighbors = [];
    for (let i = 0; i < this.numVertices; i++) {
      if (this.adjMatrix[vertex][i] > 0) {
        neighbors.push({vertex: i, weight: this.adjMatrix[vertex][i]});
      }
    }
    return neighbors;
  }
  
  // Get total weight of all outgoing edges from a vertex
  getVertexOutWeight(vertex) {
    let totalWeight = 0;
    for (let i = 0; i < this.numVertices; i++) {
      totalWeight += this.adjMatrix[vertex][i];
    }
    return totalWeight;
  }
  
  // Create from weighted edge list
  static fromWeightedEdgeList(numVertices, edges) {
    let graph = new WeightedDirectedGraph(numVertices);
    edges.forEach(([src, dest, weight]) => {
      graph.addEdge(src, dest, weight);
    });
    return graph;
  }
  
  // Display weighted matrix
  printMatrix() {
    console.log("Weighted Adjacency Matrix:");
    for (let i = 0; i < this.numVertices; i++) {
      console.log(this.adjMatrix[i].join("\\t"));
    }
  }
}

// Example usage
let graph = new WeightedDirectedGraph(5);
graph.addEdge(0, 1, 10);
graph.addEdge(0, 2, 5);
graph.addEdge(1, 3, 15);
graph.addEdge(2, 4, 20);
graph.addEdge(3, 4, 8);
graph.printMatrix();`,
    c: `#include <stdio.h>
#include <stdlib.h>
#include <limits.h>

typedef struct {
    int** matrix;
    int numVertices;
} WeightedGraph;

// Create a new weighted graph
WeightedGraph* createGraph(int numVertices) {
    WeightedGraph* graph = malloc(sizeof(WeightedGraph));
    graph->numVertices = numVertices;
    
    // Allocate memory for weighted adjacency matrix
    graph->matrix = malloc(numVertices * sizeof(int*));
    for (int i = 0; i < numVertices; i++) {
        graph->matrix[i] = calloc(numVertices, sizeof(int));
    }
    
    return graph;
}

// Add weighted edge from src to dest
void addEdge(WeightedGraph* graph, int src, int dest, int weight) {
    if (src >= 0 && src < graph->numVertices && 
        dest >= 0 && dest < graph->numVertices && weight > 0) {
        graph->matrix[src][dest] = weight;
    }
}

// Remove edge from src to dest
void removeEdge(WeightedGraph* graph, int src, int dest) {
    if (src >= 0 && src < graph->numVertices && 
        dest >= 0 && dest < graph->numVertices) {
        graph->matrix[src][dest] = 0;
    }
}

// Get edge weight
int getEdgeWeight(WeightedGraph* graph, int src, int dest) {
    if (src >= 0 && src < graph->numVertices && 
        dest >= 0 && dest < graph->numVertices) {
        return graph->matrix[src][dest];
    }
    return 0;
}

// Check if edge exists
int hasEdge(WeightedGraph* graph, int src, int dest) {
    return getEdgeWeight(graph, src, dest) > 0;
}

// Print weighted adjacency matrix
void printMatrix(WeightedGraph* graph) {
    printf("Weighted Adjacency Matrix:\\n");
    for (int i = 0; i < graph->numVertices; i++) {
        for (int j = 0; j < graph->numVertices; j++) {
            printf("%3d ", graph->matrix[i][j]);
        }
        printf("\\n");
    }
}

// Free memory
void freeGraph(WeightedGraph* graph) {
    for (int i = 0; i < graph->numVertices; i++) {
        free(graph->matrix[i]);
    }
    free(graph->matrix);
    free(graph);
}`,
    py: `class WeightedDirectedGraph:
    def __init__(self, num_vertices):
        self.num_vertices = num_vertices
        self.adj_matrix = [[0 for _ in range(num_vertices)] 
                          for _ in range(num_vertices)]
    
    def add_edge(self, src, dest, weight):
        """Add a weighted edge from source to destination"""
        if (0 <= src < self.num_vertices and 
            0 <= dest < self.num_vertices and weight > 0):
            self.adj_matrix[src][dest] = weight
    
    def remove_edge(self, src, dest):
        """Remove an edge from source to destination"""
        if (0 <= src < self.num_vertices and 
            0 <= dest < self.num_vertices):
            self.adj_matrix[src][dest] = 0
    
    def get_edge_weight(self, src, dest):
        """Get weight of edge between vertices"""
        if (0 <= src < self.num_vertices and 
            0 <= dest < self.num_vertices):
            return self.adj_matrix[src][dest]
        return 0
    
    def has_edge(self, src, dest):
        """Check if edge exists"""
        return self.get_edge_weight(src, dest) > 0
    
    def get_neighbors_with_weights(self, vertex):
        """Get all neighbors of a vertex with their weights"""
        neighbors = []
        for i in range(self.num_vertices):
            if self.adj_matrix[vertex][i] > 0:
                neighbors.append((i, self.adj_matrix[vertex][i]))
        return neighbors
    
    def get_vertex_out_weight(self, vertex):
        """Get total weight of all outgoing edges from vertex"""
        return sum(self.adj_matrix[vertex])
    
    @classmethod
    def from_weighted_edge_list(cls, num_vertices, edges):
        """Create graph from list of weighted edges"""
        graph = cls(num_vertices)
        for src, dest, weight in edges:
            graph.add_edge(src, dest, weight)
        return graph
    
    def print_matrix(self):
        """Print the weighted adjacency matrix"""
        print("Weighted Adjacency Matrix:")
        for row in self.adj_matrix:
            print("\\t".join(map(str, row)))

# Example usage
if __name__ == "__main__":
    # Create a weighted graph with 5 vertices
    graph = WeightedDirectedGraph(5)
    
    # Add weighted edges
    edges = [(0, 1, 10), (0, 2, 5), (1, 3, 15), (2, 4, 20), (3, 4, 8)]
    for src, dest, weight in edges:
        graph.add_edge(src, dest, weight)
    
    graph.print_matrix()`,
    cpp: `#include <vector>
#include <iostream>
#include <limits>

class WeightedDirectedGraph {
private:
    std::vector<std::vector<int>> adjMatrix;
    int numVertices;

public:
    WeightedDirectedGraph(int vertices) : numVertices(vertices) {
        adjMatrix.resize(vertices, std::vector<int>(vertices, 0));
    }
    
    // Add weighted edge from src to dest
    void addEdge(int src, int dest, int weight) {
        if (src >= 0 && src < numVertices && 
            dest >= 0 && dest < numVertices && weight > 0) {
            adjMatrix[src][dest] = weight;
        }
    }
    
    // Remove edge from src to dest
    void removeEdge(int src, int dest) {
        if (src >= 0 && src < numVertices && 
            dest >= 0 && dest < numVertices) {
            adjMatrix[src][dest] = 0;
        }
    }
    
    // Get edge weight
    int getEdgeWeight(int src, int dest) const {
        if (src >= 0 && src < numVertices && 
            dest >= 0 && dest < numVertices) {
            return adjMatrix[src][dest];
        }
        return 0;
    }
    
    // Check if edge exists
    bool hasEdge(int src, int dest) const {
        return getEdgeWeight(src, dest) > 0;
    }
    
    // Get neighbors with weights
    std::vector<std::pair<int, int>> getNeighborsWithWeights(int vertex) const {
        std::vector<std::pair<int, int>> neighbors;
        for (int i = 0; i < numVertices; i++) {
            if (adjMatrix[vertex][i] > 0) {
                neighbors.push_back({i, adjMatrix[vertex][i]});
            }
        }
        return neighbors;
    }
    
    // Get total outgoing weight from vertex
    int getVertexOutWeight(int vertex) const {
        int totalWeight = 0;
        for (int i = 0; i < numVertices; i++) {
            totalWeight += adjMatrix[vertex][i];
        }
        return totalWeight;
    }
    
    // Create from weighted edge list
    static WeightedDirectedGraph fromWeightedEdgeList(int vertices, 
                                                     const std::vector<std::tuple<int, int, int>>& edges) {
        WeightedDirectedGraph graph(vertices);
        for (const auto& edge : edges) {
            graph.addEdge(std::get<0>(edge), std::get<1>(edge), std::get<2>(edge));
        }
        return graph;
    }
    
    // Print weighted adjacency matrix
    void printMatrix() const {
        std::cout << "Weighted Adjacency Matrix:\\n";
        for (int i = 0; i < numVertices; i++) {
            for (int j = 0; j < numVertices; j++) {
                std::cout << adjMatrix[i][j] << "\\t";
            }
            std::cout << "\\n";
        }
    }
    
    // Get matrix reference
    const std::vector<std::vector<int>>& getMatrix() const {
        return adjMatrix;
    }
};`,
    idea: `Weighted Adjacency Matrix for Directed Graphs:

1. Create n×n matrix where n = number of vertices
2. matrix[i][j] = weight if edge exists from vertex i to vertex j
3. matrix[i][j] = 0 if no edge exists (or use infinity for shortest path algorithms)
4. For directed graphs: matrix[i][j] ≠ matrix[j][i] (not symmetric)

Properties:
- Space complexity: O(n²) regardless of edge weights
- Edge weight lookup: O(1)
- Add/Remove weighted edge: O(1)
- Get all neighbors with weights: O(n)

Use cases:
- Weighted graphs (roads with distances, network costs)
- Shortest path algorithms (Dijkstra, Floyd-Warshall)
- Flow networks with capacities
- Cost optimization problems`,
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
              Weighted Adjacency Matrix for Directed Graphs
            </h1>
            <div className="inline-flex items-center space-x-4 text-sm bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full px-4 py-2 mt-3 border border-purple-400/30">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                Space: O(n²)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-pink-400 rounded-full mr-2"></span>
                Weight Query: O(1)
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Weighted Matrix
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-purple-300 mb-4 flex items-center">
            <span className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3 text-sm">
              ⚖️
            </span>
            Understanding Weighted Adjacency Matrices
          </h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p className="text-lg">
              A weighted adjacency matrix is a square matrix used to represent a
              weighted directed graph. For a graph with{" "}
              <span className="text-purple-400 font-semibold">n vertices</span>,
              the adjacency matrix is an{" "}
              <span className="text-purple-400 font-semibold">n×n matrix</span>
              where each cell [i][j] contains the weight of the edge from vertex
              i to vertex j, or 0 if no edge exists.
            </p>
            <p className="text-lg">
              Unlike unweighted graphs that store only 0s and 1s, weighted
              matrices store
              <span className="text-pink-400 font-semibold">
                {" "}
                actual edge weights
              </span>
              , making them ideal for representing distances, costs, capacities,
              or any numerical relationship between vertices.
            </p>
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4 my-4">
              <p className="text-center text-lg font-bold text-purple-400">
                matrix[i][j] = weight if edge exists from vertex i to vertex j,
                0 otherwise
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
                    Weight lookup:
                  </span>{" "}
                  O(1)
                </li>
                <li>
                  •{" "}
                  <span className="text-green-400 font-semibold">
                    Add weighted edge:
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
                    Get neighbors with weights:
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
                • <span className="text-emerald-400">Weighted graphs:</span>{" "}
                Roads with distances, network costs, capacities
              </li>
              <li>
                • <span className="text-emerald-400">Fast weight queries:</span>{" "}
                Frequent &quot;what&apos;s the weight?&quot; checks
              </li>
              <li>
                •{" "}
                <span className="text-emerald-400">
                  Shortest path algorithms:
                </span>{" "}
                Dijkstra&apos;s, Floyd-Warshall implementations
              </li>
              <li>
                •{" "}
                <span className="text-emerald-400">Dense weighted graphs:</span>{" "}
                When most vertex pairs have weighted edges
              </li>
              <li>
                • <span className="text-emerald-400">Flow networks:</span> Max
                flow, min cost flow problems
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
