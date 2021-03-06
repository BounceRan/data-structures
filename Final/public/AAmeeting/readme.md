# AA meeting agenda for Manhattan geo map

AA meeting agenda for Manhattan geo map is a project with many steps. The AA meeting data is scraped, captured and cleaned from the website by using cheerio.js. In order to create a map-based visualization, after getting all the address from each meeting,  a geo map API is used to return all the latitude and longitude info.  The whole dataset contains more than 1200 records which are stored in an AWS PostgreSQL database. The frontend is powered by a node.js server. The map is using the Leaflet library and the map skin is designed in Map Box. 

----

## Design Aspect:
The initial map will return today's AA agenda. The user can click mark to find out the meeting details information according to the location.  The user can also use the find out button to select and check out the day they are interested to go for a meeting. Because of the limited time and security reason, I end up using the button list to query the database rather than a search input function. 

![AA doc](https://github.com/BounceRan/data-structures/blob/master/Final/public/AAmeeting/aadocumentation.jpg)