import { Engine, Render, Bodies, Composite, Runner, Sleeping } from "matter-js";
import { FRUITS } from "./Fruits";

// --- Constants
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const DELAY = 1000;
const HEIGHT_DROP = 65
const RESTITUTION = 0.35

// --- Create Engine
const engine = Engine.create();

// --- Create Render
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: WIDTH,
    height: HEIGHT,
    wireframes: false,
  },
});
// --- Functions 
// - get random fruit
const randomFruit = () => {
  // const IndexRandom = Math.floor(Math.random() * FRUITS.length);
  const IndexRandom = Math.floor(Math.random() * 5); // 5 firts
  return FRUITS[IndexRandom];
};

// --- Items
// - static items
const ground = Bodies.rectangle(WIDTH / 2, HEIGHT, WIDTH, 30, {
  isStatic: true,
  render: { fillStyle: "#ffffff" },
  label: "ground",
}); // isStatic : objet statique (immobile)
const wallLeft = Bodies.rectangle(0, HEIGHT / 2, 10, HEIGHT, {
  isStatic: true,
  render: { fillStyle: "#ffffff" },
  label: "wallLeft",
});
const wallRight = Bodies.rectangle(WIDTH, HEIGHT / 2, 10, HEIGHT, {
  isStatic: true,
  render: { fillStyle: "#ffffff" },
  label: "wallRight",
});
// - items
// - generate fruit
const randomFakeFruit = randomFruit()
const fakeFruit = Bodies.circle(WIDTH / 2, HEIGHT_DROP, randomFakeFruit.radius, {
  isSleeping: true,
  render: { fillStyle: randomFakeFruit.color },
  label: randomFakeFruit.label,
});

// --- Functions for gameplay
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

// - Move fake fruit
const moveFakeFruit = () => {
  window.addEventListener("touchmove", function (event) {
    // - move fakefruit
    if (event.touches.length > 0) {
      const posX = event.touches[0].clientX;
      // - debug
      // console.log("touchmove", posX)
      // console.log("touchmove", engine.world.bodies)

      // if fruit is out of range game
      if (fakeFruit) {
        fakeFruit.position.x = posX;
      }
    }
  });
};

// - drop fruit and reload
let drop = true;
const dropFruit = () => {
  window.addEventListener("touchend", (event) => {
    // - debug
    // console.log("touchend", event.changedTouches[0].clientX)
    // console.log("touchend", engine.world.bodies)

    // - remove fake fruit
    if (event.changedTouches.length > 0) {
      // - update position fakefruit & get position x
      fakeFruit.position.x = event.changedTouches[0].clientX;
      console.log(engine.world.bodies)
      // - if fakeFruit
      if (drop) {
        drop=false
        // - create current fruit with data fakeFruit
        const currentFruit = Bodies.circle(
          event.changedTouches[0].clientX,
          HEIGHT_DROP,
          fakeFruit.circleRadius ,
          {
            restitution: RESTITUTION,
            render: { fillStyle: fakeFruit.render.fillStyle },
            label : fakeFruit.label
          }
        );
        // - Generate other data for next fruit
        const GeneratedFakeFruit = randomFruit()
        // - change data in fakefruit 
        fakeFruit.render.fillStyle = GeneratedFakeFruit.color
        fakeFruit.label = GeneratedFakeFruit.label
        fakeFruit.circleRadius = GeneratedFakeFruit.radius
        // - play fruit (add in world)
        Composite.add(engine.world, [currentFruit]);
        // - remove fakeFruit
        Composite.remove(engine.world, fakeFruit);

        // - add fakeFruit after 1s
        setTimeout(() => {
          Composite.add(engine.world, [fakeFruit]);
          drop = true;
        }, DELAY);
      }
      drop = false;
    }
  });
};

// - Mecanisme game
const addCurrentFruit = (x) => {
  moveFakeFruit();
  dropFruit();
};
addCurrentFruit();

// --- Add items in the word
Composite.add(engine.world, [ground, wallLeft, wallRight, fakeFruit]);

// --- Render the world
Render.run(render);
Runner.run(Runner.create(), engine);
