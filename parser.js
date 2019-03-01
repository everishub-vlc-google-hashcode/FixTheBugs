const fs = require('fs');

const _ = require('underscore');

let slides = [];
let verticalPhotos = [];
let magicArray = [];
let finalSlides = [];
let N = 0;
let map = {};
let data = [];

const addVerticalSlides = (p1, p2) => {
  const newSlide = { ID: `${p1.ID} ${p2.ID}`, tags: _.union(p1.tags, p2.tags) };
  slides.push(newSlide);
}

const addHorizontalSlides = (photo1) => {
  slides.push(photo1);
}

const createMagicArray = () => {
  for (i = 0; i < verticalPhotos.length; i++) {
    magicArray[i] = [];
    for (j = i + 1; j < verticalPhotos.length; j++) {
      const totalTags = _.union(verticalPhotos[i].tags, verticalPhotos[j].tags)
      if (totalTags.length < 7) {
        magicArray[i][j] = totalTags;
      }
    }
  }
}

const createVerticalSlides = () => {
  for (i = 0; i < verticalPhotos.length; i++) {
    if (verticalPhotos[i] && verticalPhotos[i+1]) {
      addVerticalSlides(verticalPhotos[i], verticalPhotos[i + 1]);
    }
    i += 2;
  }
}

const valuation = (slide1, slide2) => {
  const common = _.intersection(slide1.tags, slide2.tags).length;

  return Math.min(common, slide1.tags.length - common, slide2.tags.length - common);
};
const result=[];
const joinSlides = () => {
  
  let totalPoints = 0;
  let current;
  let maxPoints =0;
  let position =0;
  do {
    if (!result.length) {
      current = slides[0]
      slides.splice(0,1);
    } else {
      for (let j = 0; j < slides.length; j++) { 
        if (!current || !slides[j]) {
          slides = [];
          break;
        }
        let points = valuation(current, slides[j]);
        //console.log("points", points)
        if (points > maxPoints) {
          maxPoints = points;
          position = j;
        }
        if (maxPoints > 2) break
      }
      totalPoints += maxPoints;
      maxPoints=0;
      current = slides[position];
      //console.log(position)
      slides.splice(position,1);
      
    }
    result.push(current);
//console.log(slides.length)
  } while (slides.length)
  //console.log(result.length)
  console.log("Points: "+totalPoints)
} 

const processPhotoType = (photo) => {
  if (photo.type === 'H') {
    addHorizontalSlides(photo);
  } else {
    return photo;
  }
}

const processPhoto = (photo) => {
  const verticalPhoto = processPhotoType(photo);
  if (verticalPhoto) {
    verticalPhotos.push(verticalPhoto);
  }
}

const getParams = () => {
  return N;
};

const parsePhotoData = async (inputFile) => {
  return new Promise((resolve) => {
    var lineReader = require('readline').createInterface({
      input: require('fs').createReadStream(inputFile)
    });
var i = 0;
    lineReader.on('line', function (line) {
      i++;
      let el = line.split(" ");
      if (el.length < 2) {
        return
      }
      let tags = _.rest(el, 2);

      tags = tags.map(element => {
        if (!map[element]) {
          map[element] = Object.keys(map).length + 1;
        }
        return map[element];
      });
      const photo = { ID: i, type: el[0], ntags: el[1], tags };
      processPhoto(photo);
      data.push(photo);
    });

    lineReader.on('close', () => { resolve(data) })
  })

};

const outputParser = () => {
  // var logger = fs.createWriteStream('log.txt', {
  //   flags: 'a' // 'a' means appending (old data will be preserved)
  // })
  // logger.write(result.length);
  const fileName = `log${new Date().getTime()}.txt`;
  fs.appendFileSync(fileName, result.length) 

  //console.log(result[0])
  result.forEach((slide) => {
    if (slide && slide.ID) {
      fs.appendFileSync(fileName, "\n" + slide.ID);
    }
  });
  // logger.end();
}


const main = async () => {
  // parseamos la informacion, procesando cada foto
  const data1 = await parsePhotoData(process.argv[2]);
  createVerticalSlides();
  joinSlides();
  outputParser();
  return slides;
}

main();

module.exports = {
  parsePhotoData,
  getParams
};