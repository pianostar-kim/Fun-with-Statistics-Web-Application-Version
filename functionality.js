let array = [];
const formatter = new Intl.NumberFormat({ maximumSignificantDigits: 3 });

function insertNumber() {
    const inputtedNumber = Number(document.getElementById("main-input").value);
    document.getElementById("main-input").value = "";
    if (Number.isInteger(inputtedNumber)) {
        array.push(inputtedNumber);
        document.getElementById("instructions").textContent = "Enter another integer, or, if you're done, press the Calculate! button.";
        document.getElementById("array").textContent = "[" + array + "]";
        document.getElementById("calculate-button").disabled = false;
    }
    else {
        alert("Must enter an integer.");
    }
}

function showResults() {
    const contentNode = document.getElementById("content");
    contentNode.removeChild(document.getElementById("instructions"));
    contentNode.removeChild(document.getElementById("main-input"));
    contentNode.removeChild(document.getElementById("insert-button"));
    contentNode.removeChild(document.getElementById("calculate-button"));
    const resultsHeader = document.createElement("h2");
    resultsHeader.textContent = "Results";
    contentNode.appendChild(resultsHeader);
    const additionalInstruction = document.createElement("p");
    additionalInstruction.textContent = "Click on one of the statistics terms (on the left side below) for its definition and how to calculate it.";
    contentNode.appendChild(additionalInstruction);
    contentNode.appendChild(_createResultsTable());

    const addIntegerButton = document.createElement("button");
    addIntegerButton.textContent = "Add Integer";
    const addIntID = document.createAttribute("id");
    addIntID.value = "add-int-button";
    addIntegerButton.setAttributeNode(addIntID);
    addIntegerButton.onclick = function() {showAddIntPopup()};
    contentNode.appendChild(addIntegerButton);

    const deleteIntegerButton = document.createElement("button");
    deleteIntegerButton.textContent = "Delete Integer";
    const deleteIntID = document.createAttribute("id");
    deleteIntID.value = "delete-int-button";
    deleteIntegerButton.setAttributeNode(deleteIntID);
    deleteIntegerButton.onclick = function() {showDeleteIntPopup()};
    if (array.length > 1) { deleteIntegerButton.disabled = false; }
    else { deleteIntegerButton.disabled = true; }
    contentNode.appendChild(deleteIntegerButton);
}

function mean() {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += array[i];
    }
    return sum / array.length;
}

function median() {
    let arrayCopy = [];
    for (let i = 0; i < array.length; i++) { arrayCopy.push(array[i]); }
    _heapSort(arrayCopy);
    if (arrayCopy.length % 2 != 0) { return arrayCopy[(arrayCopy.length - 1) / 2]; }
    else {
        const leftValue = arrayCopy[arrayCopy.length / 2 - 1];
        const rightValue = arrayCopy[arrayCopy.length / 2];
        return (leftValue + rightValue) / 2;
    }
}

function range() {
    let largestValue = array[0];
    for (let i = 1; i < array.length; i++) {
        if (array[i] > largestValue) {
            largestValue = array[i];
        }
    }
    let smallestValue = array[0];
    for (let j = 1; j < array.length; j++) {
        if (array[j] < smallestValue) {
            smallestValue = array[j];
        }
    }
    return largestValue - smallestValue;
}

function standardDeviation() {
    const average = mean();
    let sumOfSquaredDifferences = 0;
    for (let i = 0; i < array.length; i++) {
        sumOfSquaredDifferences += Math.pow((array[i] - average), 2);
    }
    return Math.sqrt(sumOfSquaredDifferences / array.length);
}

