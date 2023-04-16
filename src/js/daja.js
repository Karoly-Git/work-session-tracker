export let data = [
  {
    id: 1,
    workerName: "Carl",
    pin: "ccc",
    status: "absence",
    dressing: [],
    cleaning: [],
    otherTask: [],
    absence: [],
  },
  {
    id: 2,
    workerName: "Artur",
    pin: "aaa",
    status: "absence",
    dressing: [],
    cleaning: [],
    otherTask: [],
    absence: [],
  },
  {
    id: 3,
    workerName: "Daniel",
    pin: "ddd",
    status: "absence",
    dressing: [],
    cleaning: [],
    otherTask: [],
    absence: [],
  }
];

/*
let select = document.querySelector(".dressers");
let input = document.querySelector("input");
let startBtn = document.querySelector(".start-btn");
 
(function loadWorkersIn(workersList) {
  workersList.forEach((worker) => {
    select.innerHTML += `<option value="${worker.workerName}">${worker.workerName}</option>`;
  });
})(dressers);
 
startBtn.addEventListener("click", (e) => {
  e.preventDefault();
});
 
startBtn.addEventListener("click", () => {
  let timeAtClick = new Date();
  let selectedName = select.value;
  let givenPin = input.value;
  let userPin = dressers.filter((x) => x.workerName === selectedName)[0].id;
  let match = userPin === givenPin;
  if (!match) {
    window.alert("Wrong USER or PIN");
  } else {
    window.confirm("Would you like to START ?");
  }
});
*/
