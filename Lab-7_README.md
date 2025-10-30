# GEOG 464 - Lab 7 - Web-Mapping

The goal of this lab is to develop more web-mapping skills and to create a basic web atlas. The distinction we are making here between a simple map and atlas refers to the fact that our web atlas will allow the user to toggle and reload different data layers.

In addition to becoming more familiar with JS objects and the Leaflet API, this lab will also introduce you to event handling, which allow you to attach functionality to existing DOM elements and trigger specific changes on the webpage when the event occurs.

## Getting started

There is less guidance in this lab, so you are encouraged to follow tips closely, use documentation, and take more initiative in your coding practice. Note that as a final step, you will need to upload the website files as a GitHub repository and publish as a [public GitHub page](https://docs.github.com/en/pages/quickstart). If you haven't done so already, sign up for a GitHub account, then [create a public repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository) for this lab.

You can choose to read the contents of this lab on my GitHub repository (as you are likely doing now), or to download the repository and open the README in VS Code if you prefer. You can do this by going to the *Code* drop-down and clicking *Download ZIP*. You can then decompress the folder and have local access to all the files in this lab. You could conversely choose to download individual files from the repository by clicking on them, then clicking the download button.

Get started by creating a working directory for this lab (i.e. a 'Lab-7' folder), if you haven't done so already. Then, download and decompress the Lab-7_DOWNLOADME.zip folder from my repository (or find it within the zip of the entire repo you've already downloaded), and move its contents into your lab working directory. The base website files (*index.html*, *main.js* and *styles.css*) within should already be in their respective folders. I have also included the Leaflet library (in the */lib* folder), which you downloaded for yourself in the previous lab. Refer to the previous lab for more info on setting up your working directory.

## Fetching data from a server

- Add the following function declaration to your script file (*main.js*).

```javascript
function fetchData(url){
    //load the data
    fetch(url)
        .then(function(response){
            return response.json();
        })
        .then(function(json){
            //create a Leaflet GeoJSON layer using the fetched json and add it to the map object
            L.geoJson(json).addTo(myMap);
        })
};
```

