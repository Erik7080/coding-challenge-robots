import {
  generateGrid,
  fetchRobotsInstructions,
  translateDegrees,
  translateOrientation,
  setRobotsInitialPosition,
  executeMovements,
  generateSetOfCommands,
  moveRobotsAroundBoard
} from './logic'

describe('generateGrid', () => {

  test('Grid is created successfully', () => {
    const grid = { columns: 2, rows: 2 };
    expect(generateGrid(["2 2"])).toEqual(grid)
  })
})


describe('fetchRobotsInstructions', () => {

  test('Position and commands are divided correctly', () => {
    const lines = ["2 2", "", "2 2 N", "RFLF", "", "2 2 N", "RFLF"]
    const robotInformation = [
      { initialPosition: "2 2 N", movements: "RFLF" },
      { initialPosition: "2 2 N", movements: "RFLF" }
    ]
    expect(fetchRobotsInstructions(lines)).toEqual(robotInformation)
  })

})


describe('setRobotsInitialPosition', () => {

  test('Position of the robot is set correctly', () => {
    const robotsInstructions = [{ initialPosition: "1 1 n", movements: "F" }];
    const robotsPosition = [{ positionX: 1, positionY: 1, orientation: "N" }];
    expect(setRobotsInitialPosition(robotsInstructions)).toEqual(robotsPosition)
  })

})


describe('moveRobotsAroundBoard', () => {

  const grid = { columns: 3, rows: 3 };

  const robotsPosition1 = [{ positionX: 1, positionY: 1, orientation: "N" }];
  const robotsInstructions1 = [{ initialPosition: "1 1 n", movements: "F" }]
  const finalPosition1 = [{ positionX: 1, positionY: 2, orientation: "N" }];

  const robotsPosition2 = [{ positionX: 1, positionY: 1, orientation: "N" }];
  const robotsInstructions2 = [{ initialPosition: "1 1 n", movements: "RFLFRFF" }]
  const finalPosition2 = [{ positionX: 4, positionY: 2, orientation: "E", fallen: true }];

  const robotsPosition3 = [{ positionX: 1, positionY: 1, orientation: "N" }, { positionX: 1, positionY: 1, orientation: "N" }];
  const robotsInstructions3 = [{ initialPosition: "1 1 n", movements: "RFLFRFF" }, { initialPosition: "1 1 n", movements: "RFLFRFF" }]
  const finalPosition3 = [{ positionX: 4, positionY: 2, orientation: "E", fallen: true }, { positionX: 3, positionY: 2, orientation: "E" }];

  const robotsPosition4 = [{ positionX: 2, positionY: 2, orientation: "N" }];
  const robotsInstructions4 = [{ initialPosition: "2 2 n", movements: "RFRFRFRF" }];
  const finalPosition4 = [{ positionX: 2, positionY: 2, orientation: "N" }];

  test('Robots has been moved correctly', () => {
    expect(moveRobotsAroundBoard(grid, robotsPosition1, robotsInstructions1)).toEqual(finalPosition1)
  })

  test('Robots has fallen correctly', () => {
    expect(moveRobotsAroundBoard(grid, robotsPosition2, robotsInstructions2)).toEqual(finalPosition2)
  })

  test('Move 2 - Second robot does not fall', () => {
    expect(moveRobotsAroundBoard(grid, robotsPosition3, robotsInstructions3)).toEqual(finalPosition3)
  })

  test('Move robot in all position', () => {
    expect(moveRobotsAroundBoard(grid, robotsPosition4, robotsInstructions4)).toEqual(finalPosition4)
  })

})


describe('translateOrientation & translateDegrees', () => {

  test('North is converted', () => { expect(translateOrientation("N")).toEqual(0) })
  test('East is converted', () => { expect(translateOrientation("E")).toEqual(90) })
  test('South is converted', () => { expect(translateOrientation("S")).toEqual(180) })
  test('West is converted', () => { expect(translateOrientation("W")).toEqual(270) })

  test('North is translated', () => { expect(translateDegrees(0)).toEqual("N") })
  test('North is translated from 360', () => { expect(translateDegrees(360)).toEqual("N") })
  test('East is translated', () => { expect(translateDegrees(90)).toEqual("E") })
  test('East is translated from negative', () => { expect(translateDegrees(-270)).toEqual("E") })
  test('South is translated', () => { expect(translateDegrees(180)).toEqual("S") })
  test('South is translated from negative', () => { expect(translateDegrees(-180)).toEqual("S") })
  test('West is translated', () => { expect(translateDegrees(270)).toEqual("W") })
  test('West is translated from negative', () => { expect(translateDegrees(-90)).toEqual("W") })

})