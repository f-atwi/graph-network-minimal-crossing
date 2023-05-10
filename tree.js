function treeAdjacencyListToNestedList(adjList, root, bidirectional = true) {
    // use biAdjList. If bidirectional is true, biAdjList is the same as adjList, otherwise it is the bidirectional version of adjList
    const biAdjList = bidirectional ? adjList : makeAdjacencyListBidirectional(adjList);
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


function isTree(adjList, bidirectional = true) {
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


function getConnectedComponents(adjList) {
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


function isBidirectional(adjacencyList) {
    for (const [node, neighbors] of Object.entries(adjacencyList)) {
        for (const neighbor of neighbors) {
            if (!adjacencyList[neighbor] || !adjacencyList[neighbor].includes(node)) {
                return false;
            }
        }
    }
    return true;
}


function makeAdjacencyListBidirectional(adjacencyList) {
    const bidirectionalAdjacencyList = { ...adjacencyList };

    for (const [node, neighbors] of Object.entries(adjacencyList)) {
        for (const neighbor of neighbors) {
            if (!bidirectionalAdjacencyList[neighbor]) {
                bidirectionalAdjacencyList[neighbor] = [node];
            } else if (!bidirectionalAdjacencyList[neighbor].includes(node)) {
                bidirectionalAdjacencyList[neighbor].push(node);
            }
        }
    }

    return bidirectionalAdjacencyList;
}


function mergeAdjacencyListsofUnconnectedGraphs(adjList1, adjList2) {
    // Combine the two lists into a single object using Object.assign()
    // Does not remove duplicates
    // Use to merge unconnected graphs
    return Object.assign({}, adjList1, adjList2);
}


function clearSVG(svg) {
    svg.selectAll("*").remove();
}

width = 600;
height = 600;
node_radius = 20;
margin = 50;
const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

function renderTreeLayout(svg, nestedList, width, height, margin, node_radius) {
    // use d3 tree layout to render the tree with nodes as circles and edges as straight lines
    const treeLayout = d3.tree().size([width - (2 * margin), height - (2 * margin)]);
    const root = d3.hierarchy(nestedList);
    treeLayout(root);

    // add edges
    svg.selectAll(".edge")
        .data(root.links())
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("x1", (d) => d.source.x + margin)
        .attr("y1", (d) => d.source.y + margin)
        .attr("x2", (d) => d.target.x + margin)
        .attr("y2", (d) => d.target.y + margin);

    // add nodes
    svg.selectAll(".node")
        .data(root.descendants())
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("cx", (d) => d.x + margin)
        .attr("cy", (d) => d.y + margin)
        .attr("r", node_radius);

    // add labels
    svg.selectAll(".label")
        .data(root.descendants())
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", (d) => d.x + margin)
        .attr("y", (d) => d.y + margin + 7)
        .text((d) => d.data.id);
}
