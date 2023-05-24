export function treeAdjacencyListToNestedList(adjList, root = null) {
    if (!root) {
        root = Object.keys(adjList)[0];
    }
    const visited = new Set();
    const reverseEdges = {};

    // Build reverse edges
    Object.entries(adjList).forEach(([node, neighbors]) => {
        neighbors.forEach(neighbor => {
            if (!reverseEdges[neighbor]) {
                reverseEdges[neighbor] = [];
            }
            reverseEdges[neighbor].push(node);
        });
    });

    function dfs(node) {
        visited.add(node);
        const nestedObj = { id: node.toString(), children: [] };
        // get children from forward and reverse edges (no duplicates, a node might not be listed in reverse edges). Do not visit visited nodes
        const children = [...new Set([...adjList[node], ...(reverseEdges[node] || [])])];
        children.forEach(child => {
            if (!visited.has(child)) {
                const childObj = dfs(child);
                nestedObj.children.push(childObj);
            }
        });
        return nestedObj;
    }

    return dfs(root);
}


export function addNodeToAdjacencyList(adjList, node, neighbors = []) {
    // if node already exists, add neighbors to existing list (no duplicates)
    // if node does not exist, add node to list with neighbors
    for (const neighbor of neighbors) {
        if (!adjList[neighbor]) {
            addNodeToAdjacencyList(adjList, neighbor, []);
        }
    }
    if (adjList[node]) {
        adjList[node] = [...new Set([...adjList[node], ...neighbors])];
    } else {
        adjList[node] = neighbors;
    }
}


export function addEdgeToAdjacencyList(adjList, parentNode, childNode, bidirectional = false) {
    if (bidirectional) {
        addEdgeToAdjacencyList_bidirectional(adjList, childNode, parentNode);
    }
    addNodeToAdjacencyList(adjList, parentNode, [childNode]);
}


export function removeNodeFromAdjacencyList(adjList, node) {
    // remove node from adjacency list
    for (const n in adjList) {
        adjList[n] = adjList[n].filter(neighbor => neighbor !== node);
    }
    delete adjList[node];
}


export function removeEdgeFromAdjacencyList(adjList, parentNode, childNode, bidirectional = false) {
    if (bidirectional) {
        removeEdgeFromAdjacencyList(adjList, childNode, parentNode);
    }
    adjList[parentNode] = adjList[parentNode].filter(n => n !== childNode);
}


export function getIndegrees(adjacencyList) {
    // get the in-degree of each node in the adjacency list
    const inDegree = {};
    for (const node in adjacencyList) {
        inDegree[node] = 0;
        for (const neighbor of adjacencyList[node]) {
            inDegree[neighbor] = (inDegree[neighbor] || 0) + 1;
        }
    }
    return inDegree;
}


export function getPossibleRoots_leastIndegree(adjacencyList) {
    // create an object with the in-degree as the key and the nodes with that in-degree as the value
    const inDegree = getIndegrees(adjacencyList);
    const indegreeNodes = {};
    for (const node in inDegree) {
        if (!indegreeNodes[inDegree[node]]) {
            indegreeNodes[inDegree[node]] = [];
        }
        indegreeNodes[inDegree[node]].push(node);
    }
    return indegreeNodes;
} // example: input: {0: ["1", "2"], 1: ["2"], 2: ["3"], 3: []} output: {0: ["0"], 1: ["1", ], 2: ["2"]}


export function getNodesWithZeroIndegree(adjacencyList) {
    // get list of nodes with zero in-degree
    const inDegree = getIndegrees(adjacencyList);
    const roots = Object.keys(inDegree).filter(node => inDegree[node] === 0);
    return roots;
}


export function getNumberofReachableNodes(adjacencyList, node) {
    // get the nodes reachable from the node
    const visited = new Set();

    function dfs(node) {
        visited.add(node);
        for (const neighbor of adjacencyList[node]) {
            if (!visited.has(neighbor)) {
                dfs(neighbor);
            }
        }
    }

    dfs(node);
    return visited.size;
}


