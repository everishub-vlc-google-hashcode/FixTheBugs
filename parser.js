const fs = require('fs');

let N = 0;

const getParams = () => {
  return N;
};

const parsePhotoData = (inputFile) => {
  const data = fs.readFileSync(inputFile).toString();
  let photos = [];
  let i = 0;
  while (data.charAt(i) !== "\n" && data.charAt(i) !== "\r") i++;
  N = parseInt(data.substring(0, i), 10);
  console.log("No. of photos (N): " + N);
  if(data.charAt(i) == "\r") {pos = i+2; i = i+2;}
  else pos = ++i;
  i = 0;
  while (i < N) {
      let type = data.charAt(pos);
      pos = pos + 2;
      let j = 0;
      while(data.charAt(pos+j)!== ' ') j++;
      let nTags = parseInt(data.substring(pos,pos+j));
      pos = pos + j + 1;
      let tags = [];
      for(t=0; t<nTags; t++){
          let k = 0;
          while(!(data.charAt(pos+k) == ' ' || data.charAt(pos+k)== '\n' || data.charAt(pos+k)== '\r')) k++;
          let tag = data.substring(pos, pos+k);
          if (data.charAt(pos+k) == '\r') pos = pos + k + 2;
          else pos = pos+k + 1;
          tags.push(tag);
      }
      // console.log(nTags);
    i++;
    photos.push({ID: i, type: type, nTags: nTags, tags: tags});
  }
  return photos;
};

parsePhotoData(process.argv[2]);

module.exports = {
  parsePhotoData,
  getParams
};