

const valuation = (slide1, slide2) => {
    let common, in1Not2, in2Not1 = 0;
    for(i=0; i<slide1.tags.length; i++){
        if(slide2.tags.includes(slide1.tags[i])) common++;
        else in1Not2++;
    }
    in2Not1 = slide2.tags.length-common;
    return Math.min(common, in1Not2, in2Not1);
};

for(i=0; i<hSlides; i++){
    for(j=i+1; j<vSlides; j++){
        
    }
}

module.exports = {
    valuation
};