export function getPossibleRoots_mostReachableNodes(adjacencyList) {
    // create an object with the number of reachable nodes as the key and the nodes with that number of reachable nodes as the value
    const reachableNodes = {};
    for (const node in adjacencyList) {
        const reachable = getNumberofReachableNodes(adjacencyList, node);
        if (!reachableNodes[reachable]) {
            reachableNodes[reachable] = [];
        }
        reachableNodes[reachable].push(node);
    }
    return reachableNodes;
}


export function getBestRoot(adjacencyList) {
    // returns the best root for visualizing the tree
    // the best root is the node with the most reachable nodes and the least in-degree
    const reachableNodes = getPossibleRoots_mostReachableNodes(adjacencyList);
    const indegreeNodes = getPossibleRoots_leastIndegree(adjacencyList);

    // get the intersection of the reachable nodes and the nodes with the least in-degree
    const bestRoots = {};
    for (const reachable in reachableNodes) {
        if (indegreeNodes[reachable]) {
            bestRoots[reachable] = [...new Set([...reachableNodes[reachable], ...indegreeNodes[reachable]])];
        }
    }

    // get the best root
    const bestRoot = bestRoots[Math.max(...Object.keys(bestRoots))];
    return bestRoot;
}


export function isDirectedTree(adjList) {
    // check if the adjacency list is a directed tree by finding the root
    // if there is no root, return false
    // the graph is assumed to be connected

    // get possible roots
    const roots = getNodesWithZeroIndegree(adjList);

    // if there is no root, return false
    if (roots.length === 0) {
        return false;
    }

    // for all the roots, check if the graph is a tree
    for (const root of roots) {
        const visited = new Set();

        function dfs(node) {
            visited.add(node);
            for (const child of adjList[node]) {
                if (!visited.has(child)) {
                    dfs(child);
                }
            }
        }

        dfs(root);
        // if all the nodes are visited, return true
        if (visited.size === Object.keys(adjList).length) {
            return root;
        }
    }
    return false;
}


export function isUndirectedTree(adjList) {
    return isUndirectedAcyclicGraph(adjList);
}


export function isDirectedAcyclicGraph(adjacencyList) {
    const visited = new Set();
    // define searchVisited as a set without instantiating it as new set
    let searchVisited;

    for (let node in adjacencyList) {
        if (!visited.has(node)) {
            searchVisited = new Set(); // Separate set for each search
            if (hasCycle(node, null)) {
                return false;
            }
        }
    }
    return true;

    function hasCycle(node, parent) {
        visited.add(node);
        searchVisited.add(node); // Add node to the set for the current search

        for (let neighbor of adjacencyList[node]) {
            if (!visited.has(neighbor)) {
                if (hasCycle(neighbor, node)) {
                    return true;
                }
            } else if (searchVisited.has(neighbor) && neighbor !== parent) {
                return true;
            }
        }

        return false;
    }
}


export function isUndirectedAcyclicGraph(adjacencyList) {
    // i.e. is an undirected tree
    const bidirectionalAdjacencyList = makeAdjacencyListBidirectional(adjacencyList);

    // get any node to be the root
    const root = Object.keys(bidirectionalAdjacencyList)[0];
    const visited = new Set();

    function dfs(node, parent) {
        visited.add(node);

        for (let neighbor of bidirectionalAdjacencyList[node]) {
            if (!visited.has(neighbor)) {
                if (dfs(neighbor, node)) {
                    return true;
                }
            } else if (neighbor !== parent) {
                return true;
            }
        }
        return false;
    }

    return !dfs(root, null);
}


export function getConnectedComponents(adjList, bidirectional = false) {
    if (bidirectional) {
        return getConnectedComponents_undirected(adjList);
    } else {
        return getConnectedComponents_directed(adjList);
    }
}


