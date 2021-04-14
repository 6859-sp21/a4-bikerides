# a4-bikerides
<b> About the Data </b><br>
Bluebikes is Metro Boston's public bike share program, with more than 1,800 bikes at over 200 stations across Greater Boston. 
The team was interested in the flow of bikes, or "pulse" of the city, and used the December 2019 data published by Bluebikes.

<b> Design Decisions </b><br>
The team was fundamentally interested in the Bluebikes Data, which reports bikeshare trips around Boston, and see if an <i> urban pulse</i> can be noticed via visualisation. 
We then decided on our final product to be an interactive map-based tool that allows users to click on different variables to explore. Instead of having a very specific question (such as how many students use bluebikes at 12am), we decided to build an interactive tool that allowed people to explore that specificity. Hence, the decision was to map out the total arrivals + departures at each station as the default view, and then adding different things for people to explore. When the user hovers over each station, a tooltip will appear, showing the station name and the exact number of arrivals and departures. 

<b> Rationale for Design Decisions </b><br>
Since the data was spatial in nature, we definitely had to have a mapbase - and started off with that.
The next natural thing was then to map out the stations' location. We used a bubble viz for that as the data was a <i>point</i> data then scaled the bubbles according to size of trips which reflected total number of trips in the day (arriving + leaving the station). We also used the same data as a heatmap which allows visual representation of size of flows around the stations. 
Some nuanced edits included how and what text were included to explain our visualisation. 

<b> Commentary on the development process </b><br>
The team took a while to get used to d3.js as it was new to all of us. Kloe managed to figure out the mapbase, and Kai was most up to speed with picking up d3, and started many of the initial mappings onto the map. Brandon was in charge of the heatmap and the team iteratively made changes/edits as and when and communicated via a personal slack channel. Changes along the way also included making code more efficient, and changing things like colour etc. After we managed to make the MVP work with a list of things we had in mind (mapping stations arrival and departure), we started adding more interactive features that would allow more insights into the data. For example, the slider allows users to explore specific time of the day + specific stations they are interested in. We then added a 'play button' as an alternative for users who wanted an automated map depicting flows. We also added a histogram. <br>

<b> Final design touches </b><br>
Once we were done with what we initially had in mind, we began adding final touches to the visualisation experience. One would be the ability to collapse the white text (on the left using the minus button), so that users can explore more of the map if preferred. We also added "visualisation options" where users can choose which 'layers' (bubble, heatmap or both) as well as the preferred visualisation option (whether the bubbles reflect traffic volume, or just stations). Similiarily, there is the option to visualise traffic volume or traffic flow using colors. Additionally, when each station is clicked upon, a histogram appears, showing the mean length of rides arriving and leaving. Consideration in design: the mouse actually changes from a hand when on a map (indicating the ability to drag around the map) and switches to a click-hand when on a station, inviting the user to click on the station and explore. This informs the user that beyond the tooltip, one can click into the bubble and something more will happen. 

<b> Some interesting things to explore with our visualisation </b>
<li> How does the commuting direction change over the course of a day? </li>
<li> What time do people leave class or work? </li>
<li> Do rush hour trips really take longer? </li>
<li> Where do students go at 3am? </li><br>

<b> Using our visualisation </b><br>
Pan and zoom around the map to explore. Bike stations are represented with bubbles. Click on a station to view all the traffic originating or terminating at the selected station, and its relationship with other stations. Drag the slider on the top right to move across different times of day (or use the play button to advance automatically). Finally, use the visualization options on the right for more advanced customizations.

<b> Data Source + Time taken developing visualisation </b><br>
The team took an estimated of 10 hours/person working on this project. One hurdle was understanding how maps and projections worked, and much time was spent fixing code bugs.


<b> Reference Code Source/Inspiration (Also credited in Code base) </b><br>
Slider: https://bl.ocks.org/johnwalley/e1d256b81e51da68f7feb632a53c3518<br>
Heatmap/Timeslice: https://observablehq.com/@mbostock/u-s-airports-voronoi <br>
Source for BlueBikes data: https://www.bluebikes.com/system-data