function showExplanationPopup(typeClicked) {
    switch (typeClicked) {
        case 1:
            document.getElementById("explanation").textContent = "The mean is the number that all the numbers in a set gravitate towards. "
                + "To calculate it, first, add up all the numbers in the set. Then divide the resulting sum by the number of numbers in the set.";
            break;
        case 2:
            document.getElementById("explanation").textContent = "The median is the number that, when the set of numbers it comes from is ordered from least to greatest, is in the middle of that set."
                + " If there is an even number of numbers in the set, the median is the mean of the 2 numbers that are in the middle of the set when it is ordered from least to greatest.";
            break;
        case 3:
            document.getElementById("explanation").textContent = "The range of a set of numbers is the difference between its largest number and its smallest number.";
            break;
        default:
            document.getElementById("explanation").textContent = "The standard deviation is a general measure of how far away the numbers in a set are from the set's mean."
                + " To calculate it, first, for each of the numbers in the set, subtract from it the mean and square the resulting difference."
                + " Next, calculate the mean of the squared differences you obtained from the previous step."
                + " Then take the square root of the result you obtain from the previous step.";
    }
    document.getElementById("darkener").classList.add("active");
    document.getElementById("explanation-popup").classList.add("active");
}

function closeExplanationPopup() {
    document.getElementById("darkener").classList.remove("active");
    document.getElementById("explanation-popup").classList.remove("active");
}

function showAddIntPopup() {
    document.getElementById("darkener").classList.add("active");
    document.getElementById("add-int-popup").classList.add("active");
}

function addInteger() {
    const inputtedNumber = Number(document.getElementById("add-int-input").value);
    document.getElementById("add-int-input").value = "";
    if (Number.isInteger(inputtedNumber)) {
        array.push(inputtedNumber);
        _updateResults();
        alert(inputtedNumber + " added successfully.");
    }
    else {
        alert("Must enter an integer.");
    }
    closeAddIntPopup();
}

function closeAddIntPopup() {
    document.getElementById("darkener").classList.remove("active");
    document.getElementById("add-int-popup").classList.remove("active");
}

function showDeleteIntPopup() {
    document.getElementById("darkener").classList.add("active");
    document.getElementById("delete-int-popup").classList.add("active");
}

function deleteInteger() {
    const inputtedNumber = Number(document.getElementById("delete-int-input").value);
    document.getElementById("delete-int-input").value = "";
    if (Number.isInteger(inputtedNumber)) {
        const idxOfInputtedNumber = array.findIndex((value) => value == inputtedNumber);
        if (idxOfInputtedNumber == -1) { alert(inputtedNumber + " not found."); }
        else {
            array.splice(idxOfInputtedNumber, 1);
            _updateResults();
            alert(inputtedNumber + " successfully deleted.");
        }
    }
    else {
        alert("Must enter an integer.");
    }
    closeDeleteIntPopup();
}

function closeDeleteIntPopup() {
    document.getElementById("darkener").classList.remove("active");
    document.getElementById("delete-int-popup").classList.remove("active");
}

