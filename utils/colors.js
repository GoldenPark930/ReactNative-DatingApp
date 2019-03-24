import config from '../../config';

const { invertColors } = config;

function invert(rgb){
  rgb = Array.prototype.join.call(arguments)
    .match(/(-?[0-9\.]+)/g);
  for(let i = 0; i < rgb.length; i++)
  {
    rgb[i] = (i === 3 ? 1 : 255) - rgb[i];
  }
  return rgb;
}

const colors = {
  atlantis: 'rgb(129,209,53)',
  brightPurple: 'rgba(130,42,254,1)',
  cornFlower: 'rgba(63, 115, 219, 1.00)',
  cornFlower20: 'rgba(63, 115, 219, 0.20)',
  dandelion: 'rgb(255,233,0)',
  dandelion0: 'rgba(255,233,0,0.00)',
  dandelion100: 'rgba(255,233,0,1.00)',
  dark: 'rgb(36,49,56)',
  dark70: 'rgba(36,49,56,.7)',
  dark90: 'rgba(36,49,56,.9)',
  darkGreenBlue: 'rgb(25,105,66)',
  darkGreenBlue40: 'rgba(25, 104, 65, 0.40)',
  darkishPink20: 'rgba(232,73,107,0.20)',
  darkShadow: 'rgba(0,0,0,.45)',
  darkSkyBlue: 'rgb(65,182,225)',
  darkSkyBlue20: 'rgba(65,182,225,0.20)',
  darkPurple: 'rgb(105,57,200)',
  dusk: 'rgb(61,63,96)',
  lavender: 'rgb(179, 152, 232)',
  mandy: 'rgb(232,74,107)',
  mediumPurple: 'rgb(132, 89, 218)',
  mediumPurple20: 'rgba(132,89,218,0.20)',
  mediumPurple70: 'rgba(132,89,218,0.70)',
  offwhite: 'rgba(255,255,255,0.70)',
  outerSpace: 'rgb(44,57,65)',
  outerSpace20: 'rgba(44,57,65,0.2)',
  outerSpace50: 'rgba(44,57,65,0.5)',
  outerSpace70: 'rgba(44,57,65,0.7)',
  outerSpaceAnimate: 'rgba(44,57,65,1.0)',
  rollingStone: 'rgb(120,129,135)',
  sashimi: 'rgba(33,120,77,1)',
  sapphire50: 'rgba(71,36,143,0.50)',
  shuttleGray: 'rgb(86,96,103)',
  shuttleGray20: 'rgba(86,96,103,.20)',
  shuttleGray70: 'rgba(86,96,103,.80)',
  shuttleGrayAnimate: 'rgba(86,96,103,1.0)',
  steelGrey: 'rgba(120,129,135,1.0)',
  steelGrey20: 'rgba(120,129,135,0.20)',
  sushi: 'rgb(66,181,125)',
  transparent: 'rgba(0,0,0,0.0)',
  warmGrey: 'rgb(151,151,151)',
  warmGreyTwo: 'rgb(154, 154, 154)',
  white: 'rgb(255,255,255)',
  white20: 'rgba(255,255,255,0.20)',
  whiteAnimate: 'rgba(255,255,255,1)',
}

const invertedColors = Object.keys(colors).reduce((acc, el, i) => {
  const invertedArray = invert(colors[el]);
  acc[el] = (invertedArray.length == 3 ? `rgb(${invertedArray})` : `rgba(${invertedArray})`);
  return acc
}, {});

export default (invertColors !== true ? colors : invertedColors)
