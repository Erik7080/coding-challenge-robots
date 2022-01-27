function executeCommands() {
  initializeOutputTextArea();

  const lines = divideCommandSet();
  const isInputInvalid = checkInputValidity(lines);
  if (isInputInvalid) {
    document.getElementById("errorMessage").style.display = "block";
    throw new Error("Your commands are wrong - please retry");
  }

  const grid = generateGrid(lines);
  const robotsInstructions = fetchRobotsInstructions(lines);
  const robotsPosition = setRobotsInitialPosition(robotsInstructions);
  const finalRobotsPosition = moveRobotsAroundBoard(grid, robotsPosition, robotsInstructions);

  printFinalPosition(finalRobotsPosition);
}


function initializeOutputTextArea() {
  document.getElementById("outputTextarea").value = null;
  document.getElementById("errorMessage").style.display = "none";
}

function divideCommandSet() {
  const fullCommandSet = document.getElementById("commandTextarea").value;
  return fullCommandSet.split('\n');
}

export function generateGrid(lines) {
  let grid = {};
  let gridDimension = lines[0].split(" ");
  if (gridDimension[0] > 50 || gridDimension[1] > 50 || gridDimension[1] == null) {
    document.getElementById("errorMessage").style.display = "block";
    throw new Error("The dimension of your table is wrong - please retry");
  } else {
    grid.columns = Number(gridDimension[0]);
    grid.rows = Number(gridDimension[1]);
    return grid;
  }
}

export function fetchRobotsInstructions(lines) {
  const robotsInstructions = [];

  for (let i = 2; i < lines.length - 1; i++) {
    if (lines[i] === '') {
      continue;
    }
    const robot = {};
    robot.initialPosition = lines[i];
    robot.movements = lines[i + 1].toUpperCase();
    robotsInstructions.push(robot);
    i++;
  }
  return robotsInstructions;
}

export function setRobotsInitialPosition(robotsInstructions) {
  let index = 0;
  let robotsPosition = [];
  while (index < robotsInstructions.length) {
    const positionDetails = robotsInstructions[index].initialPosition.split(' ');
    const robotPosition = {};
    robotPosition.positionX = Number(positionDetails[0]);
    robotPosition.positionY = Number(positionDetails[1]);
    robotPosition.orientation = positionDetails[2].toUpperCase();
    robotsPosition.push(robotPosition)
    index++;
  }
  return robotsPosition;
}

export function moveRobotsAroundBoard(grid, robotsPosition, robotsInstructions) {
  let index = 0;
  let finalRobotsPosition;

  while (index < robotsPosition.length) {
    const movementsArray = generateSetOfCommands(robotsInstructions[index].movements);
    console.log("I will execute: " + movementsArray);
    finalRobotsPosition = executeMovements(grid, robotsPosition, movementsArray, index);
    console.log(robotsPosition);
    index++;
  }
  return finalRobotsPosition;
}

function executeMovements(grid, robotsPosition, movementsArray, robotIndex) {
  let index = 0;
  let degrees;
  let temporaryRobot = { ...(robotsPosition[robotIndex]) };
  console.log(temporaryRobot);

  while (index < movementsArray.length) {
    switch (movementsArray[index]) {
      case 'R':
        degrees = translateOrientation(temporaryRobot.orientation) + 90;
        temporaryRobot.orientation = translateDegrees(degrees);
        break;
      case 'L':
        degrees = translateOrientation(temporaryRobot.orientation) - 90;
        temporaryRobot.orientation = translateDegrees(degrees);
        break;
      case 'F':
        switch (temporaryRobot.orientation) {
          case 'N':
            temporaryRobot.positionY += 1;
            break;
          case 'S':
            temporaryRobot.positionY -= 1;
            break;
          case 'E':
            temporaryRobot.positionX += 1;
            break;
          case 'W':
            temporaryRobot.positionX -= 1;
            break;
          default:
            break;
        }

        break;
    }
    console.log(temporaryRobot);

    if (isGoingToFall(robotsPosition, temporaryRobot)) {
      break;
    }
    else {
      if (isRobotFallen(grid, temporaryRobot)) {
        temporaryRobot.fallen = true;
      }

      robotsPosition[robotIndex] = { ...(temporaryRobot) };
    }

    index++;
  }
  return robotsPosition;
}

function isGoingToFall(robotsPosition, temporaryRobot) {
  for (let index = 0; index < robotsPosition.length; index++) {
    if (!robotsPosition[index].fallen) {
      continue;
    }
    if (temporaryRobot.positionX === robotsPosition[index].positionX && temporaryRobot.positionY === robotsPosition[index].positionY) {
      return true;
    }
  }

  return false;
}

function isRobotFallen(grid, robot) {
  return robot.positionY > grid.rows || robot.positionX > grid.columns;
}


function printFinalPosition(robotsPosition) {
  let i = 0;
  const outputTextArea = document.getElementById("outputTextarea");
  while (i < robotsPosition.length) {
    const robotFinalPosition = `${robotsPosition[i].positionX} ${robotsPosition[i].positionY} ${robotsPosition[i].orientation} ${robotsPosition[i].fallen ? 'LOST' : ''}`;
    outputTextArea.value += robotFinalPosition + "\n";
    i++
  }
}

export function translateOrientation(orientation) {
  switch (orientation) {
    case "N":
      return 0;
    case "E":
      return 90;
    case "S":
      return 180;
    case "W":
      return 270;
    default:
      break;
  }
}

export function translateDegrees(degrees) {
  if (degrees < 0) {
    degrees = degrees + 360;
  }
  if (degrees == 360) {
    degrees = 0;
  }
  switch (degrees) {
    case 0:
      return "N";
    case 90:
      return "E";
    case 180:
      return "S";
    case 270:
      return "W";
    default:
      break;
  }
}

function checkInputValidity(lines) {
  let isInputInvalid;
  if (lines.length < 4) {
    isInputInvalid = true;
  } else {
    for (let i = 0; i < lines.length; i++) {
      isInputInvalid = lines[i].length > 100 ? true : false;
    }
  }
  return isInputInvalid;
}

function generateSetOfCommands(stringOfCommands) {
  return Array.from(stringOfCommands);
}

function resetObjects() {
  grid = {};
  robotsPosition = [];
}


// module.exports = {
  // generateGrid,
  // fetchRobotsInstructions,
  // translateDegrees,
  // translateOrientation,
  // setRobotsInitialPosition,
  // executeMovements,
  // generateSetOfCommands,
  // moveRobotsAroundBoard
// };