function _createResultsTable() {
    const termAttribute = document.createAttribute("class");
    termAttribute.value = "term";
    const valueAttribute = document.createAttribute("class");
    valueAttribute.value = "value";
    const resultsTable = document.createElement("table");

    // Work for the mean row
    const meanRow = document.createElement("tr");
    const meanHeader = document.createElement("td");
    meanHeader.setAttributeNode(termAttribute);
    meanHeader.textContent = "Mean";
    const meanOnClickAttr = document.createAttribute("onClick");
    meanOnClickAttr.value = "showExplanationPopup(1)"
    meanHeader.setAttributeNode(meanOnClickAttr);
    meanRow.appendChild(meanHeader);
    const meanValue = document.createElement("td");
    meanValue.setAttributeNode(valueAttribute);
    meanValue.textContent = formatter.format(mean());
    meanRow.appendChild(meanValue);
    resultsTable.appendChild(meanRow);

    // Work for the median row
    const medianRow = document.createElement("tr");
    const medianHeader = document.createElement("td");
    medianHeader.setAttributeNode(termAttribute.cloneNode());
    medianHeader.textContent = "Median";
    const medianOnClickAttr = document.createAttribute("onClick");
    medianOnClickAttr.value = "showExplanationPopup(2)"
    medianHeader.setAttributeNode(medianOnClickAttr);
    medianRow.appendChild(medianHeader);
    const medianValue = document.createElement("td");
    medianValue.setAttributeNode(valueAttribute.cloneNode());
    medianValue.textContent = formatter.format(median());
    medianRow.appendChild(medianValue);
    resultsTable.appendChild(medianRow);

    // Work for the range row
    const rangeRow = document.createElement("tr");
    const rangeHeader = document.createElement("td");
    rangeHeader.setAttributeNode(termAttribute.cloneNode());
    rangeHeader.textContent = "Range";
    const rangeOnClickAttr = document.createAttribute("onClick");
    rangeOnClickAttr.value = "showExplanationPopup(3)"
    rangeHeader.setAttributeNode(rangeOnClickAttr);
    rangeRow.appendChild(rangeHeader);
    const rangeValue = document.createElement("td");
    rangeValue.setAttributeNode(valueAttribute.cloneNode());
    rangeValue.textContent = range();
    rangeRow.appendChild(rangeValue);
    resultsTable.appendChild(rangeRow);

    // Work for the standard deviation row
    const standardDeviationRow = document.createElement("tr");
    const standardDeviationHeader = document.createElement("td");
    standardDeviationHeader.setAttributeNode(termAttribute.cloneNode());
    standardDeviationHeader.textContent = "Standard deviation";
    const standardDevOnClickAttr = document.createAttribute("onClick");
    standardDevOnClickAttr.value = "showExplanationPopup(4)"
    standardDeviationHeader.setAttributeNode(standardDevOnClickAttr);
    standardDeviationRow.appendChild(standardDeviationHeader);
    const standardDeviationValue = document.createElement("td");
    standardDeviationValue.setAttributeNode(valueAttribute.cloneNode());
    standardDeviationValue.textContent = formatter.format(standardDeviation());
    standardDeviationRow.appendChild(standardDeviationValue);
    resultsTable.appendChild(standardDeviationRow);

    return resultsTable;
}

function _updateResults() {
    let arrayText = document.getElementById("array");
    arrayText.textContent = "[" + array + "]";
    let allResults = document.getElementsByClassName("value");
    allResults[0].textContent = formatter.format(mean());
    allResults[1].textContent = formatter.format(median());
    allResults[2].textContent = range();
    allResults[3].textContent = formatter.format(standardDeviation());
    const deleteButton = document.getElementById("delete-int-button");
    if (array.length > 1) { deleteButton.disabled = false; }
    else { deleteButton.disabled = true; }
}

function _heapSort(arrayToSort) {
    _buildMaxHeap(arrayToSort);
    for (let i = arrayToSort.length - 1; i > 0; i--) {
        _swap(arrayToSort, 0, i);
        _siftDown(arrayToSort, 0, i - 1);
    }
}

function _swap(array, index1, index2) {
    const placeholder = array[index1];
    array[index1] = array[index2];
    array[index2] = placeholder;
}

function _buildMaxHeap(array) {
    for (let i = Math.floor((array.length - 2) / 2); i >= 0; i--) { _siftDown(array, i, array.length - 1); }
}

function _siftDown(array, startIndex, endIndex) {
    let i = startIndex;
    while (2 * i + 1 <= endIndex) {

        // index i has 2 children
        if (2 * i + 2 <= endIndex) {
            if (array[i] < array[2 * i + 1] || array[i] < array[2 * i + 2]) {
                const idxToSwapWith = array[2 * i + 1] >= array[2 * i + 2] ? 2 * i + 1 : 2 * i + 2;
                _swap(array, i, idxToSwapWith);
                i = idxToSwapWith;
            }
            else { break; }
        }

        // index i has only 1 child
        else {
            if (array[i] < array[2 * i + 1]) {
                _swap(array, i, 2 * i + 1);
                i = 2 * i + 1;
            }
            else { break; }
        }
    }
}