# Graph Network Minimal Crossings

Built for the [ditrit/leto-modelizer](https://github.com/ditrit/leto-modelizer) project

Aims to find the best way to draw a graph with the least amount of crossings.

Approach:
- Use the best approach for the type of graph (simpler graphs require less complex algorithms)
- Split the graph into smaller unconnected components
- Split the graph into smaller connected components, viusalize them and then combine them

Note: At any given time, checking for the type of graph is computationally expensive. It is better to keep track of the type of graph and update it when needed.

## Type of graph

Type | | Notes
---------|----------| --
 Simple  | :heavy_check_mark:
 Directed | :heavy_check_mark:
 Cyclic | :o:
 Tree | :o:
 Planar | :o:
 Bipartite | :x: |(not sure if it not) (is useful for some algorithms)
 Connected | :o:
 Regular | :o: |(probably not) (I don't assume it is very useful)
 Complete | :x:
 Weighted | :x:
 Eulerian | irrelevant
 Hamiltonian | irrelevant
 Biconnected | :o:

 :heavy_check_mark: : yes | :o: : maybe | :x: : no




## Notes to self:

### 1. Check for special characteristics of the graph or parts of the graph (trees and planar graphs)

Trees are graphs with no cycles. This makes them very easy to be visualized. It is also easy to not have any crossing in a tree.
Planar graphs are graphs that can be drawn on a plane without any crossing. This is a very useful property for graphs that are not trees.

Note: it may be computationally expensive to check if a graph is a tree or planar or to make use of these properties.

TODO: Check algorithms and their complexities

### 2. Use a layout algorithm

Layout algorithms are algorithms that try to find a good way to draw a graph. There are many different algorithms and they all have their own properties. Some of them are:

- Force directed algorithms: In this model, nodes repel each other and edges attract each other. The algorithm is iterative and the nodes move around until they reach a stable position.
- Hierarchical algorithms: these algorithms try to draw the graph in a hierarchical way. This means that they try to draw the graph in a way that the graph looks like a tree.

### 3

One approach that may be effective for minimizing crossovers is to use a hierarchical or layered graph drawing approach, where the nodes are grouped into layers or levels based on their position in a hierarchical structure or a functional relationship. Each layer or level is then arranged in a way that minimizes the number of edge crossings between nodes in adjacent layers, using methods such as Sugiyama's algorithm or Coffman-Graham's algorithm

### 4. Split the graph into smaller graphs

As many graphs are very large, it is often useful to split the graph into smaller graphs. This can be done by splitting the graph into connected components.

#### 4.1. Split graphs

A splits of a graph represent a tree-like structure of the graph. This means that the graph can be split into smaller graphs that are connected to each other. This is useful for large graphs that are not trees. (Needs more research to check implementation with directed graphs)(Unlikely to work)

#### 4.2. Spectral clustering

This method involves using the eigenvectors of the graph Laplacian matrix to partition the graph into clusters. Spectral clustering has a time complexity of O(n^3), where n is the number of nodes in the graph.

#### 4.3. Louvain algorithm

This is a hierarchical clustering method that iteratively optimizes the modularity of the graph by merging or splitting clusters. The Louvain algorithm has a time complexity of O(n log n).

#### 4.4. Label propagation

This is a simple algorithm that starts by assigning each node to its own cluster and then iteratively updates the cluster assignments based on the labels of its neighbors. Label propagation has a time complexity of O(m), where m is the number of edges in the graph, which makes it very fast for large graphs.

#### 4.5. K-means clustering

This is a well-known clustering algorithm that partitions the nodes into k clusters based on their similarity. K-means clustering has a time complexity of O(knm), where k is the number of clusters, n is the number of nodes, and m is the number of iterations required to converge.

#### 4.6. Other clustering algorithms

The following [demo](https://live.yworks.com/demos/analysis/clustering/index.html) is insighful.

### 4. Reducing complexity

These approaches can be computationally expensive for large graphs or graphs with complex connectivity patterns. In such cases, other techniques such as edge bundling, edge routing, and hybrid approaches that combine multiple methods may be more effective for reducing the number of edge crossings while maintaining fast performance

#### 4.1 Bundling

Bundling seems to be a very useful method to make a graph clearer. It is a method that tries to group edges that are close to each other. This is useful for graphs that have many edges. It has a very low cost but completely unnecessary for smaller graphs. It is usually deplayed as a postprocessing step (altough some algorithms can be used to draw the graph with bundling).
