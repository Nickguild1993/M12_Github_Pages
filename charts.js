d3.json("samples.json").then(function(data){
    console.log(data);
});


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Bar and Bubble charts
// Create the buildCharts function.
function buildCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // Create a variable that holds the samples array. 
    var samplesArray = data.samples
    // Create a variable that filters the samples for the object with the desired sample number.
    var samplesFilter = samplesArray.filter(sampleObj => sampleObj.id == sample)
    // Create a variable that holds the first sample in the array.
    var samplesResult = samplesFilter[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    console.log("++++++++++")
    var otuIds = samplesResult.otu_ids
    console.log("++++++++++")
    console.log(otuIds)
    var otuLabels = samplesResult.otu_labels
    var sampleValues = samplesResult.sample_values

    // Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    // so the otu_ids with the most bacteria are last. 
    console.log("sliceIds")
    var sliceIds = otuIds.slice(0,10);
    console.log(sliceIds)
    console.log("sliceIds above")
    var mapTicks = sliceIds.map(d => "OTU " + d)
    console.log("mapTicks")
    console.log(mapTicks)
    console.log("mapTicks above")
    var yticks = mapTicks.sort((a,b) => b - a)
    console.log("(++++++")
    console.log(yticks)
    console.log("yticks above")
    

    // Create the trace for the bar chart. 
    var barData = {
      x: sampleValues.slice(0,10).reverse(),
      y: yticks.reverse(),
      type: "bar",
      name: "Bacteria",
      orientation: "h",
      text: otuLabels
    };
      
    
    // Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };
    
    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("barBacteria", [barData], barLayout)
    // 1. Create the trace for the bubble chart.
    var bubbleData = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: "markers",
      marker: {
        color: otuIds,
        size: sampleValues  
      }
    };

    var bubbles = [bubbleData];
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures per Sample",
      // annotations: [{
      //   text: "Scrubs per Week",
      //     font: {
      //     size: 14,
      //     color: "rgb(126, 99, 160)"
      //     }
      // }]
      xaxis: {title: "OTU ID"},
      showlegend: false,
      height: 600,
      width: 1200
    };

    // D2.3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbles, bubbleLayout)

    
    //         *****  DELIVERABLE 3 *****

    // 1. Create variable that filters the metadata array for an object in the array whose id property matches the
    // id number passed into buildCharts() function as the argument.
    var metaArray = data.metadata
    var metaFilter = metaArray.filter(idObj => idObj.id == sample)

    // 2. Create a variable that holds the first sample in the array created in step 1.(2?)
    var metaIndex = metaFilter[0];

    // 3. create a variable that converts the washing frequency to a floating point number.  (review thursday class!)
    console.log("wfreq below")
    var wfreqFloat = metaIndex.wfreq
    typeof wfreqFloat
    console.log(wfreqFloat)
    console.log("wfreq above")

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: wfreqFloat,
          title: { text: "Belly Button Washing Frequency <br> Scrubs Per Week </br>" },
          type: "indicator",
          mode: "gauge+number",
          gauge: {
            axis: { range: [null, 10], tickwidth: 1, tickcolor: "black" },
            bar: { color: "darkblue" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",
            steps: [
              {range: [0, 2], color: "firebrick"},
              {range: [2, 4], color: "orange"},
              {range: [4, 6], color: "yellow"},
              {range: [6, 8], color: "palegreen"},
              {range: [8, 10], color: "forestgreen"}
            ]
          }

        }
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
     widith: 600,
     height: 400,
     margin: { t: 25, r: 25, l: 25, b: 25}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout)



    // max range for gauge should be 10.
    
    // colors go : RED (2), ORANGE (4), YELLOW (6), LIGHT GREEN (8), DARK GREEN (10)

    // set bar color of the guage to BLACK or a dark color to contrast against the range colors.

    // Assign different colors as string values in increments of 2 (steps?) for the steps object. just used named colors..













  });
}
