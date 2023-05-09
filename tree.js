function convert_adjacency_list_to_nested_list(adjacency_list, root, visited = new Set(), bidirectional_adjacency_list = null) {
    if (bidirectional_adjacency_list === null) {
        bidirectional_adjacency_list = makeAdjacencyListBidirectional(adjacency_list)
    }
    const nestedNodes = {
        id: root,
        children: []
    }

    if (bidirectional_adjacency_list[root] === null || adjacency_list[root].length === 0) {
        return nestedNodes
    }

    visited.add(root)

    for (const child of adjacency_list[root].concat(get_adjacent_nodes(adjacency_list, inverse_adjacency_list, root))) {
        if (!visited.has(child)) {
            nestedNodes.children.push(convert_adjacency_list_to_nested_list(adjacency_list, child, visited, inverse_adjacency_list))
        }
    }

    return nestedNodes
}

function constructNestedList(adjList, root) {
    biTree = makeAdjacencyListBidirectional(adjList);
    const visited = new Set();

    function dfs(node) {
        visited.add(node);
        const children = biTree[node].filter(child => !visited.has(child));
        const nestedObj = { id: node.toString(), children: [] };
        children.forEach(child => {
            const childObj = dfs(child);
            nestedObj.children.push(childObj);
        });
        return nestedObj;
    }

    return dfs(root);
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




adjacency_list = {
    "0": ["1", "2", "3"],
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
}

width = 600;
height = 600;
node_radius = 20;
margin = 50;
const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// use d3 tree layout to render the tree with nodes as circles and edges as straight lines
const treeLayout = d3.tree().size([width - (2 * margin), height - (2 * margin)]);
const root = d3.hierarchy(constructNestedList(adjacency_list, "3"));
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