Last time, we made a simple webpage that linked to data in a *data/* folder. This time, we will be using the fetch API.

> Javascript is a [synchronous](https://www.freecodecamp.org/news/synchronous-vs-asynchronous-in-javascript/), single-threaded language. Since it runs on a single thead, it can only execute one command at a time, meaning other commands need to wait a previous command's execution before running. Retrieving data from a server can be more complicated though, since once the HTTP request is made, JavaScript doesn't know how long the data (potentially on the other side of the world), will take to be retrieved, and will continue to run subsequent commands with or without it. You could go a long time learning and coding in JavaScript without engaging with [synchronicity/asynchronicity](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Introducing), but that would limit you when it comes to dynamically retrieving data to populate something like a web map. The *fetch* method is used to accomodate JavaScript by telling it to continue running *only when the fetched data has been received*.

> You might notice the above code includes *.then* notation, which have to do with [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise). Promises allow you to create asynchronous processes in JavaScript, essentially "promising" the main action sequence that there will be a return value from this task at some point, and can result in success or failure. This is *asynchronous JavaScipt*, and has to do with JavaScript's [event loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop), which is a [complex topic](https://www.youtube.com/watch?v=8aGhZQkoFbQ) that is beyond the scope of this lab. For the sake of this exercise though, we are using promises to await the data from GitHub, which could take some time depending on how accessible the server is, how large the dataset is, etc.

- Call the `fetchData()` function from within your *loadMap()* function (be mindful of where inside the *loadMap* function you choose to call it!)

The sample data you need has been made available on the lab source repo. You will want to pass the url for this dataset to your JS *fetch* method!

- Visit the [URL for the sample data](https://github.com/brubcam/GEOG-464_Lab-7/blob/main/DATA/train-stations.geojson) representing train stations.
- Click *Raw*. This will give you a link to the actual data, rather than GitHub's rendering of it.
- Paste the URL as a string to the *fetch* method.

Once you've saved your script and reloaded your web browser, you should see loaded placemarks. That's quite a bit of placemarks!

**Q1. Use the [free tileset providers reference](https://leaflet-extras.github.io/leaflet-providers/preview/) to add a new tilelayer of your choice to your map.** The new tileset must be selectable from your baselayer selector widget. You should be able to complete this pretty easily since a template is already provided for you. (1 points)

## Styling our layer(s)

As you've already seen, GeoJSON data can be added to a Leaflet map using the [*GeoJSON*](https://leafletjs.com/reference.html#geojson) method of the leaflet API (*L.geoJSON()*). When referring to the linked documentation, we notice the method also accepts *options*, which can be passed as additional keyword parameters. Unlike Python though, it's not as intuitive to pass keyword parameters to functions in JavasScript... You can [make it work](https://exploringjs.com/js/book/ch_callables.html#named-parameters), however, by passing them inside a JS object as an additional second argument...

We will start by passing two built-in *options* recognized by the *geoJSON* method: *pointToLayer* and *style* (notice there are others as well, such as [*filter*](https://leafletjs.com/reference.html#geojson-filter)). (1) The *pointToLayer* parameter defines a function to convert GeoJSON points into Leaflet layers. (2) The *style* option will allow us to [style the Leaflet layer](https://leafletjs.com/reference.html#path-option). We will pass functions to these options which we will declare elsewhere.

- Add the following JS object as an additional parameter in the *L.geoJson* function call, directly following the *json* argument: `{style: styleAll, pointToLayer: generateCircles}`.
- Elsewhere in your script file, declare the functions you are calling (use template below):

```javascript
function generateCircles(feature, latlng) {
	return L.circleMarker(latlng);
}

function styleAll(feature, latlng) {
	
	var styles = {dashArray:null, dashOffset:null, lineJoin:null, lineCap:null, stroke:false, color:'#000', opacity:1, weight:1, fillColor:null, fillOpacity:0 };

	if (feature.geometry.type == "Point") {
		styles.fillColor = '#fff'
		,styles.fillOpacity = 0.5
		,styles.stroke=true
		,styles.radius=9
	}
	
	return styles;
}

```

- Save your script and reload your browser to make sure the changes are reflected in your map.

**Q2. What is happening in the *styleAll* function? Explain what the *styles* variable is and what it contains, what the conditional statement is doing and what gets returned by the function.** Write your answer (and all following text answers) inside a \<p> tag in *div1* of your html file. (2 points)

Notice you are accessing property found in your GeoJSON data here (accessible from the default *feature* parameter). What else could you access here? Notice our *generateCircles* function gets passed 2 parameters from [*pointToLayer*](https://leafletjs.com/reference.html#geojson-pointtolayer), and adds a [*circleMarker*](https://leafletjs.com/reference.html#circlemarker) for every *latlng* (a Leaflet object that contains coordinates). You can do a lot with this...

- paste a `console.log()` statement at the top of your *styleAll* function so that it prints the station IDs and reload your page. You can access the data's attribute values (station ID, name, etc.) inside the feature object (you might want to look at the link to your raw data on GitHub again). Observe the station codes in your inspector console.

**Q3. Add a conditional statement to your *styleAll* function that will style the *fillColor* of features containing a postal code (some are missing them).** Use the colour 'cyan' instead of '#fff' for these. (2 points)

## Adding some basic interactivity for data browsing

- We will now add the [*onEachFeature*](https://leafletjs.com/reference.html#geojson-oneachfeature) parameter to Leaflet's *geoJSON* method call. This will allow us to add some additional functionality to our geographic features.
- Append the following to your options called from the *L.geoJSON()* method: `onEachFeature: addPopups`. As you can see, the value passed to *onEachFeature* is a function call we are naming *addPopups*.
- Declare `addPopups()` as an empty function elsewhere in your script. This function can receive two variables from *onEachFeature* which we will refer to as *feature* and *layer* (add these as arguments to your *addPopups* declaration).
- Inside this function, `console.log()` both *feature* and *layer* to see what they contain. In your console, explore these objects and their many attributes...

As you can see, like the other functions we've been adding, you have access to a lot of elements here, which you can refer to or modify freely using JavaScript.

**Q4. What is *feature* and what is *layer* here? What do they refer to?** (2 points)

- Add the next few lines inside your *addPopups* function (this is just an exercise):

```javascript
console.log(layer._radius)
console.log(layer.options.fill)
console.log(layer.getLatLng())
```

**Q5. What is the fundamental difference between [*layer.options.fill*](https://leafletjs.com/reference.html#path-fill) and [*layer.getLatLng()*](https://leafletjs.com/reference.html#marker-getlatlng), beyond the fact that they return different pieces of information?** (2 points)

- Set *layer.options.fill* to *false* (i.e. `layer.options.fill = false`) and *layer._radius* to *80*.

**Q6. Reload your web browser. What happened?** (2 points)

As you can see, you can directly access map elements yourself by knowing your way around these JavaScript objects (ee [object prototypes](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/Object_prototypes) for a deeper understanding of JS objects)! Indeed, there are *many* possibilities for elaborate customization here, which you can control more powerfully using your knowledge of programming (conditional statements, looping, etc.). You can use these attributes outside of your map too in your webpage to modify JS, HTML, CSS, SVG, etc.

- Delete (or comment out) all those *console.logs* you added. Remember that this is our function for adding pop-ups, not for fooling around with styling (even though you could technically do that here since you have access to these elements)!
- Add the [`bindPopup`](https://leafletjs.com/reference.html#layer-bindpopup) method to your function, which you can access from the layer object (i.e. paste `layer.bindPopup();`).
- You can pass anything you like to *bindPopup*, and it will display as a pop-up on your map features. It's likely that you want to pass some data attributes to it though, which are accessible within both the *feature* and *layer* objects. Pass the station name attribute to this method and reload your web browser. Note that you could also pass additional [pop-up options](https://leafletjs.com/reference.html#popup-option) to the `bindPopup` method as well to customize your pop-ups.

## Interactively reloading a map

Let's say you wanted to allow users to browse different datasets interactively. You should probably create some kind of HTML object that can handle events.

> [Events](https://developer.mozilla.org/en-US/docs/Web/Events/Event_handlers) can be dealt with in several ways. Events are things like *clicks* or *mouseovers*, which trigger JavaScript functions. For example, you can [call functions from HTML](https://www.w3schools.com/tags/ref_eventattributes.asp) as event handlers such as [*onclick*](https://www.w3schools.com/jsref/event_onclick.asp), commonly used with things like HTML [*buttons*](https://www.w3schools.com/tags/tag_button.asp). However, you can also add [*event listeners*](https://developer.mozilla.org/en-US/docs/Web/Events/Event_handlers#eventtarget.addeventlistener) to HTML objects using JavaScript, which is a better way of doing things since it isn't hardcoded into your HTML (i.e. since adding event listeners is done with JS, you can dynamically add and remove them to enable and disable interactivity in your website).

In this example, we will start by simply hardcoding it into our HTML as a simple *event handler*. The HTML [*select*](https://www.w3schools.com/tags/tag_select.asp) object features an [*onChange*](https://www.w3schools.com/jsref/event_onchange.asp) attribute from which you can call a function (the function is contained inside a string here because this is an inline JS script inside HTML). This will trigger the function whenever the selected item from the drop-down menu is changed.

```javascript
<select class="li-nav" name="mapdropdown" id="mapdropdown" onChange="loadMap(this.value);">
	<option value="map0" selected="selected" disabled>Load a map</option>
	<option value='mapa'>Map A</option>
	<option value='mapb'>Map B</option>
</select>
```

- Paste the above code into your HTML page. Note the property that is being passed as an argument to our *loadMap* function as well as [how](https://www.w3schools.com/js/js_this.asp) it's being passed.
- Since we are now launching our map using interactivity, you might want to comment out/remove *window.onload* in the JS file.
- Reload your web browser and select from your drop-down, does a map load?
- As you can see in the code above, you are now passing a parameter to *loadMap()*, so you should probably give this function declaration a parameter. Calling this variable *mapid* would make sense. Make sure to `console.log()` *mapid* inside your *loadMap* function to make sure it's getting passed in properly.
- Now, create a conditional statement that checks whether *mapid* is equal to *mapa* or *mapb*. Depending on which one it is, you will load a map using different options (center, zoom, maxZoom, etc.), and call *fetchData()* using a different dataset (use a link to the train stations for *mapa* and to *[megacities.geojson](https://github.com/brubcam/GEOG-464_Lab-7/blob/main/DATA/megacities.geojson)* for mapb!) Make sure that the map settings are coherent with the extents and scales of these different datasets.
- Everything may seem to be working, but there's still an issue: loading a new Leaflet map with an existing Leaflet map instance already loaded could be problematic. You might therefore need to remove any existing map instances before loading a new one (this allows for the user to continuously switch between map load options). Observe the following code: you can use this code and embed your previous conditional statements inside it:

```javascript
try {
	myMap.remove()
} catch(e) {
	console.log(e)
	console.log("no map to delete")
} finally {
	//put your map loading code in here
}
```

Above we are looking at some JavaScript control flow (very similar to what you can also find in Python). [Try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch) functionality will allow you to handle things that might be unexpected, making your code more flexible and less likely to stop working as intended. In this case, we are attempting to remove *myMap*, which is your Leaflet map instance. If there is no map to remove, the code won't stall: it will display an error code and then move on.

Good luck debugging!

## Adding an Event listener using JavaScript

As an additional final step, you are asked to replace the hardcoded event handler with one that is loaded into the page using JavaScript:

**Q7. Replace the *OnChange* event handler in the HTML select object with a function in your *main.js* script that will add this as an event listener to the *select* object.** The [`addEventListener()`](https://www.w3schools.com/jsref/met_document_addeventlistener.asp) function will help you in doing this. (4 points)

## Finishing up

**Q8. Once both maps are working and you're able to switch between them without error, continue to play around with the Leaflet [styling](https://leafletjs.com/reference.html#path) and [pop-up](https://leafletjs.com/reference.html#popup-option) options to make informative and visually appealing interactive maps for the two datasets.** (3 points)

Finally, if you haven't done so already, you'll want to [create a public GitHub repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository) for this lab (name it something to the effect of 'GEOG-464 Lab-7 *Your Name*'). Upload all your website files (the contents of your lab working directory, or 'Lab-7' folder) to this new repository. Make sure the *index.html* is at the root level, and all other webiste files (.js, .cs, etc.) are within their respective folders. Then, deploy a [public GitHub page](https://docs.github.com/en/pages/quickstart) from this repository, thereby hosting a live, public version of the website you just created using GitHub. We had a brief tutorial of this last week, but look through the docs if you have issues. It may take some time (multiple hours) for the URL to be generated and the page to be deployed publicly. Make sure you're able to access the page (and the web-maps work) using the URL that is generated.

### Deliverables

All answered text questions inside your *index.html* (Q2, Q4, Q5, Q6 - 2 points each) and the two functioning web-maps containing the data, styles, and functionalities according to the modifications made throughout the lab (tilesets, styles, pop-ups, map loading drop-down). Each of these enhancements is graded separately based on completion and functionality (Q1, Q3, Q7, Q8).

Finally, make sure your repo is deployed as a GitHub page, and upload its URL as submission to Moodle. I do not want you to upload the individual website files (*index.html*, etc.), but simply a link to the live, functioning website. In doing so, you have successfully created a publicly-hosted website using completely online (i.e non-local) data, as will likely be the case for your final project!

(18 points total)
