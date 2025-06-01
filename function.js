//A user enters the website and finds a list of the names, 
// dates, times, locations, and descriptions of all the parties that are happening.
//Next to each party in the list is a delete button. 
// The user clicks the delete button for one of the parties. 
// That party is then removed from the list.
///There is also a form that allows the user to enter information...
// about a new party that they want to schedule. After filling out the form and submitting it,..
//  the user observes their party added to the list of parties.

///// Create a header element and append it to the root. JUST FOR KICKSSS
const h1 = document.createElement('h1');
h1.innerHTML = 'PARTY PLANNER';

const root = document.getElementById('#root');
if (root) {
  root.append(h1);
}
console.log(h1); 

//// API URL
const COHORT = "2503-FTB-ET-WEB-AM";
 
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;
/////////////
// State object to hold the events.
const state ={
events:[],


}
 
 

// 1. created Mock of Events
const events2 = [
  {
    id: 1,
    name: 'Birthday Bash',
    date: '2023-10-01',
    location: '123 Party St',
    description: 'A fun birthday party!'
  },
  {
    id: 2,
    name: 'Halloween Spooktacular',
    date: '2023-10-31',
    location: '456 Ghost Ave',
    description: 'A spooky Halloween party!'
  },
  {
    id: 3,
    name: 'New Year Celebration',
    date: '2023-12-31',
    location: '789 Celebration Blvd',
    description: 'Ring in the new year with style!'
  }
  
];

 //use fetch to get all Events from API
const getAllEvents = async () => {
    try {
      const response = await fetch(API_URL);
      // console.log(response)

      //using {    } the data is being deconstructed from the .json() body
      const { data } = await response.json()
      //const data = await response.json()//
      console.log(data);

      //stores fetched data to our state of events
      state.events = data;
      renderEvents();

    } catch (error) {
        console.log(error.message)
    }
}
const getSingleEvent = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`)
        const { data } = await response.json()
        console.log(data)

        state.events.push(data)

        console.log(state.events)

        renderEvents()
    } catch (error) {
        console.log(error.message)
    }
}
const createEvent = async (eventE) => {
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      //data: field had to be hard coded for the specific date
    //   const testData = {
    //     name: eventE.name,
    //     description: eventE.description,
    //     date: "2021-09-15T00:00:00.000Z",
    //     location: eventE.location,
    //   };
      const testData = {...eventE, date: "2021-09-15T00:00:00.000Z",} 

      //fetches data using POST with body
      const response = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify(testData),
        headers: myHeaders,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.text();
      console.log("logged repsonse error: " + responseData);

      getAllEvents();
    } catch (error) {
        console.log(error.message)
    }
}

function addEventListenerToForm() {
    const form = document.querySelector("#new-event-form");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        //console.log("submit works");

        const name = document.getElementById("eventName").value;
        const date = document.getElementById('date').value
        const location = document.getElementById('location').value
        const description = document.getElementById('description').value
        //console.log(name);

        const eventE = {
            name,
            description,
            date,
            location
        }
        // console.log(eventE)

        try {
            await createEvent(eventE)
        } catch (error) {
            console.log(error.message)
        }

        form.reset()

        // Do not push eventE to state.events here, as getAllEvents will update the state

        // No need to call renderEvents here, as getAllEvents will do it after fetching
    });
}

function renderEvents() {
    //grabs the div element and clears all cards before re-render later
    const gridElem = document.querySelector('.event-grid')
    gridElem.innerHTML = "";            //clears first

    state.events.forEach((eventE) => {
        //creates the div to act as 'container' to hold 1 card event
        const cardContainerElem = document.createElement("div")
        cardContainerElem.classList.add("card-event-container")
        cardContainerElem.classList.add(`js-card-event-container-${eventE.id}`)
        // console.log(cardContainerElem)

        //template for each card event
        const eventCardHTML = `
                <img src="./images/party.jpeg">
                <div class="event-details">
                    <span>Event Name: ${eventE.name}</span>
                    <span>Date: ${eventE.date}</span>
                    <span>Location: ${eventE.location}</span>
                    <span>Description: ${eventE.description}</span>
                </div>
                <div class="div-delete-button">
                    <button class="js-delete-button" data-event-id="${eventE.id}">DELETE</button>
                </div>
        `;
        cardContainerElem.innerHTML = eventCardHTML     //insert the card template in the div 'cardContainerElem'
        // console.log(cardContainerElem)

        gridElem.appendChild(cardContainerElem)     //DOM manipulation to render all cards
        // console.log(gridElem)

        // Add event listener to the delete button for this card only
        const delButton = cardContainerElem.querySelector(".js-delete-button");
        if (delButton) {
          delButton.addEventListener("click", () => {
            const eventid = delButton.dataset.eventId;
            removeEvent(eventid);       
          });
        }
    });
}

//update the state of events
const removeEvent = async (id) => {
//   id = Number(id);
//   console.log(typeof id);
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      console.log("HTTP Error: " + response.status);
      return;
    }

    getAllEvents()

  } catch (error) {
    console.log(error.message);
  }

  
}

function init() {
    getAllEvents()
    // getSingleEvent(9373)            
    // renderEvents()
    addEventListenerToForm();
}

init()