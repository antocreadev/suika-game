import {Engine, Render, Bodies, Composite, Runner, Sleeping} from 'matter-js'

const engine = Engine.create();

// create a renderer
const render = Render.create({
    element: document.body,
    engine: engine,
    options : {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false
    }
});

// create two boxes and a ground
const boxA = Bodies.rectangle(400, 200, 80, 80, { render : { fillStyle : '#2B8' }}); // x, y, width, height
const boxB = Bodies.rectangle(450, 50, 80, 80, { render : { fillStyle : '#ffffff' }});
const fruit = Bodies.circle(450, 100, 80, { restitution : 1}); // restitution : rebond



const ground = Bodies.rectangle(window.innerWidth/2, window.innerHeight, window.innerWidth, 10,  {isStatic: true ,  render : { fillStyle : '#ffffff' }}); // isStatic : objet statique (immobile)

const wallLeft = Bodies.rectangle(0, window.innerHeight/2, 10, window.innerHeight,  {isStatic: true ,  render : { fillStyle : '#ffffff' }});

const wallRight = Bodies.rectangle(window.innerWidth, window.innerHeight/2, 10, window.innerHeight,  {isStatic: true ,  render : { fillStyle : '#ffffff' }});


const fakeFruit = Bodies.circle(window.innerWidth/2, 20, 10, { isSleeping : true, render : { fillStyle : '#932' }});


// // for mouse version 
// window.addEventListener('mousemove', (event) => {
//   console.log("mousemove", event.clientX)
//   // fakeFruit.position.x = event.clientX;
// });

// window.addEventListener('mousedown', (event) => {
//   // remove fake fruit
//   Composite.remove(engine.world, fakeFruit);
//   const currentFruit = Bodies.circle(event.clientX, 20, 10, { isSleeping : true, render : { fillStyle : '#932' }});
//   Composite.add(engine.world, [currentFruit]);
//   Sleeping.set(currentFruit, false);
// });

window.addEventListener('touchmove', function(event) {
  if (event.touches.length > 0) {
      // console.log("touchmove", event.touches[0].clientX)
      fakeFruit.position.x = event.touches[0].clientX;


  }
});

window.addEventListener('touchend', (event) => {
  // console.log("touchend", event.changedTouches[0].clientX)
  // remove fake fruit
  Composite.remove(engine.world, fakeFruit);
  const currentFruit = Bodies.circle(event.changedTouches[0].clientX, 20, 10, { isSleeping : true, render : { fillStyle : '#932' }});
  Composite.add(engine.world, [currentFruit]);
  Sleeping.set(currentFruit, false);
});



// add all of the bodies to the world
Composite.add(engine.world, [ground, wallLeft, wallRight , boxA, boxB , fruit, fakeFruit]);

// run the renderer
Render.run(render);
Runner.run(Runner.create(), engine);