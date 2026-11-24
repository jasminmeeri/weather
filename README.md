# Clouds Away: 5-day weather forecast

I built a 5-day weather forecast app using Axios and Chart.js. It fetches coordinates and 3-hour temperature forecasts in Celcius and lets the user switch between a Line chart and a Bar chart. I also added an API key password field so the key is entered in the browser rather than stored in the code.
For the chosen feature, I added a Show forecast details button using SweetAlert2 that displays the next 3-hour forecast's UTC time and temperature.
In addition, I included the bonus jQuery loading message (#saaYllatys), custom styling in a separate style.css file, and an animated 3D cloud background with Vanta.js.

How I tested it:

Searched for Helsinki and then Tampere, Oulu, Rovaniemi etc. confirming the city title and chart updated each time. Tried also typing cities that are not real or inputs with typos.

Switched between Line and Bar chart types to verify the same timestamps and temperatures appeared in both.

Tested empty input fields and an unknown city (Xyzabc123) to verify clear error messages appeared and the next valid search worked normally.

Clicked Show forecast details both before and after searching to verify the SweetAlert2 popup worked.

Use of AI:

I used Google Gemini as a double-checking tool during this assignment to quickly generate the initial base layout for style.css and to help fine-tune and debug parts of script.js (such as input validation and error handling) I manually reviewed, customized, and tested all code in VS Code and the browser to make sure I understand how it works and that it meets all assignment requirements.
