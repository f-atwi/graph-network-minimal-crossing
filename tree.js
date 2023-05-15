export function treeAdjacencyListToNestedList(adjList, root = null, bidirectional = true) {
    // use biAdjList. If bidirectional is true, biAdjList is the same as adjList, otherwise it is the bidirectional version of adjList
    const biAdjList = bidirectional ? adjList : makeAdjacencyListBidirectional(adjList);
    if (!root) {
        root = Object.keys(biAdjList)[0];
    }
    const visited = new Set();

    function dfs(node) {
        visited.add(node);
        const children = biAdjList[node].filter(child => !visited.has(child));
        const nestedObj = { id: node.toString(), children: [] };
        children.forEach(child => {
            const childObj = dfs(child);
            nestedObj.children.push(childObj);
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


export function isTree(adjList, bidirectional = true) {
    const biAdjList = bidirectional ? adjList : makeAdjacencyListBidirectional(adjList);
    const visited = new Set();

    // Check if the graph is acyclic
    function dfs(node, parent) {
        visited.add(node);
        for (const child of biAdjList[node]) {
            if (!visited.has(child)) {
                if (!dfs(child, node)) {
                    return false;  // Detected a cycle
                }
            } else if (child !== parent) {
                return false;  // Detected a cycle
            }
        }
        return true;
    }

    // Check if the graph is connected
    dfs(Object.keys(adjList)[0], null);
    return visited.size === Object.keys(adjList).length;
}


export function getConnectedComponents(adjList, bidirectional = false) {
    if (bidirectional) {
        return getConnectedComponents_undirected(adjList);
    } else {
        return getConnectedComponents_directed(adjList);
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
    for (const [node, neighbors] of Object.entries(adjacencyList)) {
        if (!bidirectionalAdjacencyList[node])
            bidirectionalAdjacencyList[node] = [];
        for (const neighbor of neighbors) {
            // Add the original edge
            bidirectionalAdjacencyList[node].push(neighbor);
            // Add the reverse edge if it doesn't exist already
            if (!bidirectionalAdjacencyList[neighbor]) {
                bidirectionalAdjacencyList[neighbor] = [node];
            } else if (!bidirectionalAdjacencyList[neighbor].includes(node)) {
                bidirectionalAdjacencyList[neighbor].push(node);
            }
        }
    }
    return bidirectionalAdjacencyList;
}


export function mergeAdjacencyListsofUnconnectedGraphs(adjList1, adjList2) {
    // Combine the two lists into a single object using Object.assign()
    // Does not remove duplicates
    // Use to merge unconnected graphs
    return Object.assign({}, adjList1, adjList2);
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