export function addNodetoAdjacencyListComponents(components, node, neighbors = []) {
    // each of the components is of the form {node: [neighbors]}
    // if node has no neighbors, add it to a new component
    if (neighbors.length === 0) {
        components.push({ [node]: [] });
        return;
    }

    // merging components if no longer disconnected

    // get a list (no duplicates) of the components that contain the neighbors
    const neighborComponents = [];
    for (const neighbor of neighbors) {
        for (const component of components) {
            if (component[neighbor]) {
                if (!neighborComponents.includes(component)) {
                    neighborComponents.push(component);
                    components.splice(components.indexOf(component), 1);
                }
                break;
            }
        }
    }

    const mergedComponents = mergeAdjacencyListsOfUnconnectedGraphs(...neighborComponents);

    // add the node to the merged components
    addNodeToAdjacencyList(mergedComponents, node, neighbors);

    // add the merged components to the components list
    components.push(mergedComponents);
}


export function removeNodeFromAdjacencyListComponents(components, node) {
    // remove node from adjacency list
    for (const component of components) {
        if (component[node]) {
            removeNodeFromAdjacencyList(component, node);

            // if the component is empty, remove it from the components list
            if (Object.keys(component).length === 0) {
                components.splice(components.indexOf(component), 1);
                break;
            }


            const separateComponents = getConnectedComponents(component);
            if (separateComponents.length > 1) {
                // remove the component from the components list
                components.splice(components.indexOf(component), 1);
                // add the separated components to the components list
                components.push(...separateComponents);
            }
            break;
        }
    }
}


export function addEdgeToAdjacencyListComponents(components, parentNode, childNode) {
    // get the component that contain the parent and child nodes
    let parentComponent;
    let childComponent;
    for (const component of components) {
        if (component[parentNode]) {
            parentComponent = component;
        }
        if (component[childNode]) {
            childComponent = component;
        }
        // if both components are found, break
        if (parentComponent && childComponent) {
            break;
        }
    }

    // if the parent and child nodes are in the same component, add the edge to the component
    if (parentComponent === childComponent) {
        addEdgeToAdjacencyList(parentComponent, parentNode, childNode);
        return;
    }

    // if the parent and child nodes are in different components, merge the components
    components.splice(components.indexOf(parentComponent), 1);
    components.splice(components.indexOf(childComponent), 1);
    const mergedComponents = mergeAdjacencyListsOfUnconnectedGraphs(parentComponent, childComponent);

    // add the edge to the merged components
    addEdgeToAdjacencyList(mergedComponents, parentNode, childNode);

    // add the merged components to the components list
    components.push(mergedComponents);
}


export function removeEdgeFromAdjacencyListComponents(components, parentNode, childNode) {
    // get the component that contain the parent and child nodes
    let parentComponent;
    for (const component of components) {
        if (component[parentNode] && component[childNode]) {
            parentComponent = component;
            break;
        }
    }

    // remove the edge from the component
    removeEdgeFromAdjacencyList(parentComponent, parentNode, childNode);

    // if the component is now disconnected, separate it into separate components
    const separateComponents = getConnectedComponents(parentComponent);
    if (separateComponents.length > 1) {
        // remove the component from the components list
        components.splice(components.indexOf(parentComponent), 1);
        // add the separated components to the components list
        components.push(...separateComponents);
    }
}


export function getConnectedComponents_directed(adjList) {
    const visited = new Set();
    const components = [];

    for (let node in adjList) {
        if (!visited.has(node)) {
            const component = {};
            dfs(node, component);
            components.push(component);
        }
    }

    function dfs(node, component) {
        visited.add(node);
        component[node] = adjList[node];

        for (let neighbor of adjList[node]) {
            if (!visited.has(neighbor)) {
                dfs(neighbor, component);
            }
        }

        // Reverse DFS
        for (let neighbor in adjList) {
            if (!visited.has(neighbor) && adjList[neighbor].includes(node)) {
                dfs(neighbor, component);
            }
        }
    }

    return components;
}


export function getConnectedComponents_undirected(adjList) {
    const visited = new Set();
    const components = [];

    for (let node in adjList) {
        if (!visited.has(node)) {
            const component = {};
            dfs(node, component);
            components.push(component);
        }
    }

    function dfs(node, component) {
        visited.add(node);
        component[node] = adjList[node];

        for (let neighbor of adjList[node]) {
            if (!visited.has(neighbor)) {
                dfs(neighbor, component);
            }
        }
    }

    return components;
}


