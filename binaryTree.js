const Node = (value) => {
    let right = null;
    let left = null;

    return {value,left,right};
}

const Tree = (arr) => {

    const prettyPrint = (node, prefix = '', isLeft = true) => {
        if (node.right !== null) {
          prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
        }
        console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.value}`);
        if (node.left !== null) {
          prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
        }
      }

    const buildTree = (inputArr) => {
        //console.log(inputArr);

        if (inputArr.length < 1) {
            return null;
        }

        let mid = 0;

        if (inputArr.length % 2 === 0) {
            mid = Math.floor((inputArr.length/2) - 1);
        }
        else {
            mid = Math.floor(inputArr.length/2);
        }
        //console.log(mid);

        let rootNode = Node(inputArr[mid]);
        rootNode.left = buildTree(inputArr.slice(0,mid)); //takes new array from 0 to mid-1
        rootNode.right = buildTree(inputArr.slice(mid+1,inputArr.length)); //takes new array from mid+1 to last element

        return rootNode;
        
    }

    // ----------          FACTORY FUNCTION CALL DOES THIS OPERATION WHEN CALLED          ----------
    //Sorting the array
    let sortedArr = mergeSort(arr);
    
    //Getting root element which will contain the tree and nodes
    let root = buildTree(sortedArr);

    const find = (value, rootNode=root) => {

        //If node with value is not present, return null
        if (rootNode === null) return null;

        //If node with value is present, return the node
        if (value === rootNode.value) {
            return rootNode;
        }


        //Recursively halving the tree by changing the root node based on comparing the value with rootNode's value
        if (value < rootNode.value) {
            rootNode = rootNode.left;
            return find(value,rootNode);
        }
        else {
            rootNode = rootNode.right;
            return find(value,rootNode);
        }
    }

    const insert = (value, rootNode = getRoot()) => {
        
        if (rootNode === null) return rootNode = Node(value);

        if (value < rootNode.value) {
            rootNode.left = insert(value,rootNode.left);
        }
        else if (value > rootNode.value) {
            rootNode.right = insert(value, rootNode.right);
        }

        return rootNode;
    }

    const remove = (value, rootNode = root) => {
        //console.log(`${rootNode.value}\n\n`);

        //Base case, when tree is empty then return null
        if (rootNode === null) return null;

        //Find value in tree by traversing the tree recursively
        if (value > rootNode.value) {
            rootNode.right = remove(value, rootNode.right);
        }
        else if (value < rootNode.value) {
            rootNode.left = remove(value, rootNode.left)
        }
        //If the node is found
        else {

            //For node with one child
            if (rootNode.left === null) {
                return rootNode.right;
            }

            if (rootNode.right === null) {
                return rootNode.left;
            }

            //For node with two children
            // We're changing the value of the rootNode with 2 children to the node with least value in the right subtree of the rootNode and then within the right subtree, we're removing the node from which we copied the value from through recursion
            rootNode.value = _minValue(rootNode.right);
            
            rootNode.right = remove(rootNode.value, rootNode.right);

        }

        return rootNode;
    }

    const _minValue = (rootNode) => {
        //Find minimum value within tree
        let minimumVal = rootNode.value;

        while (rootNode.left !== null) {
            console.log(rootNode.value);
            rootNode = rootNode.left;
            minimumVal = rootNode.value;
        }

        return minimumVal;
    }

    const levelOrder = (rootNode) => {
        let queue = [];

        if (rootNode === null) return null;
        
        queue.push(rootNode);
        //console.log(queue);

        while (queue.length !== 0) {
            let current = queue[0];
            console.log(current.value);

            if ( current.left !== null) queue.push(current.left);

            if ( current.right !== null) queue.push(current.right);

            queue.shift();
        }

    }

    const inOrder = (callback, rootNode=root) => {

        if(!callback) {
            let values = [];
            const pushToValues = (value) => {
                values.push(value);
            };

            inOrder(pushToValues, rootNode);
            return values;
        }

        if (rootNode !== null) {
            inOrder(callback,rootNode.left);
            callback(rootNode.value);
            console.log(rootNode.value);
            inOrder(callback,rootNode.right);
        }
    }

    const preOrder = (callback, rootNode=root) => {

        if(!callback) {
            let values = [];
            const pushToValues = (value) => {
                values.push(value);
            };

            preOrder(pushToValues, rootNode);
            return values;
        }


        if (rootNode !== null) {
            callback(rootNode.value);
            console.log(rootNode.value);
            preOrder(callback, rootNode.left);
            preOrder(callback, rootNode.right);
        }
        
    }

    const postOrder = (rootNode) => {

        if(!callback) {
            let values = [];
            const pushToValues = (value) => {
                values.push(value);
            };

            postOrder(pushToValues, rootNode);
            return values;
        }


        if (rootNode !== null) {
            postOrder(callback, rootNode.left);
            postOrder(callback, rootNode.right);
            console.log(rootNode.value);
            callback(rootNode.value);
            return rootNode.value;
        }
        
    }

    const height = (node) => {


        if (node === null) {
            return -1;
        }

        //console.log(node);

        let leftHeight = height(node.left);
        let rightHeight = height(node.right);

        return Math.max(leftHeight,rightHeight) + 1;

    }

    const depth = (node, nodeDepth = 0, rootNode = root) => {

        //console.log(rootNode);

        if (node === null || node.value === rootNode.value) {
            return nodeDepth;
        }

        if (node.value < rootNode.value) {
            return depth(node, nodeDepth+1,rootNode.left);
        }
        
        if (node.value > rootNode.value) {
            return depth(node, nodeDepth+1,rootNode.right);
        }

        return nodeDepth;
    }

    const rebalance = () => {

        const rebalanceNodes = inOrder(); //We're using inOrder because the array returned is sorted by default
        const rebalanceNodesSorted = mergeSort(rebalanceNodes);
        console.log(rebalanceNodesSorted);
        return buildTree(rebalanceNodesSorted);

    }

    const isBalanced = (rootNode = root) => {

        if (rootNode === null) return true;

        if (Math.abs(height(rootNode.left) - height(rootNode.right)) > 1) {
            return false;
        }

        if (isBalanced(rootNode.left) === false || isBalanced(rootNode.right) === false) {
            return false;
        }

        return true;
    }

    const getRoot = () => {
        return root;
    }

    return {find, insert, getRoot, prettyPrint, remove, levelOrder, inOrder, preOrder, postOrder, rebalance, height, depth, isBalanced};

};

const mergeSort = (arr) => {

    if (arr.length < 2) {
        return arr;
    }

    let mid = Math.floor(arr.length / 2);
    let leftHalf = arr.slice(0,mid);
    let rightHalf = arr.slice(mid, arr.length);

    leftHalf = mergeSort(leftHalf);
    rightHalf = mergeSort(rightHalf);
    return merge(leftHalf,rightHalf);
    
}

const merge = (arr1,arr2) => {
    let i = 0 , j = 0 , k = 0
    let mergedArr = [];


    //LogimergedArr to perform the merge
    while (i < arr1.length && j < arr2.length) {

        if (arr1[i] < arr2[j]) {
            mergedArr[k] = arr1[i];
            k++;
            i++;
        }
        else {
            mergedArr[k] = arr2[j];
            k++;
            j++;
        }
    }


    //For loops to mergedArropy any remaining elements in the original arrays into the merged array
    for ( ; i < arr1.length ; i++) {
        mergedArr[k] = arr1[i];
        k++;
    }

    for ( ; j < arr2.length ; j++) {
        mergedArr[k] = arr2[j];
        k++;
    }

    return mergedArr;
}

let bst = Tree([1, 4, 23, 8, 9, 3, 5, 7, 67, 6345, 324]);
//console.log(bst.find(3));
//bst.prettyPrint(bst.getRoot());
console.log("\n\n");
//bst.remove(67);
bst.prettyPrint(bst.getRoot());
console.log("\n\n");
// console.log(bst.getRoot());
//bst.levelOrder(bst.getRoot());
//console.log(bst.inOrder());
//console.log(bst.preOrder());
//bst.postOrder(bst.getRoot());
//bst.prettyPrint(bst.rebalance());
//console.log(bst.find(4));
console.log(bst.height(bst.find(8)));
console.log(bst.depth(bst.find(23)));
console.log(bst.isBalanced());