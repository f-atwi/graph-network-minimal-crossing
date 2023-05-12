import * as tree from "./tree.js";

const adjacency_list =
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
const width = window.innerWidth;
const height = window.innerHeight;
const node_radius = 20;
const margin = 50;
const svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);


let components = tree.getConnectedComponents(adjacency_list);

// for each component that is a tree, render it
let trees = components.filter(component => tree.isTree(component, false));
trees = trees.map(t => tree.treeAdjacencyListToNestedList(t, undefined, false));
tree.renderMultipleTrees(svg, trees, width, height, margin, node_radius);

// update width when window is resized
window.addEventListener("resize", () => {
    width = window.innerWidth;
    height = window.innerHeight;
    tree.clearSVG(svg);
    tree.renderMultipleTrees(svg, trees, width, height, margin, node_radius);
});