export function isBidirectional(adjacencyList) {
    for (const [node, neighbors] of Object.entries(adjacencyList)) {
        for (const neighbor of neighbors) {
            if (!adjacencyList[neighbor] || !adjacencyList[neighbor].includes(node)) {
                return false;
            }
        }
    }
    return true;
}


export function makeAdjacencyListBidirectional(adjacencyList) {
    const bidirectionalAdjacencyList = {};
    // add all the nodes to the bidirectional adjacency list
    for (const node in adjacencyList) {
        if (!bidirectionalAdjacencyList[node]) {
            // copy the neighbors from the adjacency list
            bidirectionalAdjacencyList[node] = [...adjacencyList[node]];
        }
        // add the node to the neighbors' list
        for (const neighbor of adjacencyList[node]) {
            if (!bidirectionalAdjacencyList[neighbor]) {
                bidirectionalAdjacencyList[neighbor] = [...adjacencyList[neighbor]];
            }
            if (!bidirectionalAdjacencyList[neighbor].includes(node)) {
                bidirectionalAdjacencyList[neighbor].push(node);
            }
        }
    }
    return bidirectionalAdjacencyList;
}


export function getReverseAdjacencyList(adjacencyList) {
    const reverseAdjacencyList = {};
    for (const node in adjacencyList) {
        for (const neighbor of adjacencyList[node]) {
            if (!reverseAdjacencyList[neighbor]) {
                reverseAdjacencyList[neighbor] = [];
            }
            reverseAdjacencyList[neighbor].push(node);
        }
    }
    return reverseAdjacencyList;
}


export function mergeAdjacencyListsOfUnconnectedGraphs(...adjLists) {
    // Combine the lists into a single object using Object.assign()
    // Does not remove duplicates
    // Use to merge unconnected graphs
    return Object.assign({}, ...adjLists);
}


export function clearSVG(svg) {
    svg.selectAll("*").remove();
}


export function renderTrees(svg, trees) {
    // render each tree in the list of trees
    const treeLayout = initializeTreeLayout();
    for (const tree of trees) {
        renderTree(svg, tree, treeLayout);
    }
}


export function initializeTreeLayout() {
    return d3.tree()
        .nodeSize([50, 50])
        .separation((a, b) => a.parent === b.parent ? 1 : 2);
}


export function organizeTrees(svg, margin = 25) {
    const treeGroup = svg.selectAll(".tree");

    let currentWidth = 0;
    let currentHeight = margin;
    let maxHeight = currentHeight;

    const windowWidth = window.innerWidth;

    treeGroup.each(function (d, i) {
        const tree = d3.select(this);
        const { width, height, x, y } = tree.node().getBBox();

        // draw a bounding box around each tree for debugging
        tree.append("rect")
            .attr("x", x)
            .attr("y", y)
            .attr("width", width)
            .attr("height", height)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 1);

        if (maxHeight < height + currentHeight) {
            maxHeight = height + currentHeight;
        }

        if (currentWidth + width > windowWidth) {
            currentHeight = margin + maxHeight;
            currentWidth = 0;
        }

        currentWidth -= x;
        tree.attr("transform", `translate(${currentWidth}, ${currentHeight})`);
        currentWidth += width + x + margin;

    });

    svg.attr("height", maxHeight).attr("width", windowWidth);
}


export function renderTree(svg, nestedList, treeLayout = null) {
    if (!treeLayout) {
        treeLayout = initializeTreeLayout();
    }
    // use d3 tree layout to render the tree with nodes as circles and edges as straight lines

    const root = d3.hierarchy(nestedList);

    treeLayout(root);

    // create a group for the tree
    const treeGroup = svg.append("g")
        .attr("class", "tree");

    // add edges
    treeGroup.selectAll(".edge")
        .data(root.links())
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

    // add nodes
    treeGroup.selectAll(".node")
        .data(root.descendants())
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", 20);

    // add labels
    treeGroup.selectAll(".label")
        .data(root.descendants())
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y + 7)
        .text((d) => d.data.id);
}