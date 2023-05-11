function treeAdjacencyListToNestedList(adjList, root = null, bidirectional = true) {
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


function getConnectedComponents(adjList, bidirectional = false) {
    if (bidirectional) {
        return getConnectedComponents_undirected(adjList);
    } else {
        return getConnectedComponents_directed(adjList);
    }
}


function getConnectedComponents_directed(adjList) {
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


function getConnectedComponents_undirected(adjList) {
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

function renderMultipleTrees(svg, trees, width, height, margin, node_radius) {
    // render multiple trees in a grid
    const numTrees = trees.length;
    const numCols = Math.ceil(Math.sqrt(numTrees));
    const numRows = Math.ceil(numTrees / numCols);

    const treeWidth = (width - (2 * margin)) / numCols;
    const treeHeight = (height - (2 * margin)) / numRows;

    trees.forEach((tree, i) => {
        const treeSVG = svg.append("g")
            .attr("transform", `translate(${(i % numCols) * treeWidth + margin}, ${Math.floor(i / numCols) * treeHeight + margin})`);
        renderTreeLayout(treeSVG, tree, treeWidth, treeHeight, 0, node_radius);
    }
    );


}

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

adjacency_list =
{
    "0": ["2", "3"],
    "1": ["4", "5"],
    "2": ["6", "7"],
    "3": [],
    "4": ["11"],
    "5": ["12", "13"],
    "6": [],
    "7": [],
    "8": ["3"],
    "9": ["3"],
    "10": ["3"],
    "11": [],
    "12": [],
    "13": [],
    "14": ["5"]
};
// get width and height according to window size
width = window.innerWidth;
height = window.innerHeight;
node_radius = 20;
margin = 50;
const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

biAdjList = makeAdjacencyListBidirectional(adjacency_list);

let components = getConnectedComponents(biAdjList);

// for each component that is a tree, render it
trees = components.filter(component => isTree(component, false));
trees = trees.map(tree => treeAdjacencyListToNestedList(tree, bidirectional = false));
renderMultipleTrees(svg, trees, width, height, margin, node_radius);

// update width when window is resized
window.addEventListener("resize", () => {
    width = window.innerWidth;
    height = window.innerHeight;
    clearSVG(svg);
    renderMultipleTrees(svg, trees, width, height, margin, node_radius);
});