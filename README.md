# Bloom: Smart Plant Pot Interface

**Links:** [Live Application](https://bloom-smart-planter.vercel.app/) | [Source Code (GitHub)](https://github.com/isaac-dowdy/bloom-smart-planter)

---

## Project Overview

This project is a concept design for the interfaces of a smart plant pot. The purpose of the smart plant pot is to assist users in identifying and meeting plant care needs. To accomplish this, this design includes two interfaces that would sit embedded in the plant pot itself to show users at-a-glance information on plant care needs. A third interface is designed for a mobile device to allow users to view all of their plant needs in one location as well as a further level of control over each plant they own.

## Design Process

The design process for this project was broken into three parts: pre-design, ideation, and choosing a final design.

### Pre-Design

Before beginning to sketch out an interface, my first steps were to understand the physical properties of the object I had chosen, understand the potential users for my smart object, state my assumptions about the technical capabilities of my object, and put together a final list of user needs and design requirements.

#### Characterizing the Object

The affordances and physical properties that I identified for a plant pot are as follows:

* Affords holding, supporting, or storing items inside. Specifically holding soil, a plant, and its root structure.
  * The plant pot is open at the top, allowing a plant room to grow and room for the user to water the plant.
* Some pots allow for soil to drain excess water with drainage holes or trays
* Affords easy carrying and lifting.
  * House plant pots are small and portable.
  * Some plant pots have a rim at the top to help carry.

#### Needs Gathering

To better understand how people feel about caring for houseplants, what their plant care routines look like, and any difficulties they have while caring for plants, I put together some questions for an interview plan.

* What kinds of house plants do you currently have?
  * If none, what barriers have kept you from owning house plants?

* What do you enjoy most about caring for plants?

* Walk me through how you take care of your plants.
  * How do you know when to water your plants?
  * Do you use any tools to keep track?
  * What are your opinions on those kinds of virtual tools?

* What does a "healthy plant" mean to you?

* What are the biggest challenges you face when caring for plants?
  * Have you ever had a plant die or become unhealthy? What happened?
  * What do you wish was easier about keeping plants healthy?

* What do you look for when purchasing plant pots?

With these questions, I picked three friends to interview. I made an effort to ask different kinds of people to get a wide range of answers that might best represent the general public. 

The first friend I interviewed owns a couple of house plants, but prefers low-maintenance plants because she can sometimes leave her plants for long periods without water. Here are some of her most helpful responses:

* **Walk me through how you take care of your plants**
  * Visual inspection, if the soil looks dry or leaves wilt, water them usually once every two weeks
* **What are your opinions on virtual tools to help keep track of plant needs?**
  * Overkill for current setup, but would use one if had plants to water more often
* **Have you ever had a plant die or become unhealthy? What happened?**
  * Gone too long without watering it


The second interviewee loves taking care of plants, owns over 25, and has a very well-defined process. Some helpful responses:

* **What do you enjoy most about caring for plants?**
  * Enjoys caring for things well. Seeing her plants grow is a validating experience.
* **How do you know when to water your plants?**
  * Moisture meter.
* **What does a "healthy plant" mean to you?**
  * Humidity, Sunlight, Water, Type of Soil.
* **Have you ever had a plant become unhealthy or die? What happened?**
  * Almost always root rot from overwatering, and too far or too close to the window so they didn't get the right amount of sunlight.



The third and final person I interviewed has cared for plants in the past, but doesn't anymore because he worries about the time commitment and forgetting to care for them. His helpful responses:

* **What are the barriers that keep you from owning house plants?**
  * One more thing on my plate, time commitment. Worry about killing plants because forgetting to water them, putting them in the wrong place or not enough sunlight.


#### Assumptions

After the above interviews, I had a good idea of the technical capabilities I wanted my smart plant pot to have:
* The smart plant pot can sense the water/moisture level of the soil
* The smart plant pot can sense the amount of sunlight received by its plant
* The smart plant pot can sense the temperature of the room
* When any of these three factors change, the smart plant pot will detect the change in real time

#### User Needs & Design Requirements

Finally, I compiled a list of user needs and design requirements from the needs gathering I completed. 

##### User Needs

* User needs to be able to track these needs to better understand the health of their plant:
  * moisture of the soil
  * sunlight received by the plant
  * temperature of the room
* User needs to be reminded when to care for their plant
* User needs to see historical data on when they cared for their plant last


##### Design Requirements

* Plant pot must display at-a-glance moisture, sunlight, and temperature information
* Plant pot must have systems for selecting the upper and lower bounds for each care need
* Companion phone app must show information about all plants and send care reminders/alerts

### Sketching and Ideation

With the pre-design work finished, I moved on to sketching and ideation. To start, I made three 10-plus-10 sketches for different design challenges: how to display at-a-glance plant care data, how to show all plants together in the mobile app, and how to display historical care data.


#### At-a-Glance Plant Needs

For the main pot interface, I explored several approaches to visualize plant care status at a glance. The primary challenge was presenting three distinct metrics (moisture, sunlight, and temperature) in a clear, accessible way on a small touchscreen. Early sketches focused on circular gauges, linear progress bars, indicator lights, as well as some other creative methods like quotes, emojis, and icons. My favorite approach was the line bar, so I spent more time iterating on it in my last round of sketches. 

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
<img src="assets/media/bloom/plant-care-10plus10.jpg" alt="Plant care sketches 1" style="width: 100%; border-radius: 4px;">
<img src="assets/media/bloom/plant-care-10plus10-2.jpg" alt="Plant care sketches 2" style="width: 100%; border-radius: 4px;">
<img src="assets/media/bloom/plant-care-10plus10-3.jpg" alt="Plant care sketches 3" style="width: 100%; border-radius: 4px;">
<img src="assets/media/bloom/plant-care-10plus10-4.jpg" alt="Plant care sketches 4" style="width: 100%; border-radius: 4px;">
</div>



#### Mobile App

The mobile app designs explored how to present information for multiple plants simultaneously. Key considerations included plant identification, quick status assessment (which plants need attention), and efficient navigation. Sketches ranged from grid layouts to scrollable lists. The list-based approach was ultimately selected because it shows more plant details per item, allows enough space, and pairs naturally with mobile scrolling interactions.

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
<img src="assets/media/bloom/secondary-10plus10.jpg" alt="Mobile app sketches 1" style="width: 100%; border-radius: 4px;">
<img src="assets/media/bloom/secondary-10plus10-2.jpg" alt="Mobile app sketches 2" style="width: 100%; border-radius: 4px;">
</div>

#### Historical Care Data

For historical visualization, I sketched a couple options for displaying trends over time, including line graphs, number cards, and adding details onto the care bars. The final design uses a simple line graph showing the last 48 hours of data alongside min/max/average statistics, providing users with both visual trend information and concrete data points to help them understand their plant's needs over time.

<div style="margin: 20px 0;">
<img src="assets/media/bloom/history-10plus10.jpg" alt="Historical data visualization sketches" style="width: 50%; border-radius: 4px;">
</div>


### The Final Design

After iterating over these three design challenges and gathering some feedback, I narrowed down to a vanilla UI sketch as well as a hybrid sketch, pictured below.

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
<img src="assets/media/bloom/vanilla.jpg" alt="Vanilla Main UI" style="width: 100%; border-radius: 4px;">
<img src="assets/media/bloom/secondary-vanilla.jpg" alt="Vanilla Secondary UI" style="width: 100%; border-radius: 4px;">
<img src="assets/media/bloom/hybrid.jpg" alt="Hybrid Design" style="width: 100%; border-radius: 4px;">
</div>


## The Interface

The complete interface design contains three sections: the mobile app, the pot rim interface, and the main pot interface. Below are the implemented interfaces showcasing the final design.

<div style="display: grid; grid-template-columns: 1fr; gap: 15px; margin: 20px 0;">
<img src="assets/media/bloom/interface.png" alt="Complete interface overview" style="width: 100%; border-radius: 4px;">
</div>

### Main Pot Interface

The main pot interface consists of three plant care bars for water level, sunlight, and temperature. Each care bar displays the lower and upper bounds for acceptable ranges, with the current value indicated on the bar. When one of the plant's needs falls outside of its acceptable range, the associated care bar darkens in color to alert the user that attention is required. For this prototype, the main pot UI includes a toast notification at the bottom right corner to display which plant's information is currently being shown, since the small embedded screen can only display one plant's data at a time. Selecting a plant in the mobile app updates the pot interface to show that plant's data.

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
<img src="assets/media/bloom/main-expanded.png" alt="Main pot interface expanded view" style="width: 100%; border-radius: 4px;">
<img src="assets/media/bloom/main-needs-attention.png" alt="Main pot interface with needs attention alert" style="width: 100%; border-radius: 4px;">
</div>

Clicking on one of the plant care bars expands it to display more detailed information. The expanded view shows a 48-hour historical graph of that specific care metric, along with minimum, maximum, and average values calculated over that period. Two sliders in this expanded view allow users to adjust the upper and lower bounds for each plant care need. I kept the pot interface simplistic and focused on visualization rather than complex controls, since it would be embedded as a small touchscreen with limited interaction space.

### Pot Rim Interface

The pot rim interface displays the current date and time, along with alert icons that notify the user whenever any plant care metric falls outside of acceptable ranges. This always-visible notification system ensures users are made aware of plant care needs even when not actively viewing the main pot screen.

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
<img src="assets/media/bloom/lip.png" alt="Pot rim interface" style="width: 100%; border-radius: 4px;">
<img src="assets/media/bloom/lip-needs-attention.png" alt="Pot rim interface with needs attention" style="width: 100%; border-radius: 4px;">
</div>

### Mobile App

The home screen of the mobile app displays a scrollable list of all plants associated with the smart plant pot system. Each plant card shows the plant's name, location, current numeric values for each care metric, the date of last watering, and a status indicator light showing whether the plant requires immediate attention. A button at the bottom of the screen allows users to add a new plant to their collection.

<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px; margin: 20px 0;">
<img src="assets/media/bloom/companion.png" alt="Companion mobile app" style="width: 100%; border-radius: 4px;">
<img src="assets/media/bloom/companion-plant-view.png" alt="Companion app plant list view" style="width: 100%; border-radius: 4px;">
<img src="assets/media/bloom/companion-new-plant-view.png" alt="Companion app add new plant view" style="width: 100%; border-radius: 4px;">
</div>

Tapping on a plant card expands it to reveal a detailed editing view where users can modify the plant's name, location, and the upper and lower bounds for each care metric. Because mobile phones offer richer input methods such as keyboards and numeric pads, this interface provides much more granular control and precise value adjustment than the limited pot screen interface. Users can also delete a plant from their collection using this screen.

The header of the interface includes manual controls to adjust the simulated values for the three plant care metrics, allowing users to test different scenarios. There's also a button to simulate a full day's passage, which shows how plant data evolves over time and demonstrates how status indicators and reminder notifications respond to changing conditions.

<div style="display: grid; grid-template-columns: 1fr; gap: 15px; margin: 20px 0;">
<img src="assets/media/bloom/header.png" alt="Interface header with controls" style="width: 100%; border-radius: 4px;">
</div>


## The Implementation

### Tech Stack

This project was built using **Svelte** for the reactive component framework, **JavaScript** for application logic and interactivity, and **CSS** for styling.

### Architecture

#### `bloom/src`

The root source directory contains the primary application structure. `App.svelte` is the main component that defines the overall page layout and orchestrates the different interface sections. Additional files in this directory include `main.js` for application initialization and `global.css` for shared styling applied across all components.


#### `bloom/src/lib`

This directory houses reusable JavaScript utilities and modules that power the application logic. It includes functions for managing plant data structures, simulating sensor readings, calculating and formatting display values, and handling time simulation features. These modules are imported and used across multiple components to keep the code DRY and maintainable.


#### `bloom/src/components`

The components directory contains Svelte component files for the major interface sections: the mobile phone app and the dual pot display interfaces (main screen and rim). Each component is self-contained and manages its own state and rendering logic.


## Future Work

One feature I didn't implement in this prototype was a comprehensive reminder and notification system. The current design shows alerts on the device itself, but a more robust solution would include a settings page within the mobile app that allows users to configure notification preferences. Such a system could integrate with the operating system's native notification capabilities to send alerts to users' phones via push notifications, SMS, or email when plant care is needed. This would ensure users are notified even when they're not actively viewing the app, making it easier to respond to plant needs promptly.

Additional future improvements could include:
- **Data persistence**: Storing historical plant data in a cloud database to track long-term plant health trends
- **Advanced analytics**: Providing insights and recommendations based on plant care patterns
- **Multiple device syncing**: Allowing users to control multiple smart pots and view all their plants across several devices
- **Integration with weather data**: Adjusting watering recommendations based on seasonal changes and local weather conditions
- **Community features**: Sharing plant care tips and experiences with other plant enthusiasts

## AI Usage

I used AI tools throughout the development of this project to accelerate the coding process. **GitHub Copilot** in Visual Studio Code provided inline code suggestions and autocomplete functionality, which proved particularly effective at predicting what I intended to type next based on existing code patterns. This significantly reduced manual typing and helped maintain consistency. I also used Copilot's chat feature to troubleshoot bugs, understand error messages, and translate my own design concepts into Svelte and JavaScript implementations. While AI tools were instrumental in speeding up development, all design decisions were made independently, and the final implementation reflects my